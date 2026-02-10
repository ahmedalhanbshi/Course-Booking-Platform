import { NextResponse } from "next/server"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { upsertRegistration } from "@/lib/registration-store"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const userId = body?.userId ?? getUserIdFromCookies()
  const courseId = String(body?.courseId ?? "").trim()
  const fullName = String(body?.fullName ?? "").trim()
  const email = String(body?.email ?? "").trim()
  const phone = String(body?.phone ?? "").trim()

  if (!userId) {
    return NextResponse.json(
      { message: "يجب تسجيل الدخول قبل إرسال الطلب." },
      { status: 401 }
    )
  }

  if (!courseId || !fullName || !email || !phone) {
    return NextResponse.json(
      { message: "يرجى تعبئة جميع الحقول المطلوبة." },
      { status: 400 }
    )
  }

  const record = upsertRegistration({
    userId,
    courseId,
    fullName,
    email,
    phone,
    status: "PENDING_APPROVAL"
  })

  return NextResponse.json({ status: record.status })
}
