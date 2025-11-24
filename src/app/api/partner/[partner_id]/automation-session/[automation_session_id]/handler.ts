import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";
import { Types } from "mongoose";
import automationSessionModelSchema from "@/models/business-automate-flow-session-model-schema";

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    const { user } = req;

    if (!user?.role || !["SYSTEM", "ADMIN"].includes(user.role)) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Only SYSTEM and ADMIN users can be Access",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    try {
      const partner_id = params?.partner_id;
      const automation_session_id = params?.automation_session_id;

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

      if (!automation_session_id || !isValidObjectId(automation_session_id)) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Invalid automation session ID",
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

      const sessionPipeline = [
        {
          $match: {
            _id: new Types.ObjectId(automation_session_id),
          },
        },
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
          },
        },
      ];

      const [session] = await automationSessionModelSchema.aggregate(
        sessionPipeline
      );

      if (!session) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Automation session not found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      await automationSessionModelSchema.deleteOne({
        _id: automation_session_id,
      });

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Automation Session Deleted",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("DELETE_AUTOMATION_SESSION_ERROR", error);
      return NextResponse.json({
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server Error",
      });
    }
  });

export default router;
