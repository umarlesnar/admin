import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import partnersModelSchema from "@/models/partners-model-schema";
import { yupPartnersSchema } from "@/validation-schema/api/yup-partners-schema";
import settingsModelSchema from "@/models/settings-model-schema";
import patnerUserAccountModelSchema from "@/models/patner-user-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest) => {
    const query = await getServerSearchParams(req);
    let searchQuery: any = {};

    if (query.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${query.q}.*`,
              $options: "i",
            },
          },
          {
            type: {
              $regex: `.*${query.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    const perPage = query.per_page || 15;
    const page = query.page > 0 ? query.page : 1;
    const skip = (page - 1) * perPage;

    const totalCount = await partnersModelSchema.countDocuments();
    const partners = await partnersModelSchema
      .find(searchQuery)
      .skip(skip)
      .limit(perPage);

    return NextResponse.json({
      data: {
        per_page: perPage,
        total_page: Math.ceil(totalCount / perPage),
        total_result: totalCount,
        items: partners,
        current_page: page,
      },
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let partnersValidateBody: any = {};

    try {
      partnersValidateBody = yupPartnersSchema.validateSync(body);
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
      const alreadyExist = await partnersModelSchema.findOne({
        domain: partnersValidateBody?.domain,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              domain: "Domain Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }

      const emailExist = await patnerUserAccountModelSchema.findOne({
        "email.email_id": partnersValidateBody.email.email_id,
      });

      if (emailExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              user: "Email Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }
      const PhoneExist = await patnerUserAccountModelSchema.findOne({
        "phone.mobile_number": partnersValidateBody.phone.mobile_number,
      });

      if (PhoneExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              user: "Mobile Number Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }

      const patnerUserExist = await patnerUserAccountModelSchema.findOne({
        username: partnersValidateBody.email.email_id,
      });

      if (patnerUserExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              user: "User Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }

      const newPartners = new partnersModelSchema({
        name: partnersValidateBody.name,
        domain: partnersValidateBody.domain,
      });

      const newPatnerUser = new patnerUserAccountModelSchema({
        patner_id: newPartners._id,
        auth_type: 1,
        username: partnersValidateBody.email.email_id,
        profile: {
          first_name: partnersValidateBody.first_name,
          last_name: partnersValidateBody.last_name,
        },
        auth_credentials: {
          password: partnersValidateBody.password,
        },
        ...partnersValidateBody,
      });

      await newPatnerUser.save();

      newPartners.owner_account_id = newPatnerUser._id;

      await newPartners.save();

      const settingsToInsert = [
        {
          setting_category: "SYSTEM",
          setting_key: "razorpay_secret_key",
          setting_value: "",
          value_type: "string",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "razorpay_endpoint_key",
          setting_value: "",
          value_type: "string",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "razorpay_key_id",
          setting_value: "",
          value_type: "string",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "facebook",
          setting_value: {
            facebook_app_id: "",
            facebook_business_id: "",
            facebook_client_secret: "",
            facebook_sdk_url: "",
            facebook_sdk_version: "v22.0",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "discount_percentage_yearly",
          setting_value: 0,
          value_type: "number",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "new_registration_subscription",
          setting_value: false,
          value_type: "boolean",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "google_captcha",
          setting_value: false,
          value_type: "boolean",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "google_site_key",
          setting_value: "",
          value_type: "string",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "google_site_secret",
          setting_value: "",
          value_type: "string",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "google_auth",
          setting_value: {
            client_id: "",
            client_secret: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "system_token",
          setting_value: {
            token_data: "",
            iv: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "websocket_endpoint",
          setting_value: "https://" + partnersValidateBody.domain.trim(),
          value_type: "string",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "pay_as_you_go",
          setting_value: {
            is_enable: true,
            amount: 0,
            tax_percentage: 0,
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "brand",
          setting_value: {
            name: partnersValidateBody.name,
            contact_email: "",
            logo_with_name: "",
            logo: "",
            dark: "#143518",
            light: "#FFFFFF",
            primary: "#4AC959",
            primary_100: "#C7EECC",
            primary_200: "#ACE6B3",
            primary_300: "#86DB90",
            primary_400: "#6ED47A",
            primary_50: "#EDFAEE",
            primary_500: "#4AC959",
            primary_600: "#43B751",
            primary_700: "#358F3F",
            primary_800: "#296F31",
            primary_900: "#1F5425",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "google_auth",
          setting_value: {
            is_enable: false,
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "whatsapp",
          setting_value: {
            token: "",
            url: "",
            config_id: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "smtp_config",
          setting_value: {
            smtp_username: "",
            smtp_password: "",
            smtp_host: "",
            smtp_port: "",
            smtp_from: "",
            smtp_secure: "",
            smtp_ignore_tls: "",
            smtp_auth_disabled: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "google_sheet",
          setting_value: {
            google_sheets_client_id: "",
            google_sheets_client_secret: "",
            google_sheets_api_key: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "s3_storage",
          setting_value: {
            s3_access_key: "",
            s3_secret_key: "",
            s3_bucket: "",
            s3_port: "",
            s3_endpoint: "",
            s3_ssl: "",
            s3_region: "",
            s3_public_custom_domain: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
        {
          setting_category: "SYSTEM",
          setting_key: "kwic",
          setting_value: {
            workflow_url: "",
          },
          value_type: "object",
          is_private: true,
          is_core_setting: true,
          domain: partnersValidateBody.domain,
          partner_id: newPartners._id,
        },
      ];

      await settingsModelSchema.insertMany(settingsToInsert);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newPartners,
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("new Error", error);
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
