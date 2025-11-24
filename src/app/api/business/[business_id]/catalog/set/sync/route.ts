import { type NextRequest } from "next/server";
import { RequestContext } from "next/dist/server/base-server";
//@ts-ignore
import nc from "./handler";
export const dynamic = "force-dynamic";
export async function PUT(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return nc.run(request, ctx) as Promise<void | Response>;
}
