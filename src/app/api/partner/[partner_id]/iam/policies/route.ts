import { type NextRequest } from "next/server";
import { RequestContext } from "next/dist/server/base-server";
import nc from "./handler";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return (await nc.run(request, ctx)) as Promise<void | Response>;
}
export async function GET(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return (await nc.run(request, ctx)) as Promise<void | Response>;
}
