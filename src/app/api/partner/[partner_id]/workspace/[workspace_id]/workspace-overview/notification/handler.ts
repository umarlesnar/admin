import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dbMiddleware from "@/middleware/dbMiddleware";
import workspaceModelSchema from "@/models/workspace-model-schema";
import { YupWorkspaceNotificationInfoSchema } from "@/validation-schema/api/yup-workspace-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(dbMiddleware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const body = await req.json();
      const workspace_id = params?.workspace_id;

      // ✅ Step 1: Validate request body
      const validatedBody =
        YupWorkspaceNotificationInfoSchema.validateSync(body);

      // ✅ Step 2: Update DB
      const updatedWorkspace = await workspaceModelSchema.findByIdAndUpdate(
        workspace_id,
        { notification: validatedBody },
        { new: true }
      );

      if (!updatedWorkspace) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Workspace not found",
            data: null,
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Workspace notification info updated successfully",
          data: updatedWorkspace, // return updated data if useful
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error: any) {
      // ✅ Handle Yup validation errors separately
      if (error.name === "ValidationError") {
        const errorObj = yupToFormErrorsServer(error);
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Body validation error",
            data: errorObj,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      console.error("Error updating workspace notification:", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server error",
          data: error.message || error,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;
