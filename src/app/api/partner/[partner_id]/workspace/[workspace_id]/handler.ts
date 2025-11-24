import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import workspaceModelSchema from "@/models/workspace-model-schema";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { Types } from "mongoose";
import { WorkspaceUpdateSchema } from "@/validation-schema/api/yup-workspace-schema";



const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const workspace_id = params?.workspace_id;

      if (!workspace_id || !Types.ObjectId.isValid(workspace_id)) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Invalid workspace ID",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const workspace = await workspaceModelSchema.findOne({
        _id: workspace_id,
      });

      if (!workspace) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Workspace not found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: workspace,
          message: "Success",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("Error fetching workspace:", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: null,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const session = await workspaceModelSchema.db.startSession();

    try {
      const { workspace_id, partner_id } = params;
      const body = await req.json();

      // Validate IDs
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

      if (!partner_id || !Types.ObjectId.isValid(partner_id)) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Invalid partner ID",
            data: null,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }
      // Validate request body
      let validatedData;
      try {
        validatedData = await WorkspaceUpdateSchema.validate(body, {
          abortEarly: false,
          stripUnknown: true,
        });
      } catch (validationError) {
        const errorFormObject = yupToFormErrorsServer(validationError);
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: errorFormObject,
            message: "Validation error",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      // Check workspace exists
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

      // Start transaction
      session.startTransaction();

      // Prepare update data
      const updateData = {
        ...validatedData,
        updated_at: new Date(),
      };

      // Update workspace
      const updatedWorkspace = await workspaceModelSchema.findByIdAndUpdate(
        workspace_id,
        { $set: updateData },
        {
          new: true,
          session,
          runValidators: true,
        }
      );

      // Commit transaction
      await session.commitTransaction();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: {
            workspace_id,
            updated_fields: Object.keys(validatedData),
            workspace: updatedWorkspace,
          },
          message: "Workspace updated successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      await session.abortTransaction();
      console.error("Error updating workspace:", error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: null,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    } finally {
      session.endSession();
    }
  })
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    const session = await workspaceModelSchema.db.startSession();

    try {
      const { workspace_id } = params;

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

      session.startTransaction();

      await workspaceModelSchema.updateOne(
        { _id: workspace_id },
        { $set: { status: "DELETION", updated_at: new Date() } },
        { session }
      );

      const workspaceUserUpdateResult =
        await workspaceUserModelSchema.updateMany(
          { workspace_id },
          { $set: { status: "DISABLED" } },
          { session }
        );

      const businessUpdateResult = await businessAccountModelSchema.updateMany(
        { workspace_id },
        { $set: { status: "DISABLED" } },
        { session }
      );

      await session.commitTransaction();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: {
            workspace_id,
            disabled_workspace_user_count:
              workspaceUserUpdateResult.modifiedCount,
            disabled_business_count: businessUpdateResult.modifiedCount,
          },
          message: "Workspace deleted successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction failed:", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Transaction failed during workspace deletion",
          data: null,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    } finally {
      session.endSession();
    }
  });

export default router;
