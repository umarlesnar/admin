import { nextAuthOptions } from "@/lib/next-auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(nextAuthOptions);
  return NextResponse.json({
    id: 1,
    user: session,
  });
}
