import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import masterModulesModuleSchema from "@/models/master-modules-module-schema";
import { yupMasterModuleSchema } from "@/validation-schema/api/yup-master-module-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const modules_id = params?.modules_id;

      const MasterModules = await masterModulesModuleSchema.findOne({
        _id: modules_id,
      });

      if (!MasterModules) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Modules Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: MasterModules,
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

    let ModulesValidateBody: any = {};
    const modules_id = params?.modules_id;

    //step 1
    try {
        ModulesValidateBody = yupMasterModuleSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Modules Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    //step 2

    try {
      const alreadyExist = await masterModulesModuleSchema.findOne({
        _id: { $ne: modules_id }, // Exclude the current record
        module_id: ModulesValidateBody.module_id, // Check for the same name
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              module_id: "Module already exists.",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const updateModule = await masterModulesModuleSchema.findOneAndUpdate(
        {
          _id: modules_id,
        },
        {
          ...ModulesValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: updateModule,
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
      const modules = await masterModulesModuleSchema.findOne({
        _id: modules_id,
      });

      if (!modules) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Modules Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const deleteModules = await masterModulesModuleSchema.deleteOne({
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
