import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import partnersModelSchema from "@/models/partners-model-schema";
import { Types } from "mongoose";
import automationSessionModelSchema from "@/models/business-automate-flow-session-model-schema";

const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let automationSessionQueryValidation: any = {};

    try {
      automationSessionQueryValidation =
        yupFilterQuerySchema.validateSync(query);
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

      let searchQuery: any = {};
      if (
        automationSessionQueryValidation.q &&
        automationSessionQueryValidation.q.trim() !== ""
      ) {
        const escapedQuery = escapeRegex(
          automationSessionQueryValidation.q.trim()
        );
        searchQuery = {
          $or: [
            {
              "workspace_info.name": {
                $regex: escapedQuery,
                $options: "i",
              },
            },
            {
              "chat_session_info.wa_id": {
                $regex: escapedQuery,
                $options: "i",
              },
            },
            {
              "flow_info.name": {
                $regex: escapedQuery,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};
      if (automationSessionQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          automationSessionQueryValidation.filter
        );
        const filteredObject = _omitBy(
          originalFilterObj,
          (v) => _isNil(v) || v === ""
        );

        const { created_start, created_end, ...restFilters } = filteredObject;

        if (created_start || created_end) {
          filterQuery.created_at = {};
          if (created_start) {
            filterQuery.created_at.$gte = new Date(created_start);
          }
          if (created_end) {
            filterQuery.created_at.$lte = new Date(created_end);
          }
        }

        filterQuery = { ...filterQuery, ...restFilters };
      }

      let sortQuery: Record<string, 1 | -1> = { created_at: -1 };
      const sortParam = automationSessionQueryValidation.sort?.trim();
      if (sortParam) {
        const parsedSort = getJSONObjectFromString(sortParam);
        if (parsedSort?.created_at && !isNaN(Number(parsedSort.created_at))) {
          const direction = Number(parsedSort.created_at) === 1 ? 1 : -1;
          sortQuery = { created_at: direction };
        }
      }

      const skip =
        automationSessionQueryValidation.page > 0
          ? (automationSessionQueryValidation.page - 1) *
            automationSessionQueryValidation.per_page
          : 0;

      const aggregationPipeline = [
        // Sort results
        { $sort: sortQuery },
        // Join with workspaces
        {
          $lookup: {
            from: "workspaces",
            localField: "workspace_id",
            foreignField: "_id",
            as: "workspace_info",
          },
        },
        // Join with chat_sessions using cs_id
        {
          $lookup: {
            from: "chat_sessions",
            localField: "cs_id",
            foreignField: "_id",
            as: "chat_session_info",
          },
        },
        // Join with automate_flows using flow_id
        {
          $lookup: {
            from: "automate_flows",
            localField: "flow_id",
            foreignField: "_id",
            as: "flow_info",
          },
        },
        // Match partner domain and apply filters
        {
          $match: {
            "workspace_info.domain": partner.domain,
            ...searchQuery,
            ...filterQuery,
          },
        },
        // Add formatted fields
        {
          $addFields: {
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
            chat_session: {
              $cond: {
                if: { $gt: [{ $size: "$chat_session_info" }, 0] },
                then: {
                  _id: { $arrayElemAt: ["$chat_session_info._id", 0] },
                  wa_id: { $arrayElemAt: ["$chat_session_info.wa_id", 0] },
                  profile: { $arrayElemAt: ["$chat_session_info.profile", 0] },
                },
                else: null,
              },
            },
            flow: {
              $cond: {
                if: { $gt: [{ $size: "$flow_info" }, 0] },
                then: {
                  _id: { $arrayElemAt: ["$flow_info._id", 0] },
                  name: { $arrayElemAt: ["$flow_info.name", 0] },
                  status: { $arrayElemAt: ["$flow_info.status", 0] },
                },
                else: null,
              },
            },
          },
        },
        // Remove temporary fields
        {
          $project: {
            workspace_info: 0,
            chat_session_info: 0,
            flow_info: 0,
          },
        },

        // Pagination
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: automationSessionQueryValidation.per_page },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];
      const [result] = await automationSessionModelSchema.aggregate(
        aggregationPipeline,
        { allowDiskUse: true }
      );

      const totalCount = result.totalCount[0]?.count || 0;
      // After aggregation, before returning response
      const automationSessions =
        result.data?.map((session: any) => ({
          ...session,
          chat_session: session.chat_session
            ? {
                ...session.chat_session,
                wa_id: session.chat_session.wa_id
                  ? session.chat_session.wa_id.length > 4
                    ? `****${session.chat_session.wa_id.slice(-4)}`
                    : session.chat_session.wa_id
                  : null,
              }
            : null,
        })) || [];

      const finalResponse = {
        per_page: automationSessionQueryValidation.per_page,
        total_page: Math.ceil(
          totalCount / automationSessionQueryValidation.per_page
        ),
        total_result: totalCount,
        items: automationSessions,
        current_page: automationSessionQueryValidation.page,
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
