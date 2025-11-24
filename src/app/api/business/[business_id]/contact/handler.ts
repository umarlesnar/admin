import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessContactModelSchema from "@/models/business-contact-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const business_id = params.business_id;

    const filterQuery = {
      business_id: business_id,
    };

    const contacts = await businessContactModelSchema.find(filterQuery);

    return NextResponse.json({
      status: SERVER_STATUS_CODE.SUCCESS_CODE,
      data: contacts,
      message: "success",
    });
  });

export default router;
