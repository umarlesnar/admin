import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/utils/mongoose/dbConnect";
import BusinessAccountModel from "@/models/business-account-model-schema";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/next-auth-options";

export async function GET(
  request: NextRequest,
  { params }: { params: { partner_id: string; workspace_id: string; business_id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const business = await BusinessAccountModel.findOne({
      _id: params.business_id,
      workspace_id: params.workspace_id,
    }).select("wb_status is_on_biz_app");

    if (!business) {
      return NextResponse.json({ message: "Business account not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data: business,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { partner_id: string; workspace_id: string; business_id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { status, is_on_biz_app } = body;

    const business = await BusinessAccountModel.findOne({
      _id: params.business_id,
      workspace_id: params.workspace_id,
    });

    if (!business) {
      return NextResponse.json({ message: "Business account not found" }, { status: 404 });
    }

    if (status) {
      business.wb_status = {
        ...business.wb_status,
        status: status,
      };
    }

    if (typeof is_on_biz_app !== "undefined") {
      business.is_on_biz_app = is_on_biz_app;
    }

    await business.save();

    return NextResponse.json({
      status: "success",
      data: business,
      message: "Configuration updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating business config:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
