import axios from "axios";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import commerceProductModelSchema from "@/models/commerce-product-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const query = params;
    const business = await businessAccountModelSchema.findOne({
      _id: query.business_id,
    });

    try {
      let nextCursor = null;
      const fb_url = `${process.env.FACEBOOK_API_URL}/${business?.catalog_settings?.catalog_id}/products?fields=id,retailer_id,name,title,description,availability,condition,price,url,image_url,brand,product_catalog`;
      let productIds: any = [];
      do {
        const response: any = await axios.get(fb_url, {
          headers: {
            Authorization: "Bearer " + business.access_token,
          },
          params: {
            after: nextCursor,
          },
        });

        const products = response?.data?.data;

        for (let i = 0; i < products.length; i++) {
          const product = products[i];

          const alreadyExist = await commerceProductModelSchema.findOne({
            product_id: product.id,
            business_id: query.business_id,
          });

          if (alreadyExist) {
            const update = await commerceProductModelSchema.findOneAndUpdate(
              {
                product_id: product.id,
                business_id: query.business_id,
              },
              {
                business_id: query.business_id,
                product_id: product.id,
                catalog_id: product.product_catalog.id,
                name: product.name,
                product_price: product.price,
                retailer_id: product.retailer_id,
                image_url: product.image_url,
                description: product?.description,
                availability: product?.availability,
                condition: product?.condition,
                link: product?.url,
                brand: product?.brand,
                updated_at: new Date(),
              },
              { new: true }
            );

            productIds.push(update?._id);
          } else {
            const new_product = new commerceProductModelSchema({
              business_id: query.business_id,
              product_id: product.id,
              catalog_id: product.product_catalog.id,
              name: product.name,
              product_price: product.price,
              retailer_id: product.retailer_id,
              image_url: product.image_url,
              description: product?.description,
              availability: product?.availability,
              condition: product?.condition,
              link: product?.url,
              brand: product?.brand,
            });
            const success = await new_product.save();
            productIds.push(new_product?._id);
          }
        }

        nextCursor = response.data.paging?.cursors?.after || null;
      } while (nextCursor);

      if (productIds.length > 0) {
        const deleteMany = await commerceProductModelSchema.deleteMany({
          _id: { $nin: productIds },
          business_id: query.business_id,
        });
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Sync Success",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error: any) {
      console.error("Error fetching Catalog Products", error.response.data);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "server error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });
export default router;
