import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import subscriptionSchema from "@/models/subscription-schema";
import productItemModelSchema from "@/models/product-item-model-schema";
import workspaceModelSchema from "@/models/workspace-model-schema";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const subscriptions = await subscriptionSchema.find({});
    let syncedCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const subscription of subscriptions) {
      try {
        const plan = await productItemModelSchema.findOne({
          _id: subscription.plan_id,
        });

        if (!plan) {
          errorCount++;
          errors.push({
            subscription_id: subscription._id,
            error: "Plan not found",
          });
          continue;
        }

        if (plan.nodes_access) {
          await workspaceModelSchema.updateOne(
            { _id: subscription.workspace_id },
            {
              nodes_available: plan.nodes_access,
            }
          );
          syncedCount++;
        }
      } catch (error) {
        errorCount++;
        errors.push({
          subscription_id: subscription._id,
          error: String(error),
        });
      }
    }

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        message: "Node access sync completed",
        data: {
          total_subscriptions: subscriptions.length,
          synced_count: syncedCount,
          error_count: errorCount,
          errors: errors.length > 0 ? errors : undefined,
        },
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  } catch (error) {
    console.error("Error syncing node access:", error);
    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SERVER_ERROR,
        message: "Failed to sync node access",
        data: error,
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
}
