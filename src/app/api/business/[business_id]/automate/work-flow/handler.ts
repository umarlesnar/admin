import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import workflowModelSchema from "@/models/workflow-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const filterQuery = {
      business_id: params.business_id,
    };

    const automateFlow = await workflowModelSchema
      .find(filterQuery)
      .select("name tags created_at status");

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: automateFlow,
        message: "Success",
      },
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
      }
    );
  });

export default router;
