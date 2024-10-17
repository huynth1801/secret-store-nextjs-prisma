import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL(`/sign-in`, req.url))
  response.cookies.delete("refreshToken")
  response.cookies.delete("logged-in")
  return response
}
