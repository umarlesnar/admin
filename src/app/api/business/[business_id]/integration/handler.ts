import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import installedAppsSchema from "@/models/installed-apps-schema";
import integrationModelSchema from "@/models/integration-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const business_id = params?.business_id;

      const installationapps = await installedAppsSchema.find({
        business_id: business_id,
      });

      let updatedapps: any = [];

      for (let i = 0; i < installationapps.length; i++) {
        let element = { ...installationapps[i]._doc };

        const integrationlibrary = await integrationModelSchema.findOne({
          type: element.type,
        });

        if (integrationlibrary) {
          element.name = integrationlibrary.name;
          element.description = integrationlibrary.description;
          element.image_url = integrationlibrary.image_url;
        } else {
          element.name = "name not found";
          element.description = "description not found";
          element.image_url = "image_url not found";
        }

        updatedapps.push(element);
      }
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: updatedapps,
          message: "Success",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: error,
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
