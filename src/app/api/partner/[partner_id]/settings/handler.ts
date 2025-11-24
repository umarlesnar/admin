import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import settingsModelSchema from "@/models/settings-model-schema";
import { yupSettingsSchema } from "@/validation-schema/api/yup-settings-schema";
import mongoose from "mongoose";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { encrypt } from "@/lib/api/encrypt";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const setting = await settingsModelSchema.find({
        partner_id: new mongoose.Types.ObjectId(params?.partner_id),
      });

      if (!setting) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Setting not found for the given partner ID.",
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
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let settingsValidateBody: any = {};

    try {
      settingsValidateBody = yupSettingsSchema.validateSync(body);
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
        setting_key: settingsValidateBody?.setting_key,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              setting_key: "Settings Key Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }

      if (settingsValidateBody.setting_key == "system_token") {
        if (typeof settingsValidateBody.setting_value == "string") {
          const encryptData = await encrypt(settingsValidateBody.setting_value);

          if (encryptData) {
            settingsValidateBody.setting_value = {
              token_data: encryptData.encryptedData,
              iv: encryptData.iv,
            };
          }
        }
      }

      const newsettings = new settingsModelSchema({
        ...settingsValidateBody,
      });

      await newsettings.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newsettings,
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
