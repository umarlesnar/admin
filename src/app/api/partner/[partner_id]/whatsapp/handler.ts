import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
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
    let whatsappQueryValidation: any = {};

    try {
      whatsappQueryValidation = yupFilterQuerySchema.validateSync(query);
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
        whatsappQueryValidation.q &&
        whatsappQueryValidation.q.trim() !== ""
      ) {
        const escapedQuery = escapeRegex(whatsappQueryValidation.q.trim());
        searchQuery = {
          $or: [
            {
              name: {
                $regex: escapedQuery,
                $options: "i",
              },
            },
            {
              "workspace_info.name": {
                $regex: escapedQuery,
                $options: "i",
              },
            },
          ],
        };
      }

      // Build filter query
      let filterQuery: any = {};
      if (whatsappQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          whatsappQueryValidation.filter
        );

        const filteredObject = _omitBy(
          originalFilterObj,
          (v) => _isNil(v) || v === ""
        );

        const {
          status,
          created_start,
          created_end,
          updated_start,
          updated_end,
          ...restFilters
        } = filteredObject;

        // Handle status filter
        if (status) {
          filterQuery.status = status;
        }

        // Handle created_at date range filter
        if (created_start || created_end) {
          filterQuery.created_at = {};
          if (created_start) {
            filterQuery.created_at.$gte = new Date(created_start);
          }
          if (created_end) {
            filterQuery.created_at.$lte = new Date(created_end);
          }
        }

        // Handle updated_at date range filter
        if (updated_start || updated_end) {
          filterQuery.updated_at = {};
          if (updated_start) {
            filterQuery.updated_at.$gte = new Date(updated_start);
          }
          if (updated_end) {
            filterQuery.updated_at.$lte = new Date(updated_end);
          }
        }

        filterQuery = { ...filterQuery, ...restFilters };
      }

      // Build sort query
      let sortQuery: Record<string, 1 | -1> = { created_at: -1 };
      const sortParam = whatsappQueryValidation.sort?.trim();
      if (sortParam) {
        const parsedSort = getJSONObjectFromString(sortParam);
        if (parsedSort?.created_at && !isNaN(Number(parsedSort.created_at))) {
          const direction = Number(parsedSort.created_at) === 1 ? 1 : -1;
          sortQuery = { created_at: direction };
        } else if (
          parsedSort?.updated_at &&
          !isNaN(Number(parsedSort.updated_at))
        ) {
          const direction = Number(parsedSort.updated_at) === 1 ? 1 : -1;
          sortQuery = { updated_at: direction };
        }
      }

      // Calculate pagination
      const skip =
        whatsappQueryValidation.page > 0
          ? (whatsappQueryValidation.page - 1) *
            whatsappQueryValidation.per_page
          : 0;

      // Use aggregation pipeline to join with workspace collection
      const aggregationPipeline = [
        // Match business accounts for workspaces in partner's domain
        {
          $lookup: {
            from: "workspaces",
            localField: "workspace_id",
            foreignField: "_id",
            as: "workspace_info",
          },
        },
        {
          $match: {
            "workspace_info.domain": partner.domain,
            type: "META_CLOUD_API",
            ...searchQuery,
            ...filterQuery,
          },
        },
        // Add workspace data to result and exclude sensitive fields
        {
          $project: {
            _id: 1,
            workspace_id: 1,
            channel_type: 1,
            name: 1,
            business_logo_url: 1,
            user_id: 1,
            type: 1,
            business_profile: 1,
            status: 1,
            wb_status: 1,
            created_at: 1,
            updated_at: 1,
            catalog_settings: 1,
            is_migration: 1,
            cloud_provider: 1,
            per_day_limit: 1,
            green_badge: 1,
            is_ai_enabled: 1,
            workspace: {
              $cond: {
                if: { $gt: [{ $size: "$workspace_info" }, 0] },
                then: {
                  _id: { $arrayElemAt: ["$workspace_info._id", 0] },
                  name: { $arrayElemAt: ["$workspace_info.name", 0] },
                  domain: { $arrayElemAt: ["$workspace_info.domain", 0] },
                },
                else: null,
              },
            },
            // Exclude sensitive fields
            // access_token: 0,
            // fb_app_id: 0,
            // wba_id: 0,
            // phone_number_id: 0,
            // default_bot: 0,
            // commands: 0,
          },
        },
        // Sort results
        { $sort: sortQuery },
        // Add pagination metadata
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: whatsappQueryValidation.per_page },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const [result] = await businessAccountModelSchema.aggregate(
        aggregationPipeline
      );

      const totalCount = result.totalCount[0]?.count || 0;
      const whatsappAccounts = result.data || [];

      const finalResponse = {
        per_page: whatsappQueryValidation.per_page,
        total_page: Math.ceil(totalCount / whatsappQueryValidation.per_page),
        total_result: totalCount,
        items: whatsappAccounts,
        current_page: whatsappQueryValidation.page,
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
