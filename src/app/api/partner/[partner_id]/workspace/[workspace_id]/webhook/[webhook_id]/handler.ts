import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import adminWebhookEndpointsSchema from "@/models/admin-webhook-endpoints-schema";
import { yupWebhookEndpointsSchema } from "@/validation-schema/api/yup-admin-webhook-endpoints";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const webhook_id = params?.webhook_id;
      
      const webhook = await adminWebhookEndpointsSchema.findOne({
        _id: webhook_id,
      });

      if (!webhook) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Webhook Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: webhook,
          message: "Success",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
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
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let WebhookValidateBody: any = {};
    const webhook_id = params?.webhook_id;
    const workspace_id = params?.workspace_id;

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
        _id: { $ne: webhook_id },
        name: WebhookValidateBody.name,
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

      const updateWebhook = await adminWebhookEndpointsSchema.findOneAndUpdate(
        {
          _id: webhook_id,
          workspace_id: workspace_id,
        },
        {
          ...WebhookValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: updateWebhook,
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
  })
    .delete(async (req: AppNextApiRequest, { params }: any) => {
      const webhook_id = params?.webhook_id;
      const workspace_id = params?.workspace_id;
  
      try {
       
        const webhook = await adminWebhookEndpointsSchema.findOne({
          _id: webhook_id,
          workspace_id: workspace_id,
        });
  
        if (!webhook) {
          return NextResponse.json(
            {
              status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
              data: null,
              message: "Webhook Not Found",
            },
            { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
          );
        }
  
        const DeleteWebhook = await adminWebhookEndpointsSchema.deleteOne({
          _id: webhook_id,
          workspace_id: workspace_id,
        });
  
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
            message: "Success",
            data: null,
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
