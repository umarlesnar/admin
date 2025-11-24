import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import workflowLogSchema from "@/models/workflow-log-schema";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);
      query.work_flow_id = params.work_flow_id;
      const workFlow_log = await workflowLogSchema
        .findOne({
          workflow_id: query.work_flow_id,
        })
        .sort({ created_at: -1 });

      if (workFlow_log) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
            data: workFlow_log,
            message: "Success",
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      } else {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
            data: null,
            message: "Workflow log not found",
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "Server Error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });
export default router;
