import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import policiesModelSchema from "@/models/policies-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const policies = await policiesModelSchema.find({}).select("name");

      let updated_policies: any = [];
      for (let index = 0; index < policies.length; index++) {
        let element = { ...policies[index]._doc };

        element.value = element._id;

        updated_policies.push(element);
      }

      return NextResponse.json({
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: updated_policies,
        message: "Successs",
      });
    } catch (error) {
      console.log("error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "Server Error",
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;
