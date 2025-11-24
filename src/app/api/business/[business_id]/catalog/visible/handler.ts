import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import axios from "axios";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const query = params;
    const body = await req.json();
    const business = await businessAccountModelSchema.findOne({
      _id: query.business_id,
    });

    const fb_urls = `${process.env.FACEBOOK_API_URL}/${business.phone_number_id}/whatsapp_commerce_settings?is_catalog_visible=${body.is_catalog_visible}`;

    try {
      const response = await axios.post(fb_urls, undefined, {
        headers: {
          Authorization: "Bearer " + business.access_token,
          // "Content-Type": "application/json",
        },
      });

      if (response?.data?.success) {
        const updateBusiness =
          await businessAccountModelSchema.findOneAndUpdate(
            { _id: query.business_id },
            {
              "catalog_settings.is_catalog_visible": body.is_catalog_visible,
            },
            {
              new: true,
            }
          );

        return NextResponse.json(
          {
            data: updateBusiness,
            message: "Catelog visible is update successfully",
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      } else {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Catelog visible is update unsuccessfully",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }
    } catch (error: any) {
      console.error(
        "Error fetching WhatsApp Commerce Settings:",
        error?.response?.data
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
  });
export default router;
