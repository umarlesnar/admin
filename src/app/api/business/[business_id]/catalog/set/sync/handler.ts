import axios from "axios";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import commerceSetsModalSchema from "@/models/commerce-sets-modal-schema";

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
      const fb_url = `${process.env.FACEBOOK_API_URL}/${business?.catalog_settings?.catalog_id}/product_sets?fields=products.limit(30){image_url,id,name,retailer_id,price,availability,condition},product_catalog,id,name,product_count`;
      const response = await axios.get(fb_url, {
        headers: {
          Authorization: "Bearer " + business.access_token,
        },
      });

      let setIds: any = [];

      const sets = response?.data?.data;

      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];

        if (set?.name != "All Products") {
          const alreadyExist = await commerceSetsModalSchema.findOne({
            set_id: set.id,
            business_id: params.business_id,
          });

          if (alreadyExist) {
            const update = await commerceSetsModalSchema.findOneAndUpdate(
              {
                set_id: set.id,
                business_id: params.business_id,
              },
              {
                business_id: params.business_id,
                set_id: set.id,
                catalog_id: set.product_catalog.id,
                name: set.name,
                product_count: set?.product_count,
                products: set?.products?.data,
                updated_at: new Date(),
              },
              { new: true }
            );
            setIds.push(update?._id);
          } else {
            const new_sets = new commerceSetsModalSchema({
              business_id: params.business_id,
              set_id: set.id,
              catalog_id: set.product_catalog.id,
              name: set.name,
              product_count: set?.product_count,
              products: set?.products?.data,
              updated_at: new Date(),
            });
            const success = await new_sets.save();
            setIds.push(new_sets?._id);
          }
        }
      }

      if (setIds.length > 0) {
        const deleteMany = await commerceSetsModalSchema.deleteMany({
          _id: { $nin: setIds },
          business_id: params.business_id,
        });
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "success",
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
