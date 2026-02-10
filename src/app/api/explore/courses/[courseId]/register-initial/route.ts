import { NextResponse } from "next/server"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { upsertRegistration } from "@/lib/registration-store"

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const body = await request.json().catch(() => ({}))
  const userId = body?.userId ?? getUserIdFromCookies()

  if (!userId) {
    return NextResponse.json(
      { message: "يجب تسجيل الدخول قبل إرسال الطلب." },
      { status: 401 }
    )
  }

  const fullName = String(body?.fullName ?? "").trim()
  const email = String(body?.email ?? "").trim()
  const phone = String(body?.phone ?? "").trim()

  if (!fullName || !email || !phone) {
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
