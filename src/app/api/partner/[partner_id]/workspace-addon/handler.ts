import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { AppNextApiRequest } from "@/types/interface";
import workspaceModelSchema from "@/models/workspace-model-schema";
import { yupWorkspaceAddonSchema } from "@/validation-schema/api/yup-workspace-addon-schema";
import workspaceAddonSchema from "@/models/workspace-addon-schema";
import partnersModelSchema from "@/models/partners-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
    const { searchParams } = new URL(req.url);
    const partnerId = params.partner_id;

    if (!Types.ObjectId.isValid(partnerId)) {
      return NextResponse.json({ success: false, error: "Invalid partner_id" }, { status: 400 });
    }

    const partner = await partnersModelSchema.findById(partnerId);
    if (!partner) {
      return NextResponse.json({ success: false, error: "Partner not found" }, { status: 404 });
    }

    const partnerDomain = partner.domain;

    const matchingWorkspaces = await workspaceModelSchema.find({ domain: partnerDomain }, "_id");
    const workspaceIds = matchingWorkspaces.map((w) => w._id);

    const filter: Record<string, any> = { workspace_id: { $in: workspaceIds } };

    const addon_id = searchParams.get("addon_id");
    if (addon_id && Types.ObjectId.isValid(addon_id)) {
      filter.addon_id = new Types.ObjectId(addon_id);
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const total = await workspaceAddonSchema.countDocuments(filter);

    const workspaceAddons = await workspaceAddonSchema
      .find(filter)
      .populate("workspace_id", "name domain")
      .populate("addon_id", "name code")
      .skip(skip)
      .limit(limit)
      .sort({
        [searchParams.get("sortBy") || "activated_at"]:
          searchParams.get("sortOrder") === "asc" ? 1 : -1,
      });

    return NextResponse.json({
      success: true,
      data: {
        items: workspaceAddons,
        per_page: limit,
        total_page: Math.ceil(total / limit),
        total_result: total,
        current_page: page,
      },
    });
  } catch (error: any) {
    console.error("GET /api/partner/[partner_id]/workspace-addon error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
})

  .post(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const body = await req.json();

      try {
        await yupWorkspaceAddonSchema.validate(body, { abortEarly: false });
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

      const existingRelation = await workspaceAddonSchema.findOne({
        workspace_id: body.workspace_id,
        addon_id: body.addon_id,
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

      const newWorkspaceAddon = new workspaceAddonSchema(body);
      await newWorkspaceAddon.save();

      await newWorkspaceAddon.populate("workspace_id", "name");
      await newWorkspaceAddon.populate("addon_id", "name code");

      return NextResponse.json(
        {
          success: true,
          data: newWorkspaceAddon,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("POST /api/workspace-addon error:", error);
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
