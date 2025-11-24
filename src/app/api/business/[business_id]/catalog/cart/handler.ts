import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = params;
    const business = await businessAccountModelSchema.findOne({
      _id: query.business_id,
    });

    try {
      const fb_url = `${process.env.FACEBOOK_API_URL}/${business.phone_number_id}/whatsapp_commerce_settings`;
      const response = await axios.get(fb_url, {
        headers: {
          Authorization: "Bearer " + business.access_token,
        },
      });

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: response?.data?.data[0],
          message: "success",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    } catch (error: any) {
      console.error(
        "Error fetching WhatsApp Commerce Settings:",
        error.response.data
      );

      return NextResponse.json(
        {
          message: "server error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const { user } = req;
    const query = params;
    const body = await req.json();
    const business = await businessAccountModelSchema.findOne({
      _id: query.business_id,
    });
    const fb_urls = `${process.env.FACEBOOK_API_URL}/${business.phone_number_id}/whatsapp_commerce_settings?is_cart_enabled=${body.is_cart_enable}`;
    try {
      const response = await axios.post(fb_urls, undefined, {
        headers: {
          Authorization: "Bearer " + business.access_token,
        },
      });

      if (response?.data?.success) {
        const updateBusiness =
          await businessAccountModelSchema.findOneAndUpdate(
            { _id: query.business_id },
            {
              "catalog_settings.is_cart_enable": body.is_cart_enable,
            },
            {
              new: true,
            }
          );

        return NextResponse.json(
          {
            data: updateBusiness,
            message: "Cart Enable is update successfully",
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }
    } catch (error: any) {
      console.error("Error fetching WhatsApp Commerce Settings:", error);

      return NextResponse.json(
        {
          data: null,
          message: "Cart Enable is update successfully",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    }
  });
export default router;
