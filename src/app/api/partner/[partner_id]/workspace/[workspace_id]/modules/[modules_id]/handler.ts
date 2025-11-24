import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import workspaceModulesModelSchema from "@/models/workspace-modules-model-schema";
import { yupWorkspaceModuleSchema } from "@/validation-schema/api/yup-workspace-module-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const modules_id = params?.modules_id;
      
      const workspacemodules = await workspaceModulesModelSchema.findOne({
        _id: modules_id,
      });

      if (!workspacemodules) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Workspace Modules Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: workspacemodules,
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

    let WorkspaceModulesValidateBody: any = {};
    const modules_id = params?.modules_id;

    //step 1
    try {
        WorkspaceModulesValidateBody = yupWorkspaceModuleSchema.validateSync(body);
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
      const alreadyExist = await workspaceModulesModelSchema.findOne({
        _id: { $ne: modules_id },
        module_id: WorkspaceModulesValidateBody.module_id,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "Workspace Modules Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const updateModulesStatus = await workspaceModulesModelSchema.findOneAndUpdate(
        {
          _id: modules_id,
        },
        {
          ...WorkspaceModulesValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: updateModulesStatus,
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
      const modules_id = params?.modules_id;
  
      try {
        const WorkspaceModule = await workspaceModulesModelSchema.findOne({
          _id: modules_id,
        });
  
        if (!WorkspaceModule) {
          return NextResponse.json(
            {
              status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
              data: null,
              message: "Workspace Module Not Found",
            },
            { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
          );
        }
  
        const DeleteWorkspaceModule = await workspaceModulesModelSchema.deleteOne({
          _id: modules_id,
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
