import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import businessAccountModel from "@/models/business-account-model-schema";
import userAccountModel from "@/models/user-account-model-schema";
import businessContactModel from "@/models/business-contact-model-schema";
import broadcastModel from "@/models/broadcast-model-schema";
import automateFlowModel from "@/models/business-automate-flow-model-schema";
import automateFlowSessionModel from "@/models/business-automate-flow-session-model-schema";
import workflowModel from "@/models/workflow-model-schema";
import workflowLogModel from "@/models/workflow-log-schema";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { RequestContext } from "next/dist/server/base-server";
import businessConversationModelSchema from "@/models/business-conversation-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();

function getMonthTimestampRange(monthOffset = 0) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() - monthOffset;

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    start: Math.floor(start.getTime() / 1000),
    end: Math.floor(end.getTime() / 1000),
  };
}

router.use(apiMiddlerware).get(async (req: AppNextApiRequest) => {
  try {
    const { start: currMonthStart, end: currMonthEnd } =
      getMonthTimestampRange(0);
    const { start: lastMonthStart, end: lastMonthEnd } =
      getMonthTimestampRange(1);

    const [
      incommingCount,
      outgoingCount,
      lastMonthIncommingCount,
      lastMonthOutgoingCount,
      activeBusinessCount,
      inactiveBusinessCount,
      onboardingUserCount,
      contactCount,
      ongoingBroadcastCount,
      flowCount,
      flowSessionCount,
      workflowCount,
      workflowLogCount,
    ] = await Promise.all([
      businessConversationModelSchema.countDocuments({
        io_type: "INCOMMING",
        timestamp: { $gte: currMonthStart, $lte: currMonthEnd },
      }),
      businessConversationModelSchema.countDocuments({
        io_type: "OUTGOING",
        timestamp: { $gte: currMonthStart, $lte: currMonthEnd },
      }),
      businessConversationModelSchema.countDocuments({
        io_type: "INCOMMING",
        timestamp: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
      businessConversationModelSchema.countDocuments({
        io_type: "OUTGOING",
        timestamp: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
      businessAccountModel.countDocuments({ status: "ACTIVE" }),
      businessAccountModel.countDocuments({ status: { $nin: ["ACTIVE"] } }),
      userAccountModel.countDocuments({
        business_id: { $exists: false },
        status: "ACTIVE",
      }),
      businessContactModel.countDocuments({}),
      broadcastModel.countDocuments({
        status: { $nin: ["COMPLETED", "FAILED"] },
      }),
      automateFlowModel.countDocuments(),
      automateFlowSessionModel.countDocuments(),
      workflowModel.countDocuments(),
      workflowLogModel.countDocuments(),
    ]);

    return NextResponse.json(
      {
        statusCode: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: {
          incomming: incommingCount,
          outgoing: outgoingCount,
          lastMonthIncomming: lastMonthIncommingCount,
          lastMonthOutgoing: lastMonthOutgoingCount,
          activeBusiness: activeBusinessCount,
          inactiveBusiness: inactiveBusinessCount,
          onboardingUsers: onboardingUserCount,
          contacts: contactCount,
          onboardingBroadcasts: ongoingBroadcastCount,
          flows: flowCount,
          flowSessions: flowSessionCount,
          workflows: workflowCount,
          workflowLogs: workflowLogCount,
        },
        message: "SUCCESS",
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        statusCode: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server error. Please try again later.",
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
});

export default router;
