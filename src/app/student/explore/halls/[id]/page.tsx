"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Facebook, FileText, Globe, Instagram, Lock, Mail, MapPin, Monitor, Phone, Projector, UploadCloud, Users, Wifi, X } from "lucide-react"

const halls = [
  {
    id: "hall-1",
    name: "القاعة الرئيسية",
    type: "قاعة محاضرات",
    location: "الشرج، الشارع الأول",
    locationUrl: "https://maps.app.goo.gl/4mZb9Y6WgS7",
    capacity: 80,
    hourlyRate: 18000,
    image: "https://images.unsplash.com/photo-1760121788536-9797394e210e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    gallery: [
      "https://images.unsplash.com/photo-1760121788536-9797394e210e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      "https://images.unsplash.com/photo-1685955011121-1ef868d21c99?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
    ],
    features: ["wifi", "projector", "screen"],
    description: "قاعة واسعة للمحاضرات والفعاليات الكبرى مع تجهيزات عرض متكاملة."
  },
  {
    id: "hall-2",
    name: "قاعة الاجتماعات الذكية",
    type: "قاعة اجتماعات",
    location: "الشرج، الشارع الأول",
    locationUrl: "https://maps.app.goo.gl/4mZb9Y6WgS7",
    capacity: 18,
    hourlyRate: 12000,
    image: "https://images.unsplash.com/photo-1766802981801-4b4a9a1d8f1c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    gallery: [
      "https://images.unsplash.com/photo-1766802981801-4b4a9a1d8f1c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      "https://images.unsplash.com/photo-1685955011121-1ef868d21c99?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
    ],
    features: ["wifi", "screen"],
    description: "مساحة مريحة لاجتماعات الفرق مع شاشة تفاعلية وإضاءة هادئة."
  },
  {
    id: "hall-3",
    name: "معمل الحاسب المتقدم",
    type: "معمل",
    location: "الشرج، الشارع الأول",
    locationUrl: "https://maps.app.goo.gl/4mZb9Y6WgS7",
    capacity: 30,
    hourlyRate: 15000,
    image: "https://images.unsplash.com/photo-1725274032244-9a8f0fa1e9a7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    gallery: [
      "https://images.unsplash.com/photo-1725274032244-9a8f0fa1e9a7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      "https://images.unsplash.com/photo-1760121788536-9797394e210e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
    ],
    features: ["wifi", "projector", "computers"],
    description: "معمل مجهز لأعمال التدريب العملي مع أجهزة حديثة وشبكة قوية."
  },
  {
    id: "hall-4",
    name: "قاعة التدريب (ج)",
    type: "قاعة محاضرات",
    location: "الشرج، الشارع الأول",
    locationUrl: "https://maps.app.goo.gl/4mZb9Y6WgS7",
    capacity: 40,
    hourlyRate: 14000,
    image: "https://images.unsplash.com/photo-1670348060135-d4c6662b4138?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    gallery: [
      "https://images.unsplash.com/photo-1670348060135-d4c6662b4138?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      "https://images.unsplash.com/photo-1685955011121-1ef868d21c99?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
    ],
    features: ["wifi", "projector"],
    description: "قاعة متوسطة مناسبة للدورات وورش العمل القصيرة."
  }
]

const featureMap: Record<string, { label: string; icon: JSX.Element }> = {
  wifi: { label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  projector: { label: "بروجكتر", icon: <Projector className="h-4 w-4" /> },
  screen: { label: "شاشة", icon: <Monitor className="h-4 w-4" /> },
  computers: { label: "أجهزة", icon: <Monitor className="h-4 w-4" /> }
}

const bookingSteps = [
  { id: 1, label: "تسجيل مبدئي" },
  { id: 2, label: "انتظار موافقة المعهد" },
  { id: 3, label: "تأكيد الدفع" },
  { id: 4, label: "تم الحجز" },
]

const bankAccounts = [
  {
    id: "bank-1",
    bankName: "بنك اليمن الدولي",
    beneficiary: "أحمد محمد",
    iban: "YE12 0001 2345 6789 0000 12",
    accountNumber: "",
  },
  {
    id: "bank-2",
    bankName: "البنك المركزي اليمني",
    beneficiary: "معهد منصة د",
    iban: "",
    accountNumber: "1234567890",
  },
]

export default function HallDetailsPage() {
  const params = useParams()
  const hallId = typeof params.id === "string" ? params.id : "hall-1"
  const hall = useMemo(() => halls.find((item) => item.id === hallId) ?? halls[0], [hallId])
  const locationText = hall.location?.trim() ?? ""
  const locationUrl = hall.locationUrl?.trim() ?? ""
  const locationLabel = locationText || "عرض الموقع على الخريطة"

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptInfo, setReceiptInfo] = useState({ name: "" })
  const [paymentError, setPaymentError] = useState("")
  const [expandedBankId, setExpandedBankId] = useState<string | null>(null)
  const paymentFileRef = useRef<HTMLInputElement | null>(null)
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const [selectedSlotsByDate, setSelectedSlotsByDate] = useState<Record<string, number[]>>({})
  const [bookingStatus, setBookingStatus] = useState<
    | "NONE"
    | "PENDING_APPROVAL"
    | "PAYMENT_PENDING"
    | "PAYMENT_REVIEW"
    | "PAYMENT_REJECTED"
    | "BOOKED"
    | "REJECTED"
  >("NONE")
  const [bookings, setBookings] = useState<
    {
      date: string
      slots: number[]
      status: "PENDING_APPROVAL" | "PAYMENT_PENDING" | "PAYMENT_REVIEW" | "PAYMENT_REJECTED" | "BOOKED" | "REJECTED"
    }[]
  >([
    { date: "2025-03-10", slots: [9, 10], status: "BOOKED" },
    { date: "2025-03-12", slots: [12], status: "PENDING_APPROVAL" },
    { date: "2025-03-14", slots: [8, 9, 10], status: "PAYMENT_PENDING" },
  ])

  const today = new Date()
  const [monthOffset, setMonthOffset] = useState(0)
  const displayDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const currentYear = displayDate.getFullYear()
  const currentMonth = displayDate.getMonth()
  const monthStart = new Date(currentYear, currentMonth, 1)
  const monthEnd = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = monthEnd.getDate()
  const leadingBlanks = monthStart.getDay()
  const dayLabels = ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
  const slots = Array.from({ length: 12 }, (_, i) => 8 + i)

  const formatDateKey = (date: Date) => date.toISOString().slice(0, 10)
  const formatTime = (hour: number) => `${String(hour).padStart(2, "0")}:00`
  const formatDateLabel = (dateKey: string) => {
    const date = new Date(`${dateKey}T00:00:00`)
    return date.toLocaleDateString("ar-YE", { weekday: "short", day: "numeric", month: "long", year: "numeric" })
  }
  const formatSlotRanges = (slotList: number[]) => {
    if (!slotList.length) return []
    const sorted = slotList.slice().sort((a, b) => a - b)
    const ranges: Array<{ start: number; end: number }> = []
    sorted.forEach((slot) => {
      const last = ranges[ranges.length - 1]
      if (!last || slot !== last.end) {
        ranges.push({ start: slot, end: slot + 1 })
        return
      }
      last.end = slot + 1
    })
    return ranges.map((range) => `${formatTime(range.start)} - ${formatTime(range.end)}`)
  }
  const isPastDate = (date: Date) => date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)

  const getUnavailableSlots = (dateKey: string) => {
    return bookings
      .filter((booking) => booking.date === dateKey && booking.status !== "REJECTED")
      .flatMap((booking) => booking.slots)
  }

  const isSlotUnavailable = (dateKey: string, slot: number) => {
    return getUnavailableSlots(dateKey).includes(slot)
  }

  const hasAvailableSlots = (dateKey: string) => {
    return slots.some((slot) => !isSlotUnavailable(dateKey, slot))
  }

  const handleDateSelect = (dateKey: string) => {
    if (bookingStatus !== "NONE") return
    setActiveDate(dateKey)
    setSelectedSlotsByDate((prev) => (prev[dateKey] ? prev : { ...prev, [dateKey]: [] }))
  }

  const handleSlotToggle = (slot: number) => {
    if (bookingStatus !== "NONE") return
    if (!activeDate) return
    if (isSlotUnavailable(activeDate, slot)) return

    setSelectedSlotsByDate((prev) => {
      const current = prev[activeDate] ?? []
      if (current.includes(slot)) {
        const next = current.filter((value) => value !== slot)
        return { ...prev, [activeDate]: next }
      }
      const next = [...current, slot].sort((a, b) => a - b)
      return { ...prev, [activeDate]: next }
    })
  }

  const totalHours = Object.values(selectedSlotsByDate).reduce((sum, slots) => sum + slots.length, 0)
  const totalPrice = totalHours * hall.hourlyRate
  const selectedDateCount = Object.keys(selectedSlotsByDate).filter((date) => (selectedSlotsByDate[date] ?? []).length > 0).length

  const handleInitialBooking = () => {
    if (Object.keys(selectedSlotsByDate).length === 0 || totalHours === 0) return
    setBookings((prev) => [
      ...prev,
      ...Object.entries(selectedSlotsByDate).map(([date, slots]) => ({
        date,
        slots,
        status: "PENDING_APPROVAL" as const,
      })),
    ])
    setBookingStatus("PENDING_APPROVAL")
  }

  const handlePaymentConfirm = () => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.status === "PAYMENT_PENDING" ? { ...booking, status: "PAYMENT_REVIEW" } : booking
      )
    )
    setBookingStatus("PAYMENT_REVIEW")
  }

  const handleReceiptFile = (file: File | null) => {
    if (!file) return
    setReceiptFile(file)
    setReceiptInfo({ name: file.name })
    setPaymentError("")
  }

  const handlePaymentConfirmation = () => {
    if (!receiptFile?.name && !receiptInfo.name) {
      setPaymentError("يرجى رفع سند الدفع قبل التأكيد.")
      return
    }
    handlePaymentConfirm()
    setIsPaymentOpen(false)
  }

  const handleApproveBooking = () => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.status === "PENDING_APPROVAL" ? { ...booking, status: "PAYMENT_PENDING" } : booking
      )
    )
    setBookingStatus("PAYMENT_PENDING")
  }

  const handleRejectBooking = () => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.status === "PENDING_APPROVAL" ? { ...booking, status: "REJECTED" } : booking
      )
    )
    setBookingStatus("REJECTED")
  }

  const handlePaymentApprove = () => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.status === "PAYMENT_REVIEW" ? { ...booking, status: "BOOKED" } : booking
      )
    )
    setBookingStatus("BOOKED")
  }

  const handlePaymentReject = () => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.status === "PAYMENT_REVIEW" ? { ...booking, status: "PAYMENT_REJECTED" } : booking
      )
    )
    setBookingStatus("PAYMENT_REJECTED")
  }

  const getCurrentStepIndex = () => {
    if (bookingStatus === "NONE") return 1
    if (bookingStatus === "PENDING_APPROVAL") return 2
    if (bookingStatus === "PAYMENT_PENDING") return 3
    if (bookingStatus === "PAYMENT_REVIEW") return 3
    if (bookingStatus === "PAYMENT_REJECTED") return 3
    if (bookingStatus === "BOOKED") return 4
    if (bookingStatus === "REJECTED") return 2
    return 1
  }

  const getStepState = (stepId: number) => {
    if (bookingStatus === "REJECTED") {
      return stepId === 3 ? "rejected" : stepId < 3 ? "completed" : "upcoming"
    }

    if (bookingStatus === "NONE") return stepId === 1 ? "active" : "upcoming"
    if (bookingStatus === "PENDING_APPROVAL") {
      return stepId === 1 ? "completed" : stepId === 2 ? "active" : "upcoming"
    }
    if (bookingStatus === "PAYMENT_PENDING") {
      return stepId <= 2 ? "completed" : stepId === 3 ? "active" : "upcoming"
    }
    if (bookingStatus === "PAYMENT_REVIEW") {
      return stepId <= 2 ? "completed" : stepId === 3 ? "active" : "upcoming"
    }
    if (bookingStatus === "PAYMENT_REJECTED") {
      return stepId <= 2 ? "completed" : stepId === 3 ? "rejected" : "upcoming"
    }
    if (bookingStatus === "BOOKED") return "completed"
    return "upcoming"
  }

  const getConnectorClass = (stepId: number) => {
    const state = getStepState(stepId)
    if (state === "completed") return "bg-emerald-500"
    if (state === "active") return "bg-blue-500/70"
    if (state === "rejected") return "bg-red-500/70"
    return "bg-white/20"
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="relative overflow-hidden bg-gradient-to-l from-blue-950 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 pt-6 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
            <div className="flex flex-col gap-4 text-right">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/10 text-white border border-white/20">
                  {hall.type}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {hall.name}
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed">
                {hall.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-blue-200">السعر بالساعة</span>
                <span className="text-2xl font-bold">{hall.hourlyRate} ر.ي</span>
              </div>
              <div className="grid gap-3 text-sm text-blue-100 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {locationUrl ? (
                    <a
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/40 underline-offset-4 hover:text-white"
                    >
                      {locationLabel}
                    </a>
                  ) : (
                    <span className="text-blue-100/60 cursor-not-allowed">
                      {locationLabel}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>السعة: {hall.capacity} شخص</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>يتوفر الحجز حسب الجدولة</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {hall.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                  >
                    {featureMap[feature]?.icon}
                    {featureMap[feature]?.label}
                  </span>
                ))}
              </div>
              {bookingStatus === "PENDING_APPROVAL" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleApproveBooking}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100 transition hover:bg-emerald-400/20"
                  >
                    محاكاة قبول الحجز
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectBooking}
                    className="inline-flex items-center gap-2 rounded-full border border-red-400/60 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-100 transition hover:bg-red-400/20"
                  >
                    محاكاة رفض الحجز
                  </button>
                </div>
              )}
              {bookingStatus === "PAYMENT_REVIEW" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handlePaymentApprove}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100 transition hover:bg-emerald-400/20"
                  >
                    محاكاة تأكيد الدفع
                  </button>
                  <button
                    type="button"
                    onClick={handlePaymentReject}
                    className="inline-flex items-center gap-2 rounded-full border border-red-400/60 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-100 transition hover:bg-red-400/20"
                  >
                    محاكاة رفض الدفع
                  </button>
                </div>
              )}
              <div className="w-full">
                <Button
                  onClick={() => {
                    if (bookingStatus === "PAYMENT_PENDING") {
                      setIsPaymentOpen(true)
                      return
                    }
                    if (bookingStatus === "PAYMENT_REJECTED") {
                      setIsPaymentOpen(true)
                      return
                    }
                    if (bookingStatus === "PENDING_APPROVAL" || bookingStatus === "PAYMENT_REVIEW" || bookingStatus === "BOOKED") {
                      return
                    }
                    setIsBookingOpen(true)
                  }}
                  disabled={bookingStatus === "PENDING_APPROVAL" || bookingStatus === "PAYMENT_REVIEW" || bookingStatus === "BOOKED"}
                  className="w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 px-10 transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 animate-cta-pop"
                >
                  {bookingStatus === "PAYMENT_PENDING"
                    ? "تأكيد الدفع"
                    : bookingStatus === "PAYMENT_REVIEW"
                      ? "تم إرسال الدفع"
                      : bookingStatus === "PAYMENT_REJECTED"
                        ? "تعديل الدفع"
                        : bookingStatus === "PENDING_APPROVAL"
                          ? "تم الحجز مبدئيًا"
                          : bookingStatus === "BOOKED"
                            ? "تم الحجز"
                            : bookingStatus === "NONE"
                              ? "حجز القاعة"
                              : "تعديل الحجز"}
                </Button>
              </div>

              {bookingStatus !== "NONE" && (
                <div
                  key={bookingStatus}
                  dir="rtl"
                  className={`mt-4 rounded-2xl border p-4 text-right text-sm backdrop-blur animate-stepper-reveal ${
                    bookingStatus === "PENDING_APPROVAL"
                      ? "border-white/10 bg-white/5 text-white/70 shadow-none opacity-75"
                      : "border-white/15 bg-white/10 text-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.2)]"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] top-5 h-1 rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${(getCurrentStepIndex() - 1) / (bookingSteps.length - 1) * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-4">
                      {bookingSteps.map((step) => {
                        const state = getStepState(step.id)
                        const circleClass =
                          state === "completed"
                            ? "bg-emerald-500 text-white"
                            : state === "active"
                              ? "bg-blue-500 text-white ring-4 ring-blue-400/30"
                              : state === "rejected"
                                ? "bg-red-500 text-white"
                                : "border border-white/30 bg-slate-900/80 text-white/70"
                        return (
                          <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${circleClass}`}>
                              {state === "completed" ? "✓" : state === "rejected" ? "✕" : step.id}
                            </div>
                            <span className="mt-2 text-xs font-medium text-white/90">{step.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative -mt-4 aspect-square w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-lg">
              <Image
                src={hall.image}
                alt={hall.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 360px, 420px"
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50" />
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent dir="rtl" className="max-w-4xl overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>حجز القاعة</DialogTitle>
          </DialogHeader>

          {bookingStatus === "NONE" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6">
              <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">تسجيل مبدئي</h2>
                  <p className="text-sm text-slate-500">اختر اليوم المناسب ثم الفترات المتاحة للحجز.</p>
                </div>
                <div className="text-sm text-slate-500">
                  السعر بالساعة: <span className="font-semibold text-slate-900">{hall.hourlyRate} ر.ي</span>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(currentYear, currentMonth).toLocaleDateString("ar-YE", { month: "long", year: "numeric" })}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                        onClick={() => setMonthOffset((prev) => prev - 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                        onClick={() => setMonthOffset((prev) => prev + 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                    {dayLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-2">
                    {Array.from({ length: leadingBlanks + daysInMonth }, (_, idx) => {
                      if (idx < leadingBlanks) {
                        return <div key={`blank-${idx}`} />
                      }
                      const day = idx - leadingBlanks + 1
                      const date = new Date(currentYear, currentMonth, day)
                      const dateKey = formatDateKey(date)
                      const disabled = isPastDate(date) || !hasAvailableSlots(dateKey)
                      const isSelected = activeDate === dateKey
                      const isToday = formatDateKey(new Date()) === dateKey
                      const hasSelection = (selectedSlotsByDate[dateKey]?.length ?? 0) > 0

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleDateSelect(dateKey)}
                          className={`h-9 rounded-lg text-sm transition ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-sm"
                              : disabled
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : hasSelection
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-white text-slate-700 hover:bg-blue-50 border border-slate-200"
                          }`}
                        >
                          <span className={`${isToday && !isSelected ? "rounded-full border border-blue-300 px-2 py-0.5" : ""}`}>
                            {day}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-700 text-right">الفترات المتاحة</h3>
                  {!activeDate ? (
                    <p className="mt-3 text-sm text-slate-500 text-right">اختر يومًا أولاً لعرض الفترات.</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {slots.map((slot) => {
                        const disabled = isSlotUnavailable(activeDate, slot)
                        const selected = (selectedSlotsByDate[activeDate] ?? []).includes(slot)
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleSlotToggle(slot)}
                            className={`rounded-lg border px-3 py-2 text-sm transition ${
                              selected
                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                : disabled
                                  ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "border-blue-200 text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {disabled && <Lock className="h-3 w-3" />}
                              <span>{formatTime(slot)} - {formatTime(slot + 1)}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 text-right">
                <div className="text-sm text-slate-600">
                  {activeDate
                    ? `اليوم الحالي: ${activeDate}`
                    : "لم يتم اختيار يوم بعد."}
                  {totalHours > 0 && (
                    <span className="mr-2">| عدد الأيام: {selectedDateCount} | عدد الساعات: {totalHours} | الإجمالي: {totalPrice} ر.ي</span>
                  )}
                </div>
                {selectedDateCount > 0 && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-800">الأيام والفترات المختارة</p>
                    <ul className="mt-2 space-y-1">
                      {Object.entries(selectedSlotsByDate)
                        .filter(([, slots]) => slots.length > 0)
                        .map(([date, slots]) => (
                          <li key={date} className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-500">{formatDateLabel(date)}:</span>
                            <span className="font-semibold">
                              {formatSlotRanges(slots).join("، ")}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                <Button
                  className="w-full rounded-full bg-blue-600 text-white hover:bg-blue-700 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 disabled:opacity-60"
                  disabled={totalHours === 0}
                  onClick={handleInitialBooking}
                >
                  تسجيل مبدئي
                </Button>
              </div>
            </div>
          )}

          {bookingStatus === "PENDING_APPROVAL" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6 text-right">
              <h2 className="text-lg font-bold text-slate-900">انتظار موافقة المعهد</h2>
              <p className="mt-2 text-sm text-slate-500">تم إرسال طلب الحجز ويجري مراجعته من المعهد.</p>
              <div className="mt-3 text-sm text-slate-700">
                عدد الأيام: {selectedDateCount} | عدد الساعات: {totalHours} | الإجمالي: {totalPrice} ر.ي
              </div>
            </div>
          )}

          {bookingStatus === "PAYMENT_PENDING" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6 text-right">
              <h2 className="text-lg font-bold text-slate-900">تأكيد الدفع</h2>
              <p className="mt-2 text-sm text-slate-500">راجع تفاصيل الحجز ثم أكد الدفع للانتقال لإتمام الحجز.</p>
              <div className="mt-4 text-sm text-slate-700">
                عدد الأيام: {selectedDateCount} | عدد الساعات: {totalHours} | الإجمالي: {totalPrice} ر.ي
              </div>
              <Button
                className="mt-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 text-sm"
                onClick={() => setIsPaymentOpen(true)}
              >
                تأكيد الدفع
              </Button>
            </div>
          )}

          {bookingStatus === "PAYMENT_REVIEW" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6 text-right">
              <h2 className="text-lg font-bold text-slate-900">مراجعة الدفع</h2>
              <p className="mt-2 text-sm text-slate-500">تم إرسال سند الدفع وجاري مراجعته من المعهد.</p>
              <div className="mt-4 text-sm text-slate-700">
                عدد الأيام: {selectedDateCount} | عدد الساعات: {totalHours} | الإجمالي: {totalPrice} ر.ي
              </div>
            </div>
          )}

          {bookingStatus === "PAYMENT_REJECTED" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6 text-right">
              <h2 className="text-lg font-bold text-red-600">تم رفض الدفع</h2>
              <p className="mt-2 text-sm text-slate-600">يمكنك تعديل سند الدفع وإعادة الإرسال.</p>
            </div>
          )}

          {bookingStatus === "BOOKED" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6 text-right">
              <h2 className="text-lg font-bold text-emerald-600">تم الحجز</h2>
              <p className="mt-2 text-sm text-slate-600">تم حجز القاعة بنجاح.</p>
            </div>
          )}

          {bookingStatus === "REJECTED" && (
            <div className="rounded-2xl border-t border-slate-100 bg-white p-6 text-right">
              <h2 className="text-lg font-bold text-red-600">تم رفض الحجز</h2>
              <p className="mt-2 text-sm text-slate-600">يمكنك اختيار موعد آخر وإعادة المحاولة.</p>
              <Button
                className="mt-4 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-10 px-6 text-sm"
                onClick={() => {
                  setBookingStatus("NONE")
                  setActiveDate(null)
                  setSelectedSlotsByDate({})
                }}
              >
                حجز جديد
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent
          dir="rtl"
          className="max-w-3xl [&>button[data-dialog-close='default']]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4"
        >
          <DialogClose className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30">
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
          <DialogHeader className="space-y-2 text-right">
            <DialogTitle className="text-right">تأكيد الدفع</DialogTitle>
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
                  className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-5 text-sm transition ${
                    isDraggingFile ? "border-blue-500 bg-blue-50/60" : "border-slate-200 bg-slate-50/60"
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
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReceiptFile(null)
                          setReceiptInfo({ name: "" })
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
                            className={`h-4 w-4 text-slate-400 transition-transform ${
                              isOpen ? "rotate-180" : ""
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
                              </div>
                            )}
                            {!hasIban && hasAccountNumber && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs text-slate-500">رقم الحساب</p>
                                <p className="font-mono text-sm font-semibold text-slate-900">
                                  {bank.accountNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-700">تفاصيل الإجمالي</p>
                <div className="mt-2 text-sm text-slate-600">
                  عدد الأيام: {selectedDateCount} | عدد الساعات: {totalHours}
                </div>
                {selectedDateCount > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {Object.entries(selectedSlotsByDate)
                      .filter(([, slots]) => slots.length > 0)
                      .map(([date, slots]) => (
                        <li key={date} className="flex flex-wrap items-center gap-2">
                          <span className="text-slate-500">{formatDateLabel(date)}:</span>
                          <span className="font-semibold">{formatSlotRanges(slots).join("، ")}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">المبلغ المستحق</p>
                <p className="text-lg font-semibold text-slate-900">{totalPrice} ر.ي</p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              onClick={handlePaymentConfirmation}
              disabled={!receiptFile?.name && !receiptInfo.name}
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

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-1">
          <Card className="w-full rounded-2xl border border-slate-100 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
            <CardContent className="p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex items-center justify-start md:justify-end">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                    <Image
                      src="/images/logo.png"
                      alt="شعار المعهد"
                      fill
                      className="object-contain p-4"
                      sizes="112px"
                    />
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <h2 className="text-lg font-bold text-slate-900">معهد منصة د</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    معهد تدريبي متخصص في القاعات التعليمية والدورات الاحترافية.
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <a href="tel:+456123777967" className="flex items-center gap-2 text-slate-700 hover:text-blue-700">
                      <Phone className="h-4 w-4" />
                      <span className="text-slate-500">رقم التواصل:</span>
                      <span className="font-semibold">+456 123 777 967</span>
                    </a>
                    <a href="mailto:institute@manasa.edu" className="flex items-center gap-2 text-slate-700 hover:text-blue-700">
                      <Mail className="h-4 w-4" />
                      <span className="text-slate-500">البريد الإلكتروني:</span>
                      <span className="font-semibold">institute@manasa.edu</span>
                    </a>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {locationUrl ? (
                      <a
                        href={locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                        aria-label="الموقع على الخريطة"
                      >
                        <MapPin className="h-4 w-4" />
                      </a>
                    ) : (
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-300 cursor-not-allowed"
                        aria-label="الموقع غير متوفر"
                      >
                        <MapPin className="h-4 w-4" />
                      </span>
                    )}
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600"
                      aria-label="انستقرام"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                      aria-label="فيسبوك"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
                      aria-label="الموقع الإلكتروني"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
