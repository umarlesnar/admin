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
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      const query = searchParams.get("query");

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
      }

      // Get all addons with pagination and filtering
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const skip = (page - 1) * limit;

      // Build filters from query params
      const filter: Record<string, any> = {};

      // Apply category filter
      if (searchParams.get("category")) {
        filter.category = searchParams.get("category");
      }

      // Apply billing_type filter
      if (searchParams.get("billing_type")) {
        filter.billing_type = searchParams.get("billing_type");
      }

      // Apply is_public filter
      if (searchParams.has("is_public")) {
        filter.is_public = searchParams.get("is_public") === "true";
      }

      // Text search
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: "i" } },
          { code: { $regex: query, $options: "i" } },
        ];
      }
      

      // Count total documents for pagination
      const total = await addonModalSchema.countDocuments(filter);

      // Get paginated results
      const addons = await addonModalSchema
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({
          [searchParams.get("sortBy") || "code"]:
            searchParams.get("sortOrder") === "desc" ? -1 : 1,
        });

      return NextResponse.json({
        success: true,
        data: {
          items: addons,
          per_page: limit,
          total_page: Math.ceil(total / limit),
          total_result: total,
          current_page: page,
        },
      });
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
  .post(async (req: AppNextApiRequest, { params }: any) => {
    try {
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

      // Check if addon with same code already exists
      const existingAddon = await addonModalSchema.findOne({ code: body.code });
      if (existingAddon) {
        return NextResponse.json(
          {
            success: false,
            error: "An addon with this code already exists",
          },
          { status: 409 }
        );
      }

      // Create new addon
      const newAddon = new addonModalSchema(body);
      await newAddon.save();

      return NextResponse.json(
        {
          success: true,
          data: newAddon,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("POST /api/addon error:", error);
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
