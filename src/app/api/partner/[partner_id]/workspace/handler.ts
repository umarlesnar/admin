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
import _isNil from "lodash/isNil";
import moment from "moment";
import workspaceModelSchema from "@/models/workspace-model-schema";
import { YupWorkspaceSortQuery } from "@/validation-schema/api/yup-workspace-schema";
import businessWalletSchema from "@/models/business-wallet-schema";
import userAccountModelSchema from "@/models/user-account-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";
import subscriptionSchema from "@/models/subscription-schema";
import { Types } from "mongoose";

// Helper function to escape regex special characters
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let workspaceQueryValidation: any = {};

    try {
      workspaceQueryValidation = yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      const ErrorFormObject = yupToFormErrorsServer(error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: "query validation error",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    try {
      const partner_id = params?.partner_id;

      // Validate partner_id to prevent NoSQL injection
      if (!partner_id || !isValidObjectId(partner_id)) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Invalid partner ID",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const partner = await partnersModelSchema.findById(partner_id);

      if (!partner) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Partner Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      // Build search query with proper regex escaping
      let searchQuery: any = {};
      if (
        workspaceQueryValidation.q &&
        workspaceQueryValidation.q.trim() !== ""
      ) {
        const escapedQuery = escapeRegex(workspaceQueryValidation.q.trim());
        searchQuery = {
          $or: [
            {
              name: {
                $regex: escapedQuery,
                $options: "i",
              },
            },
          ],
        };
      }

      // Build filter query
      let filterQuery: any = {};
      let planTypeFilter: string | null = null;
      if (workspaceQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          workspaceQueryValidation.filter
        );

        const filteredObject = _omitBy(
          originalFilterObj,
          (v) => _isNil(v) || v === ""
        );

        // Extract plan_type filter separately
        if (filteredObject?.plan_type) {
          planTypeFilter = filteredObject.plan_type;
          delete filteredObject.plan_type;
        }

        if (filteredObject?.partner_id) {
          const partnerDoc = await partnersModelSchema.findOne({
            _id: filteredObject?.partner_id,
          });

          if (partnerDoc) {
            filteredObject.domain = partnerDoc.domain;
            delete filteredObject.partner_id;
          }
        }

        filterQuery = filteredObject;
      }

      // Build sort query
      let sortQuery: Record<string, 1 | -1> = { created_at: -1 };
      const sortParam = workspaceQueryValidation.sort?.trim();
      if (sortParam) {
        const parsedSort = getJSONObjectFromString(sortParam);
        try {
          const validatedSort = YupWorkspaceSortQuery.validateSync(parsedSort);
          sortQuery = validatedSort as Record<string, 1 | -1>;
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      }

      // Calculate pagination
      const skip =
        workspaceQueryValidation.page > 0
          ? (workspaceQueryValidation.page - 1) *
            workspaceQueryValidation.per_page
          : 0;

      const aggregationPipeline = [
        // Match workspaces for partner's domain
        {
          $match: {
            domain: partner.domain,
            ...searchQuery,
            ...filterQuery,
          },
        },
        // Lookup business accounts (channels)
        {
          $lookup: {
            from: "business_accounts",
            localField: "_id",
            foreignField: "workspace_id",
            as: "channels",
          },
        },
        // Only include workspaces with channels
        {
          $match: {
            "channels.0": { $exists: true },
          },
        },
        // Lookup subscription data
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscription_id",
            foreignField: "_id",
            as: "subscription",
          },
        },
        // Lookup wallet data
        {
          $lookup: {
            from: "wallets",
            localField: "_id",
            foreignField: "workspace_id",
            as: "wallet",
          },
        },
        // Lookup owner details
        {
          $lookup: {
            from: "user_accounts",
            localField: "owner_account_id",
            foreignField: "_id",
            as: "owner",
          },
        },
        // Add computed fields
        {
          $addFields: {
            channel_types: {
              $setUnion: ["$channels.channel_type", []],
            },
            plan_type: {
              $ifNull: [{ $arrayElemAt: ["$subscription.plan_type", 0] }, null],
            },
            subscription_expiry_date: {
              $cond: {
                if: { $arrayElemAt: ["$subscription.r_end_at", 0] },
                then: {
                  $dateFromString: {
                    dateString: {
                      $dateToString: {
                        date: {
                          $toDate: {
                            $multiply: [
                              { $arrayElemAt: ["$subscription.r_end_at", 0] },
                              1000,
                            ],
                          },
                        },
                      },
                    },
                  },
                },
                else: null,
              },
            },
            subscription_days_remaining: {
              $cond: {
                if: { $arrayElemAt: ["$subscription.r_end_at", 0] },
                then: {
                  $max: [
                    0,
                    {
                      $ceil: {
                        $divide: [
                          {
                            $subtract: [
                              { $arrayElemAt: ["$subscription.r_end_at", 0] },
                              { $divide: [Date.now(), 1000] },
                            ],
                          },
                          86400,
                        ],
                      },
                    },
                  ],
                },
                else: null,
              },
            },
            credit_balance: {
              $ifNull: [{ $arrayElemAt: ["$wallet.credit_balance", 0] }, 0],
            },
            current_balance: {
              $ifNull: [{ $arrayElemAt: ["$wallet.current_balance", 0] }, 0],
            },
            owner_username: {
              $ifNull: [{ $arrayElemAt: ["$owner.username", 0] }, null],
            },
            owner_phone: {
              $let: {
                vars: {
                  firstPhone: { $arrayElemAt: ["$owner.mobile_number", 0] },
                },
                in: {
                  $cond: {
                    if: "$$firstPhone",
                    then: "$$firstPhone.display_number",
                    else: null,
                  },
                },
              },
            },
          },
        },
        // Filter by plan_type if specified
        ...(planTypeFilter
          ? [
              {
                $match: {
                  plan_type: planTypeFilter,
                },
              },
            ]
          : []),
        // Remove unnecessary fields
        {
          $project: {
            channels: 0,
            subscription: 0,
            wallet: 0,
            owner: 0,
            owner_account_id: 0,
            bot_user_id: 0,
            billing_address: 0,
            img_repo_id: 0,
          },
        },
        // Sort results
        { $sort: sortQuery },
        // Add pagination metadata
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: workspaceQueryValidation.per_page },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const [result] = await workspaceModelSchema.aggregate(
        aggregationPipeline
      );

      const finalResponse = {
        per_page: workspaceQueryValidation.per_page,
        total_page: Math.ceil(
          (result.totalCount[0]?.count || 0) / workspaceQueryValidation.per_page
        ),
        total_result: result.totalCount[0]?.count || 0,
        items: result.data || [],
        current_page: workspaceQueryValidation.page,
      };

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: finalResponse,
        message: "Success",
      });
    } catch (error) {
      console.error("SERVER_ERROR", error);
      return NextResponse.json({
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server Error",
      });
    }
  })
  .post(async (req) => {
    try {
      const body = await req.json();
      const filterPayload = body;

      const user = await userAccountModelSchema.findOne({
        _id: filterPayload.user_id,
      });

      if (!user) {
        return NextResponse.json({
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "User not found",
        });
      }

      const generateRandomString = async (): Promise<string> => {
        const randomCharCode = () => Math.floor(Math.random() * 26) + 65;
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
          return generateRandomString(); // fix: return recursive call
        }

        return randomLetter.toLowerCase();
      };

      const unique_id = await generateRandomString();

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
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365 * 10,
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
