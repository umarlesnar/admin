import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import workspaceModelSchema from "@/models/workspace-model-schema";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import * as Yup from "yup";
import { Types } from "mongoose";
import { getRealIP } from "@/lib/utils/get-real-ip";

const StatusUpdateSchema = Yup.object().shape({
  status: Yup.string()
    .required("Status is required")
    .oneOf(["ACTIVE", "DISABLE", "SUSPENDED", "DELETION"], "Invalid status"),
  reason: Yup.string().max(500, "Reason too long"),
});

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .patch(async (req: AppNextApiRequest, { params }: any) => {
    const session = await workspaceModelSchema.db.startSession();
    console.log("User:", (req as any).user);

    let transactionStarted = false; // ✅ track state

    try {
      const { workspace_id, partner_id } = params;
      const body = await req.json();

      if (!workspace_id || !Types.ObjectId.isValid(workspace_id)) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Invalid workspace ID",
            data: null,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const { status, reason } = await StatusUpdateSchema.validate(body);

      const workspace = await workspaceModelSchema.findById(workspace_id);
      if (!workspace) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Workspace not found",
            data: null,
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      if (workspace.status === status) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
            message: "Status already set",
            data: { workspace_id, current_status: status },
          },
          { status: SERVER_STATUS_CODE.SUCCESS_CODE }
        );
      }

      // ✅ Start transaction before any DB updates
      session.startTransaction();
      transactionStarted = true;

      const statusMap = {
        ACTIVE: "ACTIVE",
        DISABLE: "DISABLED",
        SUSPENDED: "SUSPENDED",
        DELETION: "DELETION",
      };

      const businessStatus = statusMap[status as keyof typeof statusMap];

      await workspaceModelSchema.updateOne(
        { _id: workspace_id },
        {
          $set: {
            status,
            updated_at: new Date(),
            status_changed_at: new Date(),
            status_changed_by: (req as any).user?.user_id || "SYSTEM",
            status_change_reason: reason,
            status_changed_ip: getRealIP(req),
          },
        },
        { session }
      );

      const userUpdateResult = await workspaceUserModelSchema.updateMany(
        { workspace_id },
        { $set: { status: businessStatus } },
        { session }
      );

      const businessUpdateResult = await businessAccountModelSchema.updateMany(
        { workspace_id },
        { $set: { status: businessStatus } },
        { session }
      );

      await session.commitTransaction();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: {
            workspace_id,
            previous_status: workspace.status,
            new_status: status,
            affected_users: userUpdateResult.modifiedCount,
            affected_accounts: businessUpdateResult.modifiedCount,
          },
          message: "Status updated successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      if (transactionStarted) {
        await session.abortTransaction(); // ✅ only if started
      }
      console.error("Error updating status:", error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: null,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    } finally {
      await session.endSession(); // always safe to end
    }
  });

export default router;
