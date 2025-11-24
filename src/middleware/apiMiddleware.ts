import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import dbConnect from "@/lib/utils/mongoose/dbConnect";
import { nextAuthOptions } from "@/lib/next-auth-options";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

export const apiMiddlerware = async (req: any, event: any, next: () => any) => {
  try {
    await dbConnect();
    const secret = process.env.NEXTAUTH_SECRET!;
    const session: any = await getServerSession(nextAuthOptions);

    if (session) {
      req.user = session.user;
      return await next();
    }
    else {
      const token = await getToken({ req, secret });
      if (token?.user) {
        req.user = token.user;
        return await next();
      } else {
        const headersList = headers();
        const authorization = headersList.get('authorization');
        if (authorization?.startsWith('Bearer ')) {
          const jwtToken = authorization.substring(7);
          const decoded = jwt.verify(jwtToken, secret);
          req.user = decoded;
          return await next();
        }
      }
    }

    return NextResponse.json(
      {
        message: "Unauthorized Access",
      },
      { status: SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE }
    );
  } catch (error) {
    console.log("DB Connection Fialed", error);
    return NextResponse.json(
      {
        data: "DB Connection Issue",
      },
      {
        status: SERVER_STATUS_CODE.SERVER_ERROR,
      }
    );
  }
};

