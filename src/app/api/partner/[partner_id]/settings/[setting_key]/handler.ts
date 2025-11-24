import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import settingsModelSchema from "@/models/settings-model-schema";
import { yupSettingsSchemaUpdate } from "@/validation-schema/api/yup-settings-schema";
import mongoose from "mongoose";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { encrypt } from "@/lib/api/encrypt";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const partner_id = params?.partner_id;
      const setting_key = params?.setting_key;

      if (!partner_id || !setting_key) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Missing partner_id or setting_key",
            data: null,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const objectId = new mongoose.Types.ObjectId(partner_id);

      const setting = await settingsModelSchema.findOne({
        partner_id: objectId,
        setting_key: setting_key,
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

      const STATIC_IMAGE_ENDPOINT = process.env.STATIC_IMAGE_ENDPOINT || "";
      if (setting?.setting_key === "brand" && setting?.setting_value) {
        const settingValue = setting.setting_value;

        const prependStaticUrl = (path: string | undefined) => {
          if (!path) return "";
          if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
          }
          return `${STATIC_IMAGE_ENDPOINT}${path}`;
        };

        setting.setting_value = {
          ...settingValue,
          logo_with_name: prependStaticUrl(settingValue.logo_with_name),
          logo: prependStaticUrl(settingValue.logo),
        };
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
    try {
      const partner_id = params.partner_id;
      const setting_key = params.setting_key;
      const body = await req.json();

      // ✅ 1. Validate request
      let validatedBody: any;
      try {
        validatedBody = yupSettingsSchemaUpdate.validateSync(body, {
          abortEarly: false,
        });
      } catch (error) {
        const errorObj = yupToFormErrorsServer(error);
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: errorObj,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      // ✅ 2. Get existing setting using both key and partner_id
      const existingSetting = await settingsModelSchema.findOne({
        setting_key: setting_key,
        partner_id: partner_id,
      });

      if (!existingSetting) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Setting Not Found",
            data: null,
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      // ✅ 3. Check for duplicate ONLY IF changing setting_key or partner_id
      const newSettingKey = validatedBody.setting_key;
      const newPartnerId = validatedBody.partner_id?.toString();

      const isDuplicateCheckNeeded =
        newSettingKey !== existingSetting.setting_key ||
        newPartnerId !== existingSetting.partner_id.toString();

      if (isDuplicateCheckNeeded) {
        const duplicate = await settingsModelSchema.findOne({
          setting_key: newSettingKey,
          partner_id: validatedBody.partner_id,
          _id: { $ne: existingSetting._id }, // Exclude current doc
        });

        if (duplicate) {
          return NextResponse.json(
            {
              status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
              message: "Duplicate key error",
              data: {
                setting_key:
                  "This setting_key already exists for the selected partner.",
              },
            },
            { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
          );
        }
      }

      if (params.setting_key == "system_token") {
        if (typeof validatedBody.setting_value == "string") {
          const encryptData = await encrypt(validatedBody.setting_value);

          if (encryptData) {
            validatedBody.setting_value = {
              token_data: encryptData.encryptedData,
              iv: encryptData.iv,
            };
          }
        }
      }

      // ✅ 4. Update by _id — super important
      const updatedSetting = await settingsModelSchema.findOneAndUpdate(
        { _id: existingSetting._id },
        validatedBody,
        { new: true }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Updated Successfully",
          data: updatedSetting,
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("PUT Error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Internal Server Error",
          data: error,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
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
