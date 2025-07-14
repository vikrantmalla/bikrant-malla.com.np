import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kindeAuth: string }> }
) {
  const { kindeAuth } = await params;
  return handleAuth(request, kindeAuth);
}
