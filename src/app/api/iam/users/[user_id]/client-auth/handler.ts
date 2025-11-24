import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import userAccountModelSchema from "@/models/user-account-model-schema";
import clientAuthSession from "@/models/client-auth-session";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const user_id = params?.user_id;

      const user = await userAccountModelSchema.findOne({
        _id: user_id,
      });

      if (!user) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "user Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const clientauth = await clientAuthSession.find(
        { user_id: user_id },
        { auth_id: 1, platform: 1, created_at: 1 }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: {
            ClientAuth: clientauth,
          },
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

router.delete(async (req: AppNextApiRequest, { params }: any) => {
  try {
    const user_id = params?.user_id;
    const { auth_id } = await req.json();

    const user = await userAccountModelSchema.findOne({ _id: user_id });

    if (!user) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          message: "User Not Found",
        },
        { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
      );
    }

    const deletedAuth = await clientAuthSession.findOneAndDelete({
      _id: auth_id,
      user_id: user_id,
    });

    if (!deletedAuth) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          message: "Client authentication session not found",
        },
        { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
      );
    }

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        message: "Client authentication session deleted successfully",
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
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
});

export default router;
