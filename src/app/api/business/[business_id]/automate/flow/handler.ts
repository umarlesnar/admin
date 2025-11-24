import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import businessAutomateFlowModelSchema from "@/models/business-automate-flow-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const filterQuery = {
      business_id: params.business_id,
    };

    const automateFlow = await businessAutomateFlowModelSchema
      .find(filterQuery)
      .select(
        "name trigger_count step_finished_count finished_count created_at"
      );

    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: automateFlow,
      },
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
      }
    );
  });

export default router;
