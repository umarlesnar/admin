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

    // 1. Get Partner Domain
    const partner = await PartnersModel.findById(params.partner_id).select("domain");
    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    }

    // 2. Find workspaces where nodes_available has configured entries
    // We check if index 0 exists in either array to see if it is not empty
    const workspaces = await WorkspaceModel.find({
      domain: partner.domain,
      $or: [
        { "nodes_available.bot_flow.0": { $exists: true } },
        { "nodes_available.work_flow.0": { $exists: true } },
      ],
    })
    .select("name domain nodes_available status created_at")
    .sort({ updated_at: -1 });

    return NextResponse.json({
      status: "success",
      data: workspaces,
    });
  } catch (error: any) {
    console.error("Error fetching configured workspaces:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}