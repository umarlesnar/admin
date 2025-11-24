import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";
import partnersModelSchema from "@/models/partners-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import subscriptionSchema from "@/models/subscription-schema";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import { Types } from "mongoose";
import paymentInvoiceSchema from "@/models/payment-invoice-schema";

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
    let BillingInvoiceQueryValidation: any = {};

    try {
        BillingInvoiceQueryValidation = yupFilterQuerySchema.validateSync(query);
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
        BillingInvoiceQueryValidation.q &&
        BillingInvoiceQueryValidation.q.trim() !== ""
      ) {
        const escapedQuery = escapeRegex(BillingInvoiceQueryValidation.q.trim());
        searchQuery = {
          $or: [
            {
              plan: {
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
      if (BillingInvoiceQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
            BillingInvoiceQueryValidation.filter
        );

        const filteredObject = _omitBy(
          originalFilterObj,
          (v) => _isNil(v) || v === ""
        );

        const { start, end, subscription_status, ...restFilters } =
          filteredObject;
        // Handle subscription status filter
        // Handle subscription status filter
        if (subscription_status) {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          if (subscription_status === "active") {
            filterQuery.r_end_at = { $gt: currentTimestamp };
          } else if (subscription_status === "expired") {
            filterQuery.r_end_at = { $lte: currentTimestamp };
            filterQuery.status = "active"; // Only show active subscriptions that are expired
          }
          // If subscription_status === "all", no filter is applied
        }

        if (start || end) {
          filterQuery.r_end_at = {};
          if (start) {
            filterQuery.r_end_at.$gte = Number(start);
          }
          if (end) {
            filterQuery.r_end_at.$lte = Number(end);
          }
        }
        filterQuery = { ...filterQuery, ...restFilters };
      }

      // Build sort query
      let sortQuery: Record<string, 1 | -1> = { created_at: -1 };
      const sortParam = BillingInvoiceQueryValidation.sort?.trim();
      if (sortParam) {
        const parsedSort = getJSONObjectFromString(sortParam);
        if (parsedSort?.created_at && !isNaN(Number(parsedSort.created_at))) {
          const direction = Number(parsedSort.created_at) === 1 ? 1 : -1;
          sortQuery = { created_at: direction };
        }
      }

      // Calculate pagination
      const skip =
      BillingInvoiceQueryValidation.page > 0
          ? (BillingInvoiceQueryValidation.page - 1) *
          BillingInvoiceQueryValidation.per_page
          : 0;

      // Use aggregation pipeline to join with workspace collection
      const aggregationPipeline = [
        // Match subscriptions for workspaces in partner's domain
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
            ...searchQuery,
            ...filterQuery,
          },
        },
        // Add workspace data to result
        {
          $addFields: {
            workspace: {
              $cond: {
                if: { $gt: [{ $size: "$workspace_info" }, 0] },
                then: {
                  _id: { $arrayElemAt: ["$workspace_info._id", 0] },
                  name: { $arrayElemAt: ["$workspace_info.name", 0] },
                  country: { $arrayElemAt: ["$workspace_info.country", 0] },
                  status: { $arrayElemAt: ["$workspace_info.status", 0] },
                  notification: {
                    $arrayElemAt: ["$workspace_info.notification", 0],
                  },
                },
                else: null,
              },
            },
          },
        },
        // Remove the temporary workspace_info field
        {
          $project: {
            workspace_info: 0,
          },
        },
        // Sort results
        { $sort: sortQuery },
        // Add pagination metadata
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: BillingInvoiceQueryValidation.per_page },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const [result] = await paymentInvoiceSchema.aggregate(aggregationPipeline);

      const totalCount = result.totalCount[0]?.count || 0;
      const BillingInvoice = result.data || [];

      const finalResponse = {
        per_page: BillingInvoiceQueryValidation.per_page,
        total_page: Math.ceil(
          totalCount / BillingInvoiceQueryValidation.per_page
        ),
        total_result: totalCount,
        items: BillingInvoice,
        current_page: BillingInvoiceQueryValidation.page,
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
