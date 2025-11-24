import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    const user_id = params?.user_id;
    const partner_id = params?.partner_id;

    try {
      const partner = await partnersModelSchema.findById(partner_id);
      if (!partner) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Invalid partner ID",
            data: {},
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }
      const users = await userAccountModelSchema.findOne({
        _id: user_id,
        domain: partner.domain,
      });

      if (!users) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Users Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const hasWorkspace = await workspaceUserModelSchema.find({
        user_accound_id:users._id
      })

      if (hasWorkspace.length > 0) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "User has workspace",
            data: {},
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const deleteUser = await userAccountModelSchema.deleteOne({
        _id: user_id,
        domain: partner.domain,
      });

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: null,
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("Error", error);
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
