import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { AppNextApiRequest } from "@/types/interface";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import dbMiddleware from "@/middleware/dbMiddleware";
import jwt from "jsonwebtoken";
import Bcrypt from "bcryptjs";
import adminUserAccountSchema from "@/models/admin-user-account-schema";
const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(dbMiddleware).post(async (req: AppNextApiRequest) => {
  const body = await req.json();

  try {
    let user = await adminUserAccountSchema.findOne({
      auth_type: 1,
      username: body.username,
      status: "ACTIVE",
    });

    if (!user) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "invalid username and password",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    const compare = await Bcrypt.compare(
      body.password,
      user.auth_credentials.password
    );

    if (!compare) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "invalid username and password",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    const jwtClaims = {
      sub: user._id.toString(),
      business_id: user.business_id,
      name: user.profile.first_name,
      role: user.role,
      display_profile: {
        _id: user._id.toString(),
        profile: {
          first_name: user.profile.first_name,
        },
        is_bot: user.is_bot,
      },
      email: user.profile.email,
      user_id: user._id.toString(),
      app_id: "",
    };
    const encodedToken = jwt.sign(jwtClaims, process.env.NEXTAUTH_SECRET!, {
      algorithm: "HS256",
    });

    return NextResponse.json(
      { token: encodedToken },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  } catch (error) {}

  return NextResponse.json(
    {
      status_code: SERVER_STATUS_CODE.SERVER_ERROR,
      data: body,
      message: "server error",
    },
    { status: SERVER_STATUS_CODE.SERVER_ERROR }
  );
});

export default router;
