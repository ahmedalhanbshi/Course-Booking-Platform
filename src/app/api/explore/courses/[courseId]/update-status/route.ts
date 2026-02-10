import { NextResponse } from "next/server"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { setRegistrationStatus, type RegistrationStatus } from "@/lib/registration-store"

const allowedStatuses: RegistrationStatus[] = [
  "NONE",
  "PENDING_APPROVAL",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAYMENT_CONFIRMED",
  "ENROLLED",
  "REJECTED"
]

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const body = await request.json().catch(() => ({}))
  const userId = body?.userId ?? getUserIdFromCookies()
  const status = body?.status as RegistrationStatus | undefined

  if (!userId) {
    return NextResponse.json(
      { message: "يجب تسجيل الدخول قبل تحديث الحالة." },
      { status: 401 }
    )
  }

  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { message: "حالة غير صالحة." },
      { status: 400 }
    )
  }

  const record = setRegistrationStatus(userId, courseId, status)
  return NextResponse.json({ status: record.status })
}
