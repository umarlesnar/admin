// src/app/api/partner/[partner_id]/node-permissions/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/utils/mongoose/dbConnect";
import WorkspaceModel from "@/models/workspace-model-schema";
import PartnersModel from "@/models/partners-model-schema";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/next-auth-options";

export async function GET(
  request: NextRequest,
  { params }: { params: { partner_id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("per_page") || "10");
    const q = searchParams.get("q") || "";
    const skip = (page - 1) * limit;

    // 1. Get Partner Domain
    const partner = await PartnersModel.findById(params.partner_id).select("domain");
    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    }

    // 2. Build Query
    const query: any = {
      domain: partner.domain,
      $or: [
        { "nodes_available.bot_flow.0": { $exists: true } },
        { "nodes_available.work_flow.0": { $exists: true } },
      ],
    };

    if (q) {
      query.name = { $regex: q, $options: "i" };
    }

    // 3. Fetch Data with Pagination
    const [workspaces, total] = await Promise.all([
      WorkspaceModel.find(query)
        .select("name domain nodes_available status created_at")
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(limit),
      WorkspaceModel.countDocuments(query),
    ]);

    return NextResponse.json({
      status: "success",
      data: workspaces,
      meta: {
        total,
        page,
        per_page: limit,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching configured workspaces:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}