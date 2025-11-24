import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { AppNextApiRequest } from "@/types/interface";
import * as yup from "yup";
import workspaceAddonSchema from "@/models/workspace-addon-schema";
import { yupWorkspaceAddonValidationSchema } from "@/validation-schema/api/yup-workspace-addon-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      // Get a single workspace addon by ID
      if (id) {
        const workspaceAddon = await workspaceAddonSchema
          .findById(id)
          .populate("workspace_id", "name") // Assuming workspace has a name field
          .populate("addon_id", "name code"); // Populate addon details

        if (!workspaceAddon) {
          return NextResponse.json(
            {
              success: false,
              error: "Workspace addon not found",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: workspaceAddon,
        });
      } else {
        throw new Error("Workspace addon ID is required");
      }
    } catch (error: any) {
      console.error("GET /api/workspace-addon error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Server error",
        },
        { status: 500 }
      );
    }
  })  
  .put(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const id = params?.workspace_addon_id;
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Workspace addon ID is required",
          },
          { status: 400 }
        );
      }
  
      const body = await req.json();
  
      if (typeof body.workspace_id === "object" && body.workspace_id?._id) {
        body.workspace_id = body.workspace_id._id.replace(/['"]+/g, "");
      }
  
      if (typeof body.addon_id === "object" && body.addon_id?._id) {
        body.addon_id = body.addon_id._id.replace(/['"]+/g, "");
      }
  
      if (body.workspace_id && body.addon_id) {
        const existingRelation = await workspaceAddonSchema.findOne({
          workspace_id: body.workspace_id,
          addon_id: body.addon_id,
          _id: { $ne: id },
        });
  
        if (existingRelation) {
          return NextResponse.json(
            {
              success: false,
              error: "This workspace already has this addon activated",
            },
            { status: 409 }
          );
        }
      }
  
      try {
        const partialSchema = yup.object().shape(
          Object.keys(body).reduce((acc: Record<string, any>, key) => {
            const field = (yupWorkspaceAddonValidationSchema as any).fields[key];
            if (field) acc[key] = field;
            return acc;
          }, {})
        );
  
        if (Object.keys(partialSchema.fields).length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: "No valid fields provided for update.",
            },
            { status: 400 }
          );
        }
  
        await partialSchema.validate(body, { abortEarly: false });
      } catch (validationError: any) {
        console.error("Validation error:", validationError.errors);
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            details: validationError.errors,
          },
          { status: 400 }
        );
      }
  
      const updatedWorkspaceAddon = await workspaceAddonSchema
        .findByIdAndUpdate(
          id,
          { $set: body },
          { new: true, runValidators: true }
        )
        .populate("workspace_id", "name")
        .populate("addon_id", "name code");
  
      if (!updatedWorkspaceAddon) {
        return NextResponse.json(
          {
            success: false,
            error: "Workspace addon not found",
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        success: true,
        data: updatedWorkspaceAddon,
      });
    } catch (error: any) {
      console.error("PUT /api/workspace-addon error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Server error",
        },
        { status: 500 }
      );
    }
  })

  .delete(async (req: AppNextApiRequest, { params }: any) => {
    try {
      // const { searchParams } = new URL(req.url);
      // const id = searchParams.get("id");

      const id = params?.workspace_addon_id;
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Workspace addon ID is required",
          },
          { status: 400 }
        );
      }

      // Delete workspace addon relation
      const deletedWorkspaceAddon =
        await workspaceAddonSchema.findByIdAndDelete(id);

      if (!deletedWorkspaceAddon) {
        return NextResponse.json(
          {
            success: false,
            error: "Workspace addon not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Workspace addon deactivated successfully",
      });
    } catch (error: any) {
      console.error("DELETE /api/workspace-addon error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Server error",
        },
        { status: 500 }
      );
    }
  });

export default router;
