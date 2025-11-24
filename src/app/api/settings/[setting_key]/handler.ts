import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import settingsModelSchema from "@/models/settings-model-schema";
import { yupSettingsSchemaUpdate } from "@/validation-schema/api/yup-settings-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const setting_key = params?.setting_key;

      const setting = await settingsModelSchema.findOne({
        setting_key: setting_key,
      });

      if (!setting) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Setting Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: setting,
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

    let settingsValidateBody: any = {};
    const setting_key = params?.setting_key;

    //step 1
    try {
      settingsValidateBody = yupSettingsSchemaUpdate.validateSync(body);
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

    try {
      const alreadyExist = await settingsModelSchema.findOne({
        setting_key: settingsValidateBody.setting_key,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              setting_key: "Setting Nothing",
            },
          },
          {
            status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          }
        );
      }

      const updateSetting = await settingsModelSchema.findOneAndUpdate(
        {
          setting_key: setting_key,
        },
        {
          ...settingsValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: updateSetting,
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
    const setting_key = params?.setting_key;

    try {
      const setting = await settingsModelSchema.findOne({
        setting_key: setting_key,
      });

      if (!setting) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Setting Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const deleteSetting = await settingsModelSchema.deleteOne({
        setting_key: setting_key,
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
