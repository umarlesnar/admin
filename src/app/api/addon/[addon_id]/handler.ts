import { apiMiddlerware } from "@/middleware/apiMiddleware";
import addonModalSchema from "@/models/addon-modal-schema";
import { AppNextApiRequest } from "@/types/interface";
import { yupAddonSchema } from "@/validation-schema/api/yup-addon-schema";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const id = params?.addon_id;
      // Get a single addon by ID
      if (id) {
        const addon = await addonModalSchema.findById(id);
        if (!addon) {
          return NextResponse.json(
            { success: false, error: "Addon not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: addon });
      } else {
        throw new Error("Addon ID is required");
      }
    } catch (error: any) {
      console.error("GET /api/addon error:", error);
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
      const id = params?.addon_id;
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Addon ID is required",
          },
          { status: 400 }
        );
      }

      // Parse request body
      const body = await req.json();

      // Validate input data against Yup schema
      try {
        await yupAddonSchema.validate(body, { abortEarly: false });
      } catch (validationError: any) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            details: validationError.errors,
          },
          { status: 400 }
        );
      }

      // Check if code is being changed and if it conflicts with existing addon
      if (body.code) {
        const existingAddon = await addonModalSchema.findOne({
          code: body.code,
          _id: { $ne: id },
        });

        if (existingAddon) {
          return NextResponse.json(
            {
              success: false,
              error: "An addon with this code already exists",
            },
            { status: 409 }
          );
        }
      }

      // Update addon
      const updatedAddon = await addonModalSchema.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true }
      );

      if (!updatedAddon) {
        return NextResponse.json(
          {
            success: false,
            error: "Addon not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedAddon,
      });
    } catch (error: any) {
      console.error("PUT /api/addon error:", error);
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
      const id = params?.addon_id;
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Addon ID is required",
          },
          { status: 400 }
        );
      }

      // Delete addon
      const deletedAddon = await addonModalSchema.findByIdAndDelete(id);

      if (!deletedAddon) {
        return NextResponse.json(
          {
            success: false,
            error: "Addon not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Addon deleted successfully",
      });
    } catch (error: any) {
      console.error("DELETE /api/addon error:", error);
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
