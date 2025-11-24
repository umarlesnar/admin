import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import businessBroadcastQueue from "@/models/business-broadcast-queue";
import broadcastModelSchema from "@/models/broadcast-model-schema";
import queueSchema from "@/models/queue-schema";
import partnersModelSchema from "@/models/partners-model-schema";
import { Types } from "mongoose";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
 .delete(async (req: AppNextApiRequest, { params }: any) => {
  try {
    const partner_id = params?.partner_id;
    const broadcast_id = params?.broadcast_id;

    // Validate partner
    const partner = await partnersModelSchema.findById(partner_id);
    if (!partner) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          data: null,
          message: "Partner Not Found",
        },
        { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
      );
    }

    // Match broadcast against partner domain 
    const broadcastPipeline = [
      {
        $match: { _id: new Types.ObjectId(broadcast_id) },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace_id",
          foreignField: "_id",
          as: "workspace_info",
        },
      },
      {
        $match: {
          "workspace_info.domain": partner.domain,
        },
      },
    ];

    const [broadcast] = await broadcastModelSchema.aggregate(broadcastPipeline);

    if (!broadcast) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          data: null,
          message: "Broadcast not found for this partner",
        },
        { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
      );
    }

    if (broadcast.queue_id) {
      await queueSchema.deleteOne({ _id: broadcast.queue_id });
    }

    await broadcastModelSchema.deleteOne({ _id: broadcast._id });

   await businessBroadcastQueue.deleteMany({
      broadcast_id: new Types.ObjectId(broadcast_id),
    });

    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: null,
        message: "Broadcast Deleted Successfully",
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  } catch (error) {
    console.error("DELETE_BROADCAST_ERROR", error);
    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server Error",
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
});

export default router;
