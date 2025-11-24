import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import dbConnect from "@/lib/utils/mongoose/dbConnect";
import { NextRequest, NextResponse } from "next/server";
export default async function dbMiddleware(
  req: NextRequest,
  event: any,
  next: () => any
) {
  await dbConnect();
  return await next().catch((e: any) => {
    return NextResponse.json(
      {
        data: e.message,
      },
      {
        status: SERVER_STATUS_CODE.SERVER_ERROR,
      }
    );
  }); // call next in chain;
}
