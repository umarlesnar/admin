import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dbMiddleware from "@/middleware/dbMiddleware";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omit from "lodash/omit";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import userAccountModelSchema from "@/models/user-account-model-schema";
import {
  yupUserAccountSchema,
  yupUserSchema,
  yupUserSortSchema,
} from "@/validation-schema/api/yup-user-schema";
import { generatePasswordHash } from "@/lib/utils/generate-password-hash";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const { partner_id } = params;

    // Step 1: Fetch partner by ID to get domain
    const partner = await partnersModelSchema.findById(partner_id);
    if (!partner) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Invalid partner ID",
          data: {},
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
    const query = await getServerSearchParams(req);

    let UsersQueryValidation: any = {};
    try {
      UsersQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    let searchQuery: any = {};

    if (UsersQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            "profile.first_name": {
              $regex: `.*${UsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            "profile.last_name": {
              $regex: `.*${UsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            "phone.mobile_number": {
              $regex: `.*${UsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            username: {
              $regex: `.*${UsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (UsersQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        UsersQueryValidation.filter
      );
      let filteredObject = _omitBy(originalFilterObj, _isEmpty);

      if (filteredObject?.partner_id) {
        const patner = await partnersModelSchema.findOne({
          _id: filteredObject?.partner_id,
        });

        if (patner) {
          filteredObject.domain = patner.domain;
          filteredObject = _omit(filteredObject, ["partner_id"]);
        }
      }

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (UsersQueryValidation.sort != "") {
      const _lstry: any = UsersQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupUserSortSchema.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      domain: partner.domain,
      is_bot: false,
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: UsersQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: UsersQueryValidation.page,
    };

    const totalCount = await userAccountModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      UsersQueryValidation.page > 0
        ? (UsersQueryValidation.page - 1) * UsersQueryValidation.per_page
        : 0;
    let UserAccount = await userAccountModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = UserAccount;

    return NextResponse.json(
      {
        data: finalResponse,
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  });
router.use(dbMiddleware).post(async (req, { params }: any) => {
  const { partner_id } = params;
  try {
    const body = await req.json();

    // Validate the request body

    const filterPayload = body;
    let validatedpayload: any = {};
    try {
      validatedpayload = yupUserSchema.validateSync(body);
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

    // Check for existing mobile number

    const partner = await partnersModelSchema.findById(partner_id);
    if (!partner) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Invalid partner ID",
          data: {},
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    const mobileNumberCount = await userAccountModelSchema.countDocuments({
      "phone.mobile_number": filterPayload.phone[0].mobile_number,
      domain: partner.domain,
    });

    if (mobileNumberCount !== 0) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: {
            phone: {
              mobile_number: "Mobile number already exists",
            },
          },
          message: "Validation Error",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    // Check for existing email ID
    const emailCount = await userAccountModelSchema.countDocuments({
      "email.email_id": filterPayload.email[0].email_id,
      domain: partner.domain,
    });

    if (emailCount !== 0) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: {
            email: {
              email_id: "Email ID already exists",
            },
          },
          message: "Validation Error",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    // Check for existing user with the same username

    const user = await userAccountModelSchema.findOne({
      username: filterPayload.email[0].email_id,
      domain: partner.domain,
    });

    if (user) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: {
            email: {
              email_id: "Email ID already exists",
            },
          },
          message: "Validation Error",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    const password = generatePasswordHash(
      filterPayload.auth_credentials.password
    );

    // Create new use
    const newUser = new userAccountModelSchema({
      domain: partner.domain,
      auth_type: 1,
      parent_id: null,
      username: filterPayload.email[0].email_id,
      profile: filterPayload.profile,
      email: filterPayload.email,
      phone: filterPayload.phone,
      auth_credentials: {
        password: password,
      },
      is_onboard: true,

      permissions: {
        whatsapp_chat: true,
        instagram: true,
        web_chat: true,
        contact: true,
        broadcast: true,
        template: true,
        automation: true,
        ecommerce: true,
        integration: true,
        analytics: true,
        channel_whatsapp_profile: true,
        settings_general_operator: true,
        settings_general_wallet: true,
        settings_general_payment: true,
        settings_general_subscription: true,
        settings_general_developer: true,
        settings_general_tag: true,
      },

      status: "ACTIVE",
    });

    await newUser.save();

    // const generateRandomString = async () => {
    //   const randomCharCode = () => Math.floor(Math.random() * 26) + 65; // ASCII code for uppercase letters
    //   const randomLetter = String.fromCharCode(
    //     randomCharCode(),
    //     randomCharCode(),
    //     randomCharCode(),
    //     randomCharCode(),
    //     randomCharCode()
    //   );

    //   const workspaceExist = await workspaceModelSchema.findOne({
    //     img_repo_id: randomLetter.toLowerCase(),
    //   });

    //   if (workspaceExist) {
    //     generateRandomString();
    //   }

    //   return randomLetter.toLowerCase();
    // };

    // let unique_id = await generateRandomString();

    // const new_workspace = new workspaceModelSchema({
    //   ...domainexist,
    //   name: filterPayload.workspace_name,
    //   img_repo_id: unique_id,
    //   owner_account_id: newUser._id,
    //   created_at: new Date(),
    //   created_by: newUser._id,
    //   user_id: newUser._id,
    //   status: "ACTIVE",
    // });

    // const new_wallet = new businessWalletSchema({
    //   workspace_id: new_workspace._id,
    //   created_at: moment().unix(),
    //   updated_at: moment().unix(),
    // });
    // await new_wallet.save();

    // const bot_user = new userAccountModelSchema({
    //   ...domainexist,
    //   is_bot: true,
    //   is_default_bot: true,
    //   auth_type: 0,
    //   user_type: "BOT",
    //   username: `bot_${new_workspace._id}`,
    //   profile: {
    //     first_name: "BOT",
    //   },
    //   visibility: "HIDDEN",
    //   role: "ADMINISTRATOR",
    //   status: "ACTIVE",
    // });
    // await bot_user.save();

    // new_workspace.bot_user_id = bot_user._id;

    // await new_workspace.save();

    // const new_workspace_user = new workspaceUserModelSchema({
    //   ...domainexist,
    //   user_account_id: newUser._id,
    //   workspace_id: new_workspace._id,
    //   first_name: newUser.profile.first_name,
    //   last_name: newUser.profile.last_name,
    //   is_bot: false,
    //   role: "OWNER",
    //   permissions: {
    //     whatsapp_chat: true,
    //     instagram: true,
    //     web_chat: true,
    //     contact: true,
    //     broadcast: true,
    //     template: true,
    //     automation: true,
    //     ecommerce: true,
    //     integration: true,
    //     analytics: true,
    //     channel_whatsapp_profile: true,
    //     settings_general_operator: true,
    //     settings_general_wallet: true,
    //     settings_general_payment: true,
    //     settings_general_subscription: true,
    //     settings_general_developer: true,
    //     settings_general_tag: true,
    //   },
    //   status: "ACTIVE",
    //   created_at: new Date(),
    // });

    // await new_workspace_user.save();

    // const new_bot_staff = new workspaceUserModelSchema({
    //   ...domainexist,
    //   user_account_id: bot_user._id,
    //   workspace_id: new_workspace._id,
    //   first_name: "BOT",
    //   is_bot: true,
    //   role: "ADMINISTRATOR",
    //   permissions: {
    //     whatsapp_chat: true,
    //     instagram: true,
    //     web_chat: true,
    //     contact: true,
    //     broadcast: true,
    //     template: true,
    //     automation: true,
    //     ecommerce: true,
    //     integration: true,
    //     analytics: true,
    //     channel_whatsapp_profile: true,
    //     settings_general_operator: true,
    //     settings_general_wallet: true,
    //     settings_general_payment: true,
    //     settings_general_subscription: true,
    //     settings_general_developer: true,
    //     settings_general_tag: true,
    //   },
    //   status: "ACTIVE",
    //   created_at: new Date(),
    // });

    // await new_bot_staff.save();

    const response = NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: null,
        message: "Registered Successfully",
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );

    return response;
  } catch (error: any) {
    console.error("Error during user registration:", error);

    if (error.name === "ValidationError") {
      const err_output = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: err_output,
          message: "Validation Error",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Internal Server Error",
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
});

export default router;
