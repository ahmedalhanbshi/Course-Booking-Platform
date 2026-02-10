import { NextResponse } from "next/server"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { setRegistrationStatus } from "@/lib/registration-store"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const userId = body?.userId ?? getUserIdFromCookies()
  const courseId = String(body?.courseId ?? "").trim()

  if (!userId) {
    return NextResponse.json(
      { message: "يجب تسجيل الدخول قبل تحديث الحالة." },
      { status: 401 }
    )
  }

  if (!courseId) {
    return NextResponse.json({ message: "معرّف الدورة مطلوب." }, { status: 400 })
  }

  const record = setRegistrationStatus(userId, courseId, "APPROVED")
  return NextResponse.json({ status: record.status })
}
