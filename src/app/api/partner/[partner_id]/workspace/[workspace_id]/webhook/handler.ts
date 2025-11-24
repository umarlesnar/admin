import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import adminWebhookEndpointsSchema from "@/models/admin-webhook-endpoints-schema";
import { yupWebhookEndpointsSchema } from "@/validation-schema/api/yup-admin-webhook-endpoints";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let webhookQueryValidation: any = {};
    try {
        webhookQueryValidation = yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      let ErrorFormObject = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: " ",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    try {
      let searchQuery: any = {};

      if (webhookQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              name: {
                $regex: `.*${webhookQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (webhookQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
            webhookQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }

      let sortQuery: any = { r_end_at: -1 };

      let finalFilterQuery = {
        workspace_id: params.workspace_id,
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: webhookQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: webhookQueryValidation.page,
      };

      const totalCount = await adminWebhookEndpointsSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
      webhookQueryValidation.page > 0
          ? (webhookQueryValidation.page - 1) *
          webhookQueryValidation.per_page
          : 0;
      let webhooks = await adminWebhookEndpointsSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);

      finalResponse.items = webhooks;

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: finalResponse,
        message: "Success",
      });
    } catch (error) {
      console.log("SERVER_ERROR", error);

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server Error",
      });
    }
  })
    .post(async (req: AppNextApiRequest, { params }: any) => {
      const body = await req.json();
             
      let WebhookValidateBody: any = {};
  
      //step 1
      try {
        WebhookValidateBody = yupWebhookEndpointsSchema.validateSync(body);
      } catch (error) {
        const errorObj = yupToFormErrorsServer(error);
  
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Body Validation Error",
            data: errorObj,
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }
      //step 2
  
      try {
        const alreadyExist = await adminWebhookEndpointsSchema.findOne({
          name: WebhookValidateBody?.name,
        });
  
        if (alreadyExist) {
          return NextResponse.json(
            {
              status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
              message: "Validation Error",
              data: {
                name: "Webhook Already Exist",
              },
            },
            {
              status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            }
          );
        }
  
        const newwebhook = new adminWebhookEndpointsSchema({
          ...WebhookValidateBody,
          workspace_id: params.workspace_id,
        });
  
        await newwebhook.save();
  
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
            message: "Success",
            data: newwebhook,
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      } catch (error) {
        console.log("Error", error);
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SERVER_ERROR,
            message: "Server Error",
            data: error,
          },
          {
            status: SERVER_STATUS_CODE.SERVER_ERROR,
          }
        );
      }
    });

export default router;
