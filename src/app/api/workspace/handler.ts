import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omit from "lodash/omit";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";
import workspaceModelSchema from "@/models/workspace-model-schema";
import { YupWorkspaceSortQuery } from "@/validation-schema/api/yup-workspace-schema";
import businessWalletSchema from "@/models/business-wallet-schema";
import userAccountModelSchema from "@/models/user-account-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let workspaceQueryValidation: any = {};
    try {
      workspaceQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (workspaceQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${workspaceQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (workspaceQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        workspaceQueryValidation.filter
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

    if (workspaceQueryValidation.sort != "") {
      const _lstry: any = workspaceQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = YupWorkspaceSortQuery.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: workspaceQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: workspaceQueryValidation.page,
    };

    const totalCount = await workspaceModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      workspaceQueryValidation.page > 0
        ? (workspaceQueryValidation.page - 1) *
          workspaceQueryValidation.per_page
        : 0;
    let workspace = await workspaceModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = workspace;
    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req) => {
    try {
      const body = await req.json();

      // Validate the request body

      const filterPayload = body;

      // Check for existing mobile number
      const user = await userAccountModelSchema.findOne({
        _id: filterPayload.user_id,
      });

      if (!user) {
        return NextResponse.json({
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "User not found",
        });
      }

      const generateRandomString = async () => {
        const randomCharCode = () => Math.floor(Math.random() * 26) + 65; // ASCII code for uppercase letters
        const randomLetter = String.fromCharCode(
          randomCharCode(),
          randomCharCode(),
          randomCharCode(),
          randomCharCode(),
          randomCharCode()
        );

        const workspaceExist = await workspaceModelSchema.findOne({
          img_repo_id: randomLetter.toLowerCase(),
        });

        if (workspaceExist) {
          generateRandomString();
        }

        return randomLetter.toLowerCase();
      };

      let unique_id = await generateRandomString();

      const new_workspace = new workspaceModelSchema({
        domain: user.domain,
        name: filterPayload.name,
        img_repo_id: unique_id,
        owner_account_id: filterPayload.user_id,
        created_at: new Date(),
        created_by: filterPayload.user_id,
        user_id: filterPayload.user_id,
        status: "ACTIVE",
        billing_address: {
          email_id: filterPayload.billing_address.email_id,
          billing_country: filterPayload.billing_address.billing_country,
          company_name: filterPayload.billing_address.company_name,
          address_1: filterPayload.billing_address.address_1,
          address_2: filterPayload.billing_address.address_2,
          city: filterPayload.billing_address.city,
          state: filterPayload.billing_address.state,
          zip_code: filterPayload.billing_address.zip_code,
        },
      });

      const new_wallet = new businessWalletSchema({
        workspace_id: new_workspace._id,
        created_at: moment().unix(),
        updated_at: moment().unix(),
      });
      await new_wallet.save();

      const bot_user = new userAccountModelSchema({
        is_bot: true,
        is_default_bot: true,
        auth_type: 0,
        user_type: "BOT",
        username: `bot_${new_workspace._id}`,
        profile: {
          first_name: "BOT",
        },
        visibility: "HIDDEN",
        role: "ADMINISTRATOR",
        status: "ACTIVE",
        domain: user.domain,
      });
      await bot_user.save();

      new_workspace.bot_user_id = bot_user._id;

      await new_workspace.save();

      const new_workspace_user = new workspaceUserModelSchema({
        user_account_id: user._id,
        workspace_id: new_workspace._id,
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        is_bot: false,
        role: "OWNER",
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
        created_at: new Date(),
      });

      await new_workspace_user.save();

      const new_bot_staff = new workspaceUserModelSchema({
        user_account_id: bot_user._id,
        workspace_id: new_workspace._id,
        first_name: "BOT",
        is_bot: true,
        role: "ADMINISTRATOR",
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
        created_at: new Date(),
      });

      await new_bot_staff.save();

      const response = NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Registered Successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );

      response.cookies.set("workspace_id", new_workspace._id, {
        httpOnly: true,
        secure: false, // Available in both dev & prod
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
        path: "/",
      });

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
