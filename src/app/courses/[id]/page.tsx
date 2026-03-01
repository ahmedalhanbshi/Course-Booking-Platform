"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate, formatTime } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Check,
  Clock,
  FileText,
  Globe,
  Heart,
  Loader2,
  MapPin,
  Tag,
  UploadCloud,
  Users,
  X
} from "lucide-react"
import { toast } from "sonner"
import { trainerService, CourseDetail } from "@/lib/trainer-service"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

function resolveImage(src: string | null | undefined): string {
  if (!src) return "/images/course-web.png"
  if (src.startsWith("http")) return src
  const cleanSrc = src.replace(/\\/g, "/")
  const separator = cleanSrc.startsWith("/") ? "" : "/"
  return `${API_BASE}${separator}${cleanSrc}`
}

const deliveryLabels: Record<string, string> = {
  online: "أونلاين",
  in_person: "حضوري",
  hybrid: "مدمج",
  capacity_based: "تحديد القاعة عند اكتمال العدد"
}

type RegistrationStatus =
  | "NONE"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "PAYMENT_PENDING"
  | "PAYMENT_CONFIRMED"
  | "PAYMENT_REJECTED"
  | "ENROLLED"
  | "REJECTED"

const FAVORITES_KEY = "courseFavorites"
const REGISTRATION_KEY_PREFIX = "exploreRegistration"
const ENROLLMENTS_KEY = "myCoursesEnrollments"
const RECEIPT_KEY_PREFIX = "exploreReceipt"
const steps = [
  { id: 1, label: "تسجيل مبدئي" },
  { id: 2, label: "انتظار موافقة المدرب" },
  { id: 3, label: "تأكيد الدفع" },
  { id: 4, label: "تم التسجيل" }
]

export default function CourseDetailsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const courseId = typeof params.id === "string" ? params.id : ""

  // ── Real data fetching ───────────────────────────────────────────────────────
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [courseLoading, setCourseLoading] = useState(true)
  const [courseError, setCourseError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    setCourseLoading(true)
    trainerService
      .getPublicCourseById(courseId)
      .then(setCourse)
      .catch(() => setCourseError("الدورة غير موجودة أو غير متاحة"))
      .finally(() => setCourseLoading(false))
  }, [courseId])
  // ────────────────────────────────────────────────────────────────────────────
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus>("NONE")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingRegistration, setIsLoadingRegistration] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptInfo, setReceiptInfo] = useState<{ name: string; note: string }>({
    name: "",
    note: ""
  })
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [expandedBankId, setExpandedBankId] = useState<string | null>(null)
  const paymentFileRef = useRef<HTMLInputElement | null>(null)
  const [formErrors, setFormErrors] = useState<{
    name?: string
    email?: string
    phone?: string
    submit?: string
  }>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // surveyLink and bank accounts are not in the DB model yet
  const shouldShowSurvey = false
  const bankAccounts = useMemo(() => [
    {
      id: "primary",
      bankName: "—",
      iban: "—",
      accountNumber: "—",
      beneficiary: course?.instructor?.name ?? "—"
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [course?.instructor?.name])

  const formatFileSize = (size?: number) => {
    if (!size || Number.isNaN(size)) return ""
    if (size < 1024) return `${size} B`
    const kb = size / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  const registrationStorageKey = useMemo(
    () => `${REGISTRATION_KEY_PREFIX}:${user?.id ?? "guest"}:${courseId}`,
    [courseId, user?.id]
  )
  const registrationFormKey = useMemo(
    () => `${REGISTRATION_KEY_PREFIX}:form:${user?.id ?? "guest"}:${courseId}`,
    [courseId, user?.id]
  )
  const receiptStorageKey = useMemo(
    () => `${RECEIPT_KEY_PREFIX}:${user?.id ?? "guest"}:${courseId}`,
    [courseId, user?.id]
  )

  const formatYER = (value: number) =>
    `${new Intl.NumberFormat("en-US").format(value)} ر.ي`

  const readFavorites = () => {
    if (typeof window === "undefined") return [] as string[]
    try {
      const stored = window.localStorage.getItem(FAVORITES_KEY)
      return stored ? (JSON.parse(stored) as string[]) : []
    } catch {
      return []
    }
  }

  const writeFavorites = (items: string[]) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event("favorites-updated"))
  }

  const readRegistrationForm = () => {
    if (typeof window === "undefined") return null
    try {
      const stored = window.localStorage.getItem(registrationFormKey)
      if (!stored) return null
      return JSON.parse(stored) as typeof formData
    } catch {
      return null
    }
  }

  const persistRegistrationForm = (data: typeof formData) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(registrationFormKey, JSON.stringify(data))
  }

  const openRegistrationDialog = async (mode: "create" | "edit") => {
    setIsEditMode(mode === "edit")
    setFormErrors({})
    setIsDialogOpen(true)
    if (mode === "create") {
      setRegistrationId(null)
    }
    if (mode === "edit") {
      setIsLoadingRegistration(true)
      const stored = readRegistrationForm()
      if (stored) {
        setFormData(stored)
        setIsLoadingRegistration(false)
        return
      }
      if (!user?.id) {
        setIsLoadingRegistration(false)
        return
      }
      try {
        const response = await fetch(`/api/enrollments/${courseId}/me`, {
          method: "GET",
          cache: "no-store"
        })
        if (!response.ok) {
          setIsLoadingRegistration(false)
          return
        }
        const payload = await response.json()
        setRegistrationId(payload?.id ?? null)
        setFormData({
          name: payload?.fullName ?? "",
          email: payload?.email ?? "",
          phone: payload?.phone ?? ""
        })
      } catch {
        // ignore fetch errors, allow manual edit
      } finally {
        setIsLoadingRegistration(false)
      }
    }
  }

  const toggleFavorite = () => {
    const favorites = readFavorites()
    const nextFavorites = favorites.includes(course?.id ?? "")
      ? favorites.filter((id) => id !== course?.id)
      : [...favorites, course?.id ?? ""]
    writeFavorites(nextFavorites)
    setIsFavorite(nextFavorites.includes(course?.id ?? ""))
  }

  const handleReceiptFile = (file: File | null) => {
    setReceiptFile(file)
    if (file) {
      setReceiptInfo((prev) => ({ ...prev, name: file.name }))
    }
    setPaymentError("")
  }

  const readReceiptInfo = () => {
    if (typeof window === "undefined") return null
    try {
      const stored = window.localStorage.getItem(receiptStorageKey)
      if (!stored) return null
      return JSON.parse(stored) as { name?: string; note?: string }
    } catch {
      return null
    }
  }

  const persistReceiptInfo = (info: { name: string; note: string }) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(receiptStorageKey, JSON.stringify(info))
  }

  const handleCopyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`تم نسخ ${label}`)
    } catch {
      toast.error(`تعذر نسخ ${label}`)
    }
  }

  const persistRegistrationStatus = (status: RegistrationStatus) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(registrationStorageKey, status)
  }

  const saveEnrollment = () => {
    if (!course || typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem(ENROLLMENTS_KEY)
      const list = stored ? (JSON.parse(stored) as any[]) : []
      const exists = list.some((item) => item?.courseId === course.id)
      if (exists) return

      list.unshift({
        courseId: course.id,
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        category: course.category,
        price: course.price,
        image: course.image,
        startDate: course.startDate,
        endDate: course.endDate,
        maxStudents: course.maxStudents,
        instructorName: course.instructor.name,
        instructorAvatar: course.instructor.avatar,
        createdAt: new Date().toISOString()
      })

      window.localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(list))
      window.dispatchEvent(new Event("enrollments-updated"))
    } catch {
      // ignore storage errors
    }
  }

  const getStepState = (stepId: number) => {
    if (registrationStatus === "NONE") {
      return stepId === 1 ? "active" : "upcoming"
    }
    if (registrationStatus === "PENDING_APPROVAL") {
      if (stepId === 1) return "completed"
      if (stepId === 2) return "active"
      return "upcoming"
    }
    if (registrationStatus === "APPROVED") {
      if (stepId <= 2) return "completed"
      if (stepId === 3) return "active"
      return "upcoming"
    }
    if (registrationStatus === "PAYMENT_PENDING") {
      if (stepId <= 2) return "completed"
      if (stepId === 3) return "active"
      return "upcoming"
    }
    if (registrationStatus === "PAYMENT_CONFIRMED") {
      if (stepId <= 3) return "completed"
      if (stepId === 4) return "active"
      return "upcoming"
    }
    if (registrationStatus === "PAYMENT_REJECTED") {
      if (stepId <= 2) return "completed"
      if (stepId === 3) return "rejected"
      return "upcoming"
    }
    if (registrationStatus === "ENROLLED") {
      return "completed"
    }
    if (registrationStatus === "REJECTED") {
      if (stepId === 1) return "completed"
      if (stepId === 2) return "rejected"
      return "upcoming"
    }
    return "upcoming"
  }

  const getConnectorClass = (stepId: number) => {
    const state = getStepState(stepId)
    if (state === "completed") return "bg-emerald-500"
    if (state === "rejected") return "bg-red-500"
    return "bg-white/20"
  }


  const updateRegistrationStatus = async (
    status: RegistrationStatus,
    endpoint: string,
    payload?: Record<string, unknown>
  ) => {
    if (!user?.id) {
      toast.error("يرجى تسجيل الدخول أولًا")
      return false
    }

    setIsUpdatingStatus(true)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseId,
          status,
          ...payload
        })
      })

      if (response.ok) {
        const payload = await response.json()
        const nextStatus = (payload?.status as RegistrationStatus) || status
        setRegistrationStatus(nextStatus)
        persistRegistrationStatus(nextStatus)
        return true
      }

      if (response.status === 401) {
        toast.error("يرجى تسجيل الدخول أولًا")
        return false
      }

      // Fallback to local state for demo flow if API fails.
      setRegistrationStatus(status)
      persistRegistrationStatus(status)
      return true
    } catch {
      // Network error fallback for demo flow.
      setRegistrationStatus(status)
      persistRegistrationStatus(status)
      return true
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePaymentConfirmation = async () => {
    if (!receiptFile && !receiptInfo.name) {
      setPaymentError("يرجى رفع سند الدفع قبل التأكيد.")
      return
    }
    setPaymentError("")
    const success = await updateRegistrationStatus(
      "PAYMENT_PENDING",
      "/api/payment-proof"
    )
    if (success) {
      const nextInfo = {
        name: receiptFile?.name ?? receiptInfo.name,
        note: receiptInfo.note
      }
      setReceiptInfo(nextInfo)
      persistReceiptInfo(nextInfo)
      setIsPaymentDialogOpen(false)
      toast.success("تم رفع سند الدفع وسيتم مراجعته من المدرب.")
    }
  }

  const handlePaymentApprovalSimulation = async () => {
    const success = await updateRegistrationStatus(
      "ENROLLED",
      "/api/payment-approve"
    )
    if (success) {
      saveEnrollment()
      toast.success("تم تأكيد الدفع بنجاح، تم تسجيلك بالدورة 🎉")
    }
  }

  const handlePaymentRejectionSimulation = () => {
    setRegistrationStatus("PAYMENT_REJECTED")
    persistRegistrationStatus("PAYMENT_REJECTED")
    toast.error("تم رفض الدفع، يرجى تعديل السند.")
  }

  const handleTrainerApprovalSimulation = async () => {
    const success = await updateRegistrationStatus(
      "APPROVED",
      "/api/trainer-approve"
    )
    if (success) {
      toast.success("تمت الموافقة المبدئية على التسجيل")
    }
  }

  const handleRegister = async () => {
    if (isEditMode) {
      const errors: typeof formErrors = {}
      if (!formData.name.trim()) {
        errors.name = "الاسم الكامل مطلوب"
      }
      if (!formData.email.trim()) {
        errors.email = "البريد الإلكتروني مطلوب"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "البريد الإلكتروني غير صالح"
      }
      if (!formData.phone.trim()) {
        errors.phone = "رقم الهاتف مطلوب"
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      if (!user?.id) {
        setFormErrors({ submit: "يرجى تسجيل الدخول أولًا." })
        return
      }

      setIsSubmitting(true)
      setFormErrors({})
      try {
        const response = await fetch(`/api/enrollments/${courseId}/me`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollmentId: registrationId,
            userId: user.id,
            courseId,
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone
          })
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          setFormErrors({
            submit: payload?.message || "تعذر تحديث البيانات الآن"
          })
          return
        }
      } catch {
        // ignore network error for demo flow
      } finally {
        setIsSubmitting(false)
      }

      persistRegistrationForm(formData)
      setIsDialogOpen(false)
      toast.success("تم تحديث بيانات التسجيل المبدئي")
      return
    }

    const errors: typeof formErrors = {}
    if (!formData.name.trim()) {
      errors.name = "الاسم الكامل مطلوب"
    }
    if (!formData.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "البريد الإلكتروني غير صالح"
    }
    if (!formData.phone.trim()) {
      errors.phone = "رقم الهاتف مطلوب"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (!user?.id) {
      setFormErrors({ submit: "يرجى تسجيل الدخول لإرسال الطلب." })
      return
    }

    setIsSubmitting(true)
    setFormErrors({})
    try {
      const response = await fetch("/api/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          userId: user?.id
        })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFormErrors({
          submit: payload?.message || "تعذر إرسال الطلب الآن"
        })
        return
      }

      const payload = await response.json()
      const nextStatus = payload?.status || "PENDING_APPROVAL"
      persistRegistrationForm(formData)
      setRegistrationStatus(nextStatus)
      persistRegistrationStatus(nextStatus)
      setIsDialogOpen(false)
      toast.success("تم إرسال طلب التسجيل المبدئي", {
        description: "سيتم التواصل معك لتأكيد الحجز"
      })
    } catch (error) {
      setFormErrors({
        submit: "حدث خطأ غير متوقع. حاول مرة أخرى."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const loadStatus = async () => {
      if (typeof window !== "undefined") {
        const savedStatus = window.localStorage.getItem(registrationStorageKey)
        if (savedStatus) {
          setRegistrationStatus(savedStatus as RegistrationStatus)
          return
        }
      }
      try {
        const params = new URLSearchParams()
        if (user?.id) {
          params.set("userId", user.id)
        }
        params.set("courseId", courseId)
        const response = await fetch(`/api/enrollment-status?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store"
        })
        if (!response.ok) return
        const payload = await response.json()
        if (payload?.status) {
          setRegistrationStatus(payload.status)
          persistRegistrationStatus(payload.status)
        }
      } catch {
        // ignore
      }
    }

    loadStatus()
    return () => controller.abort()
  }, [courseId, registrationStorageKey, user?.id])

  useEffect(() => {
    if (!isDialogOpen) {
      setIsEditMode(false)
      setIsLoadingRegistration(false)
    }
  }, [isDialogOpen])

  useEffect(() => {
    if (
      registrationStatus !== "APPROVED" &&
      registrationStatus !== "PAYMENT_PENDING" &&
      registrationStatus !== "PAYMENT_REJECTED"
    ) {
      setReceiptFile(null)
      setPaymentError("")
    }
  }, [registrationStatus])

  useEffect(() => {
    if (!isPaymentDialogOpen) return
    const stored = readReceiptInfo()
    if (stored) {
      setReceiptInfo({
        name: stored?.name ?? "",
        note: stored?.note ?? ""
      })
    } else {
      setReceiptInfo({ name: "", note: "" })
    }
    if (!expandedBankId && bankAccounts.length) {
      setExpandedBankId(bankAccounts[0].id)
    }
  }, [bankAccounts, expandedBankId, isPaymentDialogOpen])

  useEffect(() => {
    const syncFavorite = () => {
      const favorites = readFavorites()
      setIsFavorite(favorites.includes(course?.id ?? ""))
    }

    syncFavorite()
    if (typeof window === "undefined") return

    const handleUpdate = () => syncFavorite()
    window.addEventListener("favorites-updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("favorites-updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [course?.id])

  useEffect(() => {
    // We removed the IntersectionObserver logic and replaced it with pure CSS animations
    // to prevent race conditions that keep cards hidden.
  }, [])
  // ── Loading / error guards ───────────────────────────────────────────────
  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-lg">جاري تحميل تفاصيل الدورة...</span>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-xl">{courseError ?? "الدورة غير موجودة"}</p>
        <Button variant="outline" onClick={() => router.back()}>العودة</Button>
      </div>
    )
  }
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-l from-blue-950 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 pt-6 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="rounded-full transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
            >
              <Link href="/student/explore">
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة للاستكشاف
              </Link>
            </Button>
            <Badge className="bg-white/10 text-white border border-white/20">
              {course.category}
            </Badge>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
            <div className="flex flex-col gap-4 text-right">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                {course.title}
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:delay-100">
                {course.shortDescription}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-blue-200">سعر الدورة</span>
                <span className="text-2xl font-bold">{formatYER(course.price)}</span>
              </div>
              <div className="grid gap-3 text-sm text-blue-100 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(course.startDate)} - {formatDate(course.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>المقاعد المتاحة: {course.maxStudents}</span>
                </div>
                <div className="flex items-center gap-2">
                  {course.deliveryType === "online" || course.deliveryType === "hybrid" ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span>{deliveryLabels[course.deliveryType] ?? course.deliveryType}</span>
                </div>
                {course.sessions[0]?.room && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{course.sessions[0].room.name}</span>
                  </div>
                )}
              </div>
              {(() => {
                const firstMeetingLink = course.sessions.find(s => s.meetingLink)?.meetingLink
                return (firstMeetingLink ||
                  registrationStatus === "PAYMENT_PENDING" ||
                  registrationStatus === "PENDING_APPROVAL" ||
                  registrationStatus === "PAYMENT_REJECTED") && (
                    <div className="flex flex-wrap items-center gap-4">
                      {firstMeetingLink && (
                        <a
                          href={firstMeetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-200 underline underline-offset-4 self-start"
                        >
                          رابط الاجتماع
                        </a>
                      )}
                      {registrationStatus === "PENDING_APPROVAL" && (
                        <button
                          type="button"
                          onClick={handleTrainerApprovalSimulation}
                          disabled={isUpdatingStatus}
                          className="text-sm text-blue-200 underline underline-offset-4 self-start transition hover:text-white disabled:opacity-60"
                        >
                          محاكاة الموافقة المبدئية
                        </button>
                      )}
                      {registrationStatus === "PAYMENT_PENDING" && (
                        <button
                          type="button"
                          onClick={handlePaymentApprovalSimulation}
                          disabled={isUpdatingStatus}
                          className="text-sm text-blue-200 underline underline-offset-4 self-start transition hover:text-white disabled:opacity-60"
                        >
                          محاكاة تأكيد الدفع
                        </button>
                      )}
                      {registrationStatus === "PAYMENT_PENDING" && (
                        <button
                          type="button"
                          onClick={handlePaymentRejectionSimulation}
                          className="text-sm text-blue-200 underline underline-offset-4 self-start transition hover:text-white"
                        >
                          محاكاة رفض الدفع
                        </button>
                      )}
                    </div>
                  )
              })()}
              <div className="flex flex-wrap gap-2">
                {(course.tags ?? []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/10 text-white border border-white/10 transition-all duration-150 hover:bg-white/15 hover:-translate-y-0.5"
                  >
                    <Tag className="ml-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {registrationStatus === "NONE" && (
                  <Button
                    className="w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 animate-cta-pop"
                    onClick={() => openRegistrationDialog("create")}
                  >
                    التسجيل
                  </Button>
                )}
                {registrationStatus === "PENDING_APPROVAL" && (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full rounded-full border-white/60 bg-white text-blue-900 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 opacity-70 cursor-not-allowed"
                  >
                    تم التسجيل مبدئيًا
                  </Button>
                )}
                {registrationStatus === "REJECTED" && (
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-white/60 bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200"
                    onClick={() => openRegistrationDialog("edit")}
                  >
                    تعديل التسجيل المبدئي
                  </Button>
                )}
                {registrationStatus === "APPROVED" && (
                  <Button
                    className="w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200"
                    onClick={() => setIsPaymentDialogOpen(true)}
                  >
                    تأكيد الدفع
                  </Button>
                )}
                {registrationStatus === "PAYMENT_PENDING" && (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full rounded-full border-white/60 bg-white text-blue-900 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 opacity-70 cursor-not-allowed"
                  >
                    تم إرسال الدفع
                  </Button>
                )}
                {registrationStatus === "PAYMENT_REJECTED" && (
                  <Button
                    className="w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200"
                    onClick={() => setIsPaymentDialogOpen(true)}
                  >
                    تعديل سند الدفع
                  </Button>
                )}
                {registrationStatus === "ENROLLED" && (
                  <Button
                    className="w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200"
                    onClick={() => {
                      saveEnrollment()
                      router.push(`/student/courses/${courseId}`)
                    }}
                  >
                    الانتقال إلى الدورة
                  </Button>
                )}
                <DialogContent
                  dir="rtl"
                  className="[&>button[data-dialog-close='default']]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4"
                >
                  <DialogClose className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30">
                    <X className="h-4 w-4" />
                    <span className="sr-only">إغلاق</span>
                  </DialogClose>
                  <DialogHeader className="space-y-3 text-right sm:text-right">
                    <DialogTitle>
                      {isEditMode ? "تعديل التسجيل المبدئي" : "التسجيل المبدئي"}
                    </DialogTitle>
                    <DialogDescription className="text-right">
                      {isEditMode
                        ? "حدّث بيانات التسجيل المبدئي قبل إكمال الخطوات."
                        : "أدخل بياناتك للتواصل وتأكيد التسجيل المبدئي."}
                    </DialogDescription>
                  </DialogHeader>
                  {formErrors.submit && (
                    <p className="text-sm text-red-500 text-right">{formErrors.submit}</p>
                  )}
                  {isLoadingRegistration ? (
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-slate-200/60" />
                        <div className="h-10 w-full rounded-lg bg-slate-200/60 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-28 rounded bg-slate-200/60" />
                        <div className="h-10 w-full rounded-lg bg-slate-200/60 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-slate-200/60" />
                        <div className="h-10 w-full rounded-lg bg-slate-200/60 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="اكتب اسمك"
                        />
                        {formErrors.name && (
                          <p className="text-xs text-red-500 text-right">{formErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@email.com"
                        />
                        {formErrors.email && (
                          <p className="text-xs text-red-500 text-right">{formErrors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="05xxxxxxxx"
                        />
                        {formErrors.phone && (
                          <p className="text-xs text-red-500 text-right">{formErrors.phone}</p>
                        )}
                      </div>
                      {shouldShowSurvey && (
                        <div className="space-y-2">
                          <Label>الاستبيان (اختياري)</Label>
                          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3">
                            <p className="text-sm text-slate-600">
                              الاستبيان اختياري، لكنه يساعدنا في تحسين تجربتك التعليمية.
                            </p>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-9 rounded-full px-4"
                            >
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                فتح الاستبيان
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      onClick={handleRegister}
                      disabled={isLoadingRegistration || isSubmitting}
                      className="w-full transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2"
                    >
                      {isSubmitting
                        ? "جارٍ الإرسال..."
                        : isEditMode
                          ? "حفظ التعديلات"
                          : "تأكيد التسجيل"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {registrationStatus === "PENDING_APPROVAL" && (
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-right text-sm text-white/90 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur">
                  <p className="font-semibold">طلبك قيد المراجعة</p>
                  <p className="mt-1 text-xs text-white/70">
                    سيتم إشعارك عند اعتماد التسجيل من المدرب.
                  </p>
                </div>
              )}
              {registrationStatus === "PAYMENT_PENDING" && (
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-right text-sm text-white/90 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur">
                  <p className="font-semibold">تم إرسال سند الدفع</p>
                  <p className="mt-1 text-xs text-white/70">
                    جاري مراجعة الدفع من المدرب. سيتم إشعارك بعد التأكيد.
                  </p>
                </div>
              )}
              {registrationStatus === "PAYMENT_REJECTED" && (
                <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-right text-sm text-white/90 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur">
                  <p className="font-semibold text-red-200">تم رفض الدفع</p>
                  <p className="mt-1 text-xs text-red-100/80">
                    يرجى تعديل سند الدفع وإعادة الإرسال.
                  </p>
                </div>
              )}

              {registrationStatus !== "NONE" && (
                <div
                  key={registrationStatus}
                  dir="rtl"
                  className={`mt-4 rounded-2xl border p-4 text-right text-sm backdrop-blur animate-stepper-reveal ${registrationStatus === "PENDING_APPROVAL"
                    ? "border-white/10 bg-white/5 text-white/70 shadow-none opacity-75"
                    : "border-white/15 bg-white/10 text-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.2)]"
                    }`}
                >
                  <div className="relative flex flex-nowrap items-start gap-0 overflow-x-auto pb-1">
                    {steps.map((step, index) => {
                      const state = getStepState(step.id)
                      const isLast = index === steps.length - 1
                      const circleClass =
                        state === "completed"
                          ? "bg-emerald-500 text-white"
                          : state === "active"
                            ? "bg-blue-500 text-white ring-4 ring-blue-400/30"
                            : state === "rejected"
                              ? "bg-red-500 text-white"
                              : "border border-white/30 bg-slate-900/80 text-white/70"

                      return (
                        <Fragment key={step.id}>
                          <div className="relative z-10 flex min-w-[88px] flex-col items-center text-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${circleClass} ${state === "active" ? "animate-stepper-pop" : ""
                                }`}
                            >
                              {state === "completed" && <Check className="h-4 w-4" />}
                              {state === "rejected" && <X className="h-4 w-4" />}
                              {state !== "completed" && state !== "rejected" && step.id}
                            </div>
                            <span className="mt-2 text-xs font-medium text-white/90">
                              {step.label}
                            </span>
                          </div>
                          {!isLast && (
                            <div className="relative z-0 flex-1 -mx-5">
                              <div
                                className={`pointer-events-none absolute top-5 h-1 w-full -translate-y-1/2 rounded-full transition-colors duration-300 ${getConnectorClass(step.id)}`}
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </Fragment>
                      )
                    })}
                  </div>

                </div>
              )}
            </div>

            <div className="relative -mt-4 aspect-square w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-lg animate-image-reveal">
              <button
                type="button"
                onClick={toggleFavorite}
                aria-label="إضافة إلى المفضلة"
                aria-pressed={isFavorite}
                className={`absolute left-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-slate-200 backdrop-blur transition-all duration-200 hover:scale-105 hover:text-white ${isFavorite ? "text-red-500 hover:text-red-500" : ""
                  }`}
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-200 ${isFavorite ? "fill-current scale-110" : ""
                    }`}
                />
              </button>
              <Image
                src={resolveImage(course.image)}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 360px, 420px"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
      </div>

      <div className="container mx-auto px-4 py-10">
        <Card
          dir="rtl"
          className="mb-6 w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          data-reveal
          style={{ "--reveal-delay": "0ms" } as CSSProperties}
        >
          <div className="text-right space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              معلومات المدرب
            </h3>
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200">
                <Image
                  src={resolveImage(course.instructor.avatar)}
                  alt={course.instructor.name}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  {course.instructor.name}
                </h4>
                {course.instructor.bio && (
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-[560px]">
                    {course.instructor.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            className="h-full transition-shadow duration-200 hover:shadow-md reveal-card"
            data-reveal
            style={{ "--reveal-delay": "0ms" } as CSSProperties}
          >
            <CardHeader>
              <CardTitle>عن الدورة</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-700">
              {course.description}
            </CardContent>
          </Card>

          <Card
            className="h-full transition-shadow duration-200 hover:shadow-md reveal-card"
            data-reveal
            style={{ "--reveal-delay": "100ms" } as CSSProperties}
          >
            <CardHeader>
              <CardTitle>أهداف الدورة</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {(course.objectives ?? []).map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card
            className="h-full transition-shadow duration-200 hover:shadow-md reveal-card"
            data-reveal
            style={{ "--reveal-delay": "200ms" } as CSSProperties}
          >
            <CardHeader>
              <CardTitle>المتطلبات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(course.prerequisites ?? []).map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card
            className="h-full transition-shadow duration-200 hover:shadow-md reveal-card"
            data-reveal
            style={{ "--reveal-delay": "300ms" } as CSSProperties}
          >
            <CardHeader>
              <CardTitle>الجدول الزمني</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(course.sessions ?? []).map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{formatDate(item.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(item.startTime).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                      {" - "}
                      {new Date(item.endTime).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {item.topic && (
                    <div className="text-slate-500">{item.topic}</div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent
          dir="rtl"
          className="max-w-3xl [&>button[data-dialog-close='default']]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4"
        >
          <DialogClose className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30">
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
          <DialogHeader className="space-y-2 text-right">
            <DialogTitle className="text-right">
              {registrationStatus === "PAYMENT_REJECTED" ? "تعديل سند الدفع" : "تأكيد الدفع"}
            </DialogTitle>
            <DialogDescription className="text-right">
              يرجى تحويل المبلغ وإرفاق سند الدفع لإكمال الخطوة.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4 lg:grid-cols-2">
            <div className="order-2 space-y-4 text-right lg:order-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">رفع سند الدفع</h4>
                  <span className="text-xs text-slate-500">صور أو PDF</span>
                </div>
                <div
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDraggingFile(true)
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setIsDraggingFile(false)
                    const file = event.dataTransfer.files?.[0] ?? null
                    handleReceiptFile(file)
                  }}
                  onClick={() => paymentFileRef.current?.click()}
                  className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-5 text-sm transition ${isDraggingFile ? "border-blue-500 bg-blue-50/60" : "border-slate-200 bg-slate-50/60"
                    }`}
                >
                  <UploadCloud className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-slate-700">اسحب الملف هنا</span>
                  <span className="text-xs text-slate-500">أو اختر ملفًا من جهازك</span>
                  <Button type="button" size="sm" className="rounded-full">
                    اختيار ملف
                  </Button>
                  <Input
                    ref={paymentFileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null
                      handleReceiptFile(file)
                    }}
                  />
                </div>
                {(receiptFile?.name || receiptInfo.name) && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {receiptFile?.name ?? receiptInfo.name}
                        </p>
                        {receiptFile && (
                          <p className="text-[11px] text-slate-500">
                            {receiptFile.type || "ملف"} · {formatFileSize(receiptFile.size)}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReceiptFile(null)
                          setReceiptInfo((prev) => ({ ...prev, name: "" }))
                        }}
                        className="h-7 rounded-full px-3 text-xs"
                      >
                        إزالة الملف
                      </Button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => paymentFileRef.current?.click()}
                        className="h-7 rounded-full px-3 text-xs"
                      >
                        تغيير الملف
                      </Button>
                    </div>
                  </div>
                )}
                {!receiptFile?.name && !receiptInfo.name && (
                  <p className="mt-3 text-xs text-slate-500">
                    ارفع سند الدفع أولاً حتى تتمكن من التأكيد.
                  </p>
                )}
                {paymentError && <p className="mt-2 text-xs text-red-500">{paymentError}</p>}
              </div>
            </div>
            <div className="order-1 space-y-4 text-right lg:order-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">الحسابات البنكية</h4>
                  <span className="text-xs text-slate-500">اختر بنكًا لعرض التفاصيل</span>
                </div>
                <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {bankAccounts.map((bank) => {
                    const isOpen = expandedBankId === bank.id
                    const hasIban = Boolean(bank.iban)
                    const hasAccountNumber = Boolean(bank.accountNumber)
                    return (
                      <div key={bank.id} className="rounded-xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBankId((prev) => (prev === bank.id ? null : bank.id))
                          }
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm font-semibold text-slate-900">
                            {bank.bankName}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-200 px-4 py-3 text-right text-sm">
                            <p className="text-xs text-slate-500">
                              اسم المستفيد: {bank.beneficiary}
                            </p>
                            {hasIban && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs text-slate-500">رقم IBAN</p>
                                <p className="font-mono text-sm font-semibold text-slate-900">
                                  {bank.iban}
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyValue(bank.iban, "رقم الآيبان")}
                                  className="h-7 rounded-full px-3 text-xs"
                                >
                                  نسخ IBAN
                                </Button>
                              </div>
                            )}
                            {!hasIban && hasAccountNumber && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs text-slate-500">رقم الحساب</p>
                                <p className="font-mono text-sm font-semibold text-slate-900">
                                  {bank.accountNumber}
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleCopyValue(bank.accountNumber ?? "", "رقم الحساب")
                                  }
                                  className="h-7 rounded-full px-3 text-xs"
                                >
                                  نسخ رقم الحساب
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              onClick={handlePaymentConfirmation}
              disabled={isUpdatingStatus || (!receiptFile?.name && !receiptInfo.name)}
              className="w-full"
            >
              تأكيد الدفع
            </Button>
            {!receiptFile?.name && !receiptInfo.name && (
              <p className="mt-2 text-xs text-red-500 text-right">
                ارفع السند أولاً لتفعيل زر التأكيد.
              </p>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes cta-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes image-reveal {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-cta-pop {
          animation: cta-pop 260ms ease-out 1;
        }

        .animate-image-reveal {
          animation: image-reveal 320ms ease-out 1;
        }

        @keyframes reveal {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .reveal-card {
          animation: reveal 400ms ease forwards;
          animation-delay: var(--reveal-delay, 0ms);
          opacity: 0; /* starts hidden, animation makes it visible */
        }


        @keyframes stepper-reveal {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-stepper-reveal {
          animation: stepper-reveal 320ms ease-out 1;
        }

        @keyframes stepper-pop {
          0% { transform: scale(1); }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }

        .animate-stepper-pop {
          animation: stepper-pop 320ms ease-in-out 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-card {
            opacity: 1;
            animation: none;
          }
          .animate-cta-pop,
          .animate-image-reveal {
            animation: none;
          }
        }
      `}</style>
    </div >
  )
}
