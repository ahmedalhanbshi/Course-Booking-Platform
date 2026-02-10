import { NextResponse } from "next/server"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { getRegistrationStatus } from "@/lib/registration-store"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const courseId = url.searchParams.get("courseId") ?? ""
  const userId = url.searchParams.get("userId") ?? getUserIdFromCookies()

  if (!userId || !courseId) {
    return NextResponse.json({ status: "NONE" })
  }

  const status = getRegistrationStatus(userId, courseId)
  return NextResponse.json({ status })
}
