import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import broadcastModelSchema from "@/models/broadcast-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = { business_id: params.business_id };

    const broadcasts = await broadcastModelSchema.find(query);

    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: broadcasts,
      },
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
      }
    );
  });

export default router;
