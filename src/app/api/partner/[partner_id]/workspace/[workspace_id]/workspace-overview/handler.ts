import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import dbMiddleware from "@/middleware/dbMiddleware";
import workspaceModelSchema from "@/models/workspace-model-schema";
import {
  YupworkspaceOverviewSchema,
  YupworkspaceSchema,
} from "@/validation-schema/api/yup-workspace-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(dbMiddleware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const workspace_id = params?.workspace_id;

      const business = await workspaceModelSchema.find({
        _id: workspace_id,
      });

      if (!business) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Business Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: business,
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

    let WorkspaceValidateBody: any = {};
    const workspace_id = params?.workspace_id;

    //step 1
    try {
      WorkspaceValidateBody = YupworkspaceOverviewSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Boday Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    //step 2

    try {
      const alreadyExist = await workspaceModelSchema.findOne({
        _id: { $ne: workspace_id },
        "billing_address.email_id":
          WorkspaceValidateBody.billing_address.email_id,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              workspace: "Email already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const updateTemplate = await workspaceModelSchema.findOneAndUpdate(
        {
          _id: workspace_id,
        },
        {
          ...WorkspaceValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: {
            billing_address: updateTemplate?.billing_address,
          },
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
