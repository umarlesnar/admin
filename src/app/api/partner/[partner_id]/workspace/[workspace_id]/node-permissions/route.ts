import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/utils/mongoose/dbConnect";
import WorkspaceModel from "@/models/workspace-model-schema";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/next-auth-options";

// GET: Fetch permissions for a specific workspace ID
export async function GET(
  request: NextRequest,
  { params }: { params: { partner_id: string; workspace_id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspace = await WorkspaceModel.findById(params.workspace_id).select(
      "nodes_available"
    );

    if (!workspace) {
      return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json({
      nodes_available: workspace.nodes_available || { bot_flow: [], work_flow: [] },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Save permissions for a specific workspace ID
export async function POST(
  request: NextRequest,
  { params }: { params: { partner_id: string; workspace_id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nodes_available } = body;

    const workspace = await WorkspaceModel.findByIdAndUpdate(
      params.workspace_id,
      { $set: { nodes_available: nodes_available } },
      { new: true }
    );

    if (!workspace) {
        return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Permissions updated successfully",
      nodes_available: workspace.nodes_available,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}