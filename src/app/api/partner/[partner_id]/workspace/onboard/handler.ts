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
import workspaceModelSchema from "@/models/workspace-model-schema";
import { YupWorkspaceSortQuery } from "@/validation-schema/api/yup-workspace-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";
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
      if (workspaceQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          workspaceQueryValidation.filter
        );

        const filteredObject = _omitBy(
          originalFilterObj,
          (v) => _isNil(v) || v === ""
        );

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

      // Use aggregation pipeline with $facet for better performance
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
        // Only include workspaces WITHOUT channels (onboard candidates)
        {
          $match: {
            "channels.0": { $exists: false },
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
            owner_auth_type: {
              $ifNull: [{ $arrayElemAt: ["$owner.auth_type", 0] }, null],
            },
            owner_profile: {
              $ifNull: [{ $arrayElemAt: ["$owner.profile", 0] }, null],
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
        // Remove unnecessary fields
        {
          $project: {
            channels: 0,
            subscription: 0,
            wallet: 0,
            owner: 0,
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
  });

export default router;
