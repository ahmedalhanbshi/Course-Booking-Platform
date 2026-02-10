"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Save, Send, Trash2, ArrowLeft, X, MapPin, Users, Building, Globe, Plus, Calendar, Clock, CheckCircle, AlertCircle, Banknote, Lock } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const mockUser = {
  id: "2",
  name: "فاطمة علي",
  email: "fatima@example.com",
  role: 'trainer' as const,
}

const categories = [
  "تطوير الويب",
  "التصميم",
  "إدارة الأعمال",
  "تطوير البرمجيات",
  "التسويق",
  "قواعد البيانات",
  "الذكاء الاصطناعي",
  "الأمن السيبراني"
]

const platforms = [
  { value: "zoom", label: "Zoom" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "meet", label: "Google Meet" },
  { value: "webex", label: "Webex" },
  { value: "other", label: "أخرى" }
]

const pricingHalls = [
  { id: "hall-1", name: "القاعة الرئيسية", capacity: 80 },
  { id: "hall-2", name: "قاعة الاجتماعات الذكية", capacity: 18 },
  { id: "hall-3", name: "معمل الحاسب المتقدم", capacity: 30 },
  { id: "hall-4", name: "قاعة التدريب (ج)", capacity: 40 }
]

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00"
]

const hallAvailability: Record<string, number[]> = {
  "hall-1": [2, 5, 7, 10, 12, 15, 18, 22, 25, 28],
  "hall-2": [1, 3, 6, 9, 13, 16, 20, 23, 27],
  "hall-3": [4, 8, 11, 14, 17, 19, 24, 26, 29],
  "hall-4": [2, 6, 9, 12, 15, 18, 21, 24, 27]
}

const weekDaysShort = ["أحد", "اثن", "ثلا", "أرب", "خم", "جم", "سبت"]
const COURSE_CARD_IMAGE_WIDTH = 260
const COURSE_CARD_IMAGE_HEIGHT = 260

// Mock data for halls (Shared with Halls Page)
const mockHalls = [
  {
    id: "hall-1",
    name: "القاعة الرئيسية",
    capacity: 80,
    location: "الدور الأرضي • الجناح الشرقي",
    type: "قاعة محاضرات",
    hourlyRate: 18000,
    description: "قاعة واسعة للمحاضرات والفعاليات الكبرى مع تجهيزات عرض متكاملة.",
    image: "https://images.unsplash.com/photo-1760121788536-9797394e210e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1600"
  },
  {
    id: "hall-2",
    name: "قاعة الاجتماعات الذكية",
    capacity: 18,
    location: "الدور الأول • الجناح الغربي",
    type: "قاعة اجتماعات",
    hourlyRate: 12000,
    description: "مساحة مريحة لاجتماعات الفرق مع شاشة تفاعلية وإضاءة هادئة.",
    image: "https://images.unsplash.com/photo-1766802981801-4b4a9a1d8f1c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1600"
  },
  {
    id: "hall-3",
    name: "معمل الحاسب المتقدم",
    capacity: 30,
    location: "الدور الثاني • الجناح الشرقي",
    type: "معمل",
    hourlyRate: 15000,
    description: "معمل مجهز لأعمال التدريب العملي مع أجهزة حديثة وشبكة قوية.",
    image: "https://images.unsplash.com/photo-1725274032244-9a8f0fa1e9a7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1600"
  },
  {
    id: "hall-4",
    name: "قاعة التدريب (ج)",
    capacity: 40,
    location: "الدور الأول • الجناح الشرقي",
    type: "قاعة محاضرات",
    hourlyRate: 14000,
    description: "قاعة متوسطة مناسبة للدورات وورش العمل القصيرة.",
    image: "https://images.unsplash.com/photo-1670348060135-d4c6662b4138?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1600"
  }
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("pricing")
  
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    shortDescription: "",
    description: "",
    deliveryType: "", // in_person, online, hybrid, capacity_based (risk-free)
    price: "",
    minStudents: "",
    maxStudents: "",
    isFree: false,
    startDate: "",
    endDate: "",
    instituteId: "",
    prerequisites: "",
    objectives: [] as string[],
    tags: [] as string[],
    hallId: "",
    hallName: "",
    onlinePlatform: "",
    meetingLink: "",
    startTime: "",
    endTime: "",
    imageFile: null as File | null,
    imagePreviewUrl: ""
  })

  const courseImageInputRef = useRef<HTMLInputElement>(null)
  const [courseImageError, setCourseImageError] = useState("")
  const [isImageDragging, setIsImageDragging] = useState(false)
  const [selectedSessions, setSelectedSessions] = useState<{ date: string, slot: string }[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarOffset, setCalendarOffset] = useState(0)
  const [unavailableMessage, setUnavailableMessage] = useState("")
  const [onlineSchedule, setOnlineSchedule] = useState({
    startDate: "",
    startTime: "",
    duration: "",
    platform: "",
    meetingLink: ""
  })

  const [currentObjective, setCurrentObjective] = useState("")
  const [currentTag, setCurrentTag] = useState("")

  useEffect(() => {
    return () => {
      if (courseData.imagePreviewUrl) {
        URL.revokeObjectURL(courseData.imagePreviewUrl)
      }
    }
  }, [courseData.imagePreviewUrl])

  useEffect(() => {
    setSelectedDate(null)
    setSelectedSessions([])
    setUnavailableMessage("")
    setCalendarOffset(0)
  }, [courseData.hallId])

  useEffect(() => {
    setSelectedDate(null)
    setUnavailableMessage("")
  }, [calendarOffset])

  useEffect(() => {
    const handleHallMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as
        | {
            type?: string
            payload?: { id?: string; name?: string }
          }
        | null
      if (!data || data.type !== "hall-selected" || !data.payload?.id) return

      setCourseData((prev) => ({
        ...prev,
        hallId: data.payload?.id ?? prev.hallId,
        hallName: data.payload?.name ?? prev.hallName
      }))
    }

    window.addEventListener("message", handleHallMessage)
    return () => window.removeEventListener("message", handleHallMessage)
  }, [])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const maxMonthsAhead = 5

  const formatDateLabel = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-")
    return `${day}-${month}-${year}`
  }
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const monthDate = new Date(todayStart.getFullYear(), todayStart.getMonth() + calendarOffset, 1)
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const monthLabel = monthDate.toLocaleDateString("ar-SA", { month: "long", year: "numeric" })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const base = hallAvailability[courseData.hallId] ?? []
  const availableDaysSet = new Set(
    base.map((day) => ((day + calendarOffset * 2 - 1) % daysInMonth) + 1)
  )

  const calendarDays: Array<{ day: number; dateKey: string; isPast: boolean } | null> = []
  for (let i = 0; i < firstDay; i += 1) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dateValue = new Date(year, month, day)
    const isPast = dateValue < todayStart
    calendarDays.push({ day, dateKey, isPast })
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null)
  }

  const isPastDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-")
    return new Date(Number(year), Number(month) - 1, Number(day)) < todayStart
  }

  const getDayMeta = (day: number, dateKey: string, isPast: boolean) => {
    if (isPast) {
      return { isSelectable: false, reason: "اليوم في الماضي", availableSlots: [] as string[], bookedSlots: [] as string[] }
    }

    const isBaseAvailable = availableDaysSet.has(day)
    if (day % 5 === 0) {
      return { isSelectable: false, reason: "القاعة مغلقة", availableSlots: [], bookedSlots: [] }
    }
    if (day % 7 === 0) {
      return { isSelectable: false, reason: "خارج ساعات العمل", availableSlots: [], bookedSlots: [] }
    }
    if (day % 6 === 0) {
      return { isSelectable: false, reason: "لا يوجد وقت كافٍ لمدة الجلسة", availableSlots: [], bookedSlots: [] }
    }
    if (!isBaseAvailable || day % 4 === 0) {
      return { isSelectable: false, reason: "محجوز بالكامل", availableSlots: [], bookedSlots: [...timeSlots] }
    }
    if (day % 3 === 0) {
      const bookedSlots = [timeSlots[0]]
      const availableSlots = timeSlots.filter((slot) => !bookedSlots.includes(slot))
      return { isSelectable: true, reason: "", availableSlots, bookedSlots }
    }

    return { isSelectable: true, reason: "", availableSlots: [...timeSlots], bookedSlots: [] }
  }

  const hasAvailability = calendarDays.some((cell) => {
    if (!cell) return false
    const meta = getDayMeta(cell.day, cell.dateKey, cell.isPast)
    return meta.isSelectable
  })

  const selectedSessionsForDay = selectedDate ? selectedSessions.filter((s) => s.date === selectedDate) : []
  const selectedDay = selectedDate ? Number(selectedDate.split("-")[2]) : null
  const selectedMeta = selectedDate && selectedDay ? getDayMeta(selectedDay, selectedDate, isPastDate(selectedDate)) : null
  const slotsForSelectedDate = selectedMeta?.availableSlots ?? []
  const bookedSlotsForSelectedDate = selectedMeta?.bookedSlots ?? []
  const sortedSessions = [...selectedSessions].sort((a, b) => {
    if (a.date === b.date) return a.slot.localeCompare(b.slot)
    return a.date.localeCompare(b.date)
  })

  const handleSelectDay = (dateKey: string, isAvailable: boolean, reason: string) => {
    if (!isAvailable) {
      setUnavailableMessage(`لا يمكن الحجز في هذا اليوم لأن: ${reason}`)
      setSelectedDate(null)
      return
    }
    setUnavailableMessage("")
    setSelectedDate(dateKey)
  }

  const toggleSessionSlot = (date: string, slot: string) => {
    const exists = selectedSessions.some((s) => s.date === date && s.slot === slot)
    if (exists) {
      setSelectedSessions((prev) => prev.filter((s) => !(s.date === date && s.slot === slot)))
      return
    }
    setSelectedSessions((prev) => [...prev, { date, slot }])
  }

  const handleOpenHallPicker = () => {
    if (typeof window === "undefined") return
    window.open("/trainer/halls?mode=select", "_blank")
  }
  

  const handleSubmit = async (action: 'draft' | 'submit') => {
    setIsSubmitting(true)

    const payloadData = {
      ...courseData,
      imageFile: undefined,
      imagePreviewUrl: undefined
    }
    const payload = new FormData()
    payload.append("courseData", JSON.stringify(payloadData))
    if (courseData.imageFile) {
      payload.append("image", courseData.imageFile)
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)

    if (action === 'submit') {
      // Logic: If physical hall selected, status = 'pending_approval'
      if (courseData.deliveryType === 'in_person' || courseData.deliveryType === 'hybrid') {
          toast.success("تم إرسال الدورة وطلب حجز القاعة للمراجعة المبدئية")
      } else if (courseData.deliveryType === 'capacity_based') {
          toast.success("تم نشر الدورة بنظام الحجز المبكر (تحديد القاعة لاحقاً)")
      } else {
          toast.success("تم إنشاء الدورة بنجاح")
      }
      
      // Redirect to courses list
      router.push('/trainer/courses')
    } else {
      // Show success message and stay on page
      toast.success('تم حفظ الدورة كمسودة')
    }
  }

  const handleDelete = () => {
    // In real app, this would delete the course
    console.log('Deleting course...')
    setShowDeleteDialog(false)
    router.push('/trainer/courses')
  }

  const addObjective = () => {
    if (currentObjective.trim()) {
      setCourseData(prev => ({
        ...prev,
        objectives: [...prev.objectives, currentObjective.trim()]
      }))
      setCurrentObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (!Number.isFinite(bytes)) return ""
    if (bytes < 1024) return `${bytes} بايت`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`
    return `${(bytes / 1024 / 1024).toFixed(2)} م.ب`
  }

  const loadImageElement = (file: File) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const image = new window.Image()
      image.onload = () => {
        URL.revokeObjectURL(url)
        resolve(image)
      }
      image.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error("image-load-failed"))
      }
      image.src = url
    })

  const compressCourseImage = async (file: File, image: HTMLImageElement) => {
    const canvas = document.createElement("canvas")
    canvas.width = COURSE_CARD_IMAGE_WIDTH
    canvas.height = COURSE_CARD_IMAGE_HEIGHT
    const context = canvas.getContext("2d")
    if (!context) throw new Error("canvas-unavailable")

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"
    context.drawImage(image, 0, 0, COURSE_CARD_IMAGE_WIDTH, COURSE_CARD_IMAGE_HEIGHT)

    const baseName = file.name.replace(/\.[^/.]+$/, "")
    const makeBlob = (type: string, quality: number) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

    let blob = await makeBlob("image/webp", 0.92)
    let extension = "webp"
    if (!blob) {
      blob = await makeBlob("image/jpeg", 0.92)
      extension = "jpg"
    }
    if (!blob) {
      throw new Error("compression-failed")
    }

    return new File([blob], `${baseName}.${extension}`, { type: blob.type })
  }

  const handleCourseImageFile = async (file?: File | null) => {
    if (!file) return
    setCourseImageError("")

    if (!file.type.startsWith("image/")) {
      setCourseImageError("الملف المحدد ليس صورة. يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP.")
      return
    }

    try {
      const image = await loadImageElement(file)
      const width = image.naturalWidth || image.width
      const height = image.naturalHeight || image.height

      if (width !== COURSE_CARD_IMAGE_WIDTH || height !== COURSE_CARD_IMAGE_HEIGHT) {
        setCourseImageError(
          `المقاس غير مطابق. المطلوب ${COURSE_CARD_IMAGE_WIDTH}×${COURSE_CARD_IMAGE_HEIGHT} بكسل. المقاس الحالي ${width}×${height} بكسل.`
        )
        return
      }

      const compressedFile = await compressCourseImage(file, image)
      const previewUrl = URL.createObjectURL(compressedFile)

      setCourseData(prev => ({
        ...prev,
        imageFile: compressedFile,
        imagePreviewUrl: previewUrl
      }))
    } catch (error) {
      setCourseImageError("تعذر معالجة الصورة. يرجى اختيار صورة أخرى.")
    }
  }

  const clearCourseImage = () => {
    setCourseData(prev => ({
      ...prev,
      imageFile: null,
      imagePreviewUrl: ""
    }))
    setCourseImageError("")
  }

  const priceValue = Number(courseData.price || 0)
  const minCapacityValue = Number(courseData.minStudents || 0)
  const maxCapacityValue = Number(courseData.maxStudents || 0)

  const isPriceValid = courseData.isFree || priceValue > 0
  const isCapacityValid =
    minCapacityValue >= 1 &&
    maxCapacityValue >= 1 &&
    minCapacityValue <= maxCapacityValue
  const isModeSelected = courseData.deliveryType === "online" || courseData.deliveryType === "in_person"
  const isInPersonValid = courseData.deliveryType === "in_person" && !!courseData.hallId && selectedSessions.length > 0
  const isOnlineValid = courseData.deliveryType === "online" && !!onlineSchedule.startDate && !!onlineSchedule.startTime && !!onlineSchedule.duration
  const isStep2Valid = isPriceValid && isCapacityValid && isModeSelected && (courseData.deliveryType === "in_person" ? isInPersonValid : isOnlineValid)

  const isInfoValid = () => {
      return (
        courseData.title &&
        courseData.category &&
        courseData.shortDescription &&
        courseData.description &&
        courseData.imageFile &&
        !courseImageError
      )
  }

  const isPricingValid = () => {
      return isStep2Valid
  }

  const isLocationValid = () => {
      if (!courseData.deliveryType) return false
      if (courseData.deliveryType === 'in_person' && !courseData.hallId) return false
      return true
  }

  const handleStep2Next = () => {
      if (!isStep2Valid) return
      setActiveTab("location")
  }

  const selectedHall = mockHalls.find(h => h.id === courseData.hallId)
  const selectedHallName = selectedHall?.name ?? courseData.hallName
  const totalSelectedHours = selectedSessions.length
  const totalSelectedDays = new Set(selectedSessions.map((s) => s.date)).size
  const totalSelectedPrice = selectedHall ? totalSelectedHours * selectedHall.hourlyRate : 0

  return (
    <div className="max-w-5xl mx-auto pb-12" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/trainer/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للدورات
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إنشاء دورة تدريبية جديدة
        </h1>
        <p className="text-gray-600">
          اتبع الخطوات التالية لإنشاء ونشر دورتك التدريبية
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        {/* Step Indicator (Tabs List) */}
        <div className="w-full bg-white p-2 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-50/50">
                <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</div>
                    بيانات الدورة
                </TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</div>
                    الحجز والمواعيد
                </TabsTrigger>
            </TabsList>
            <div className="mt-3 h-1 w-full rounded-full bg-gray-100">
                <div
                    className="h-1 rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                        width: activeTab === "info" ? "50%" : "100%"
                    }}
                />
            </div>
        </div>

        {/* Tab 1: Course Info */}
        <TabsContent value="info" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <div className="space-y-6">
                
                {/* 1. Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                        <CardDescription>تفاصيل الدورة والعنوان</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
                            <div className="space-y-3">
                                <Label htmlFor="courseImage">صورة الدورة *</Label>
                                <div
                                    className={`relative h-[260px] w-[260px] max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-shadow ${
                                        isImageDragging ? "ring-2 ring-blue-500 ring-offset-2" : ""
                                    }`}
                                    onDragOver={(event) => {
                                        event.preventDefault()
                                        setIsImageDragging(true)
                                    }}
                                    onDragLeave={() => setIsImageDragging(false)}
                                    onDrop={(event) => {
                                        event.preventDefault()
                                        setIsImageDragging(false)
                                        handleCourseImageFile(event.dataTransfer.files?.[0])
                                    }}
                                >
                                    <input
                                        ref={courseImageInputRef}
                                        id="courseImage"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(event) => {
                                            handleCourseImageFile(event.target.files?.[0])
                                            event.currentTarget.value = ""
                                        }}
                                    />

                                    {courseData.imagePreviewUrl ? (
                                        <>
                                            <Image
                                                src={courseData.imagePreviewUrl}
                                                alt={courseData.title || "صورة الدورة"}
                                                fill
                                                sizes="260px"
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    className="h-8 bg-white/95 hover:bg-white"
                                                    onClick={() => courseImageInputRef.current?.click()}
                                                >
                                                    تغيير
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 bg-white/95 text-slate-700 hover:bg-white"
                                                    onClick={clearCourseImage}
                                                >
                                                    حذف
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] text-slate-600">
                                                {COURSE_CARD_IMAGE_WIDTH}×{COURSE_CARD_IMAGE_HEIGHT} • 1:1
                                            </span>
                                            <p className="text-sm font-semibold text-slate-700">
                                                اسحب الصورة هنا أو اختر من الجهاز
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="bg-white/90"
                                                onClick={() => courseImageInputRef.current?.click()}
                                            >
                                                اختيار من الجهاز
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {courseData.imageFile && !courseImageError && (
                                    <div className="text-xs text-emerald-600">
                                        تم ضغط الصورة تلقائيًا بجودة عالية
                                        {courseData.imageFile.size ? ` (${formatFileSize(courseData.imageFile.size)})` : ""}
                                    </div>
                                )}

                                {courseImageError && (
                                    <p className="text-xs text-red-500">{courseImageError}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                <Label htmlFor="title">عنوان الدورة *</Label>
                                <Input
                                    id="title"
                                    placeholder="مثال: تعلم React من الصفر"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                                />
                                </div>

                                <div className="space-y-2">
                                <Label htmlFor="category">الفئة *</Label>
                                <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                                    <SelectTrigger>
                                    <SelectValue placeholder="اختر فئة الدورة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                        {category}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                </div>

                                <div className="space-y-2">
                                <Label htmlFor="shortDescription">وصف الترويجي (قصير) *</Label>
                                <Textarea
                                    id="shortDescription"
                                    placeholder="وصف يظهر في بطاقة الدورة..."
                                    value={courseData.shortDescription}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, shortDescription: e.target.value }))}
                                    rows={2}
                                />
                                </div>
                                
                                <div className="space-y-2">
                                <Label htmlFor="description">الوصف التفصيلي *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="ماذا سيتعلم الطالب؟ المتطلبات..."
                                    value={courseData.description}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. التسعير */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between text-right">
                            <CardDescription className="text-right">حدد الحد الأدنى والأقصى للمقاعد.</CardDescription>
                            <div className="flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-blue-600" />
                                <CardTitle>العدد والتسعير</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minCapacity">الحد الأدنى للمقاعد *</Label>
                                <div className="relative">
                                    <Input
                                        id="minCapacity"
                                        type="number"
                                        dir="rtl"
                                        value={courseData.minStudents}
                                        onChange={(e) => setCourseData(prev => ({ ...prev, minStudents: e.target.value }))}
                                        className="h-11 pl-16 [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                                        مقعد
                                    </span>
                                </div>
                                <p className="min-h-[16px] text-xs text-red-500">
                                    {!isCapacityValid ? "يرجى إدخال حد أدنى صحيح." : ""}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capacity">الحد الأقصى للمقاعد *</Label>
                                <div className="relative">
                                    <Input
                                        id="capacity"
                                        type="number"
                                        dir="rtl"
                                        value={courseData.maxStudents}
                                        onChange={(e) => setCourseData(prev => ({ ...prev, maxStudents: e.target.value }))}
                                        className="h-11 pl-16 [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                                        مقعد
                                    </span>
                                </div>
                                <p className="min-h-[16px] text-xs text-red-500">
                                    {!isCapacityValid ? "يرجى إدخال حد أقصى صحيح." : ""}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <input
                                            id="isFree"
                                            type="checkbox"
                                            checked={courseData.isFree}
                                            onChange={(e) =>
                                                setCourseData(prev => ({
                                                    ...prev,
                                                    isFree: e.target.checked,
                                                    price: e.target.checked ? "0" : prev.price
                                                }))
                                            }
                                        />
                                        <label htmlFor="isFree">مجانية</label>
                                    </div>
                                    <Label htmlFor="price">سعر الدورة *</Label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="number"
                                        dir="rtl"
                                        value={courseData.price}
                                        onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                                        disabled={courseData.isFree}
                                        className="h-11 pl-16 [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                                        ر.ي
                                    </span>
                                </div>
                                <p className="min-h-[16px] text-xs text-red-500">
                                    {!isPriceValid ? "يرجى إدخال سعر صحيح." : ""}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Media & Attributes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Objectives */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">أهداف الدورة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                            <Input
                                placeholder="أضف هدف..."
                                value={currentObjective}
                                onChange={(e) => setCurrentObjective(e.target.value)}
                                className="h-8 text-sm"
                            />
                            <Button type="button" size="sm" onClick={addObjective}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {courseData.objectives.map((obj, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                    <span>{obj}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(i)} className="h-6 w-6 p-0"><X className="h-3 w-3" /></Button>
                                </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">الكلمات المفتاحية</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input placeholder="أضف كلمة..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} className="h-8 text-sm"/>
                                <Button type="button" size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {courseData.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)}/>
                                </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" onClick={() => handleSubmit('draft')}>حفظ كمسودة</Button>
                <Button onClick={() => setActiveTab("pricing")} disabled={!isInfoValid()}>التالي: التسعير والمواعيد</Button>
            </div>
        </TabsContent>

                {/* Tab 2: Pricing & Schedule */}
        <TabsContent value="pricing" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <div className="space-y-6">
                {/* Course Mode Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            نوع الدورة
                        </CardTitle>
                        <CardDescription>اختر طريقة تقديم الدورة.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup
                            value={courseData.deliveryType}
                            onValueChange={(value) => setCourseData(prev => ({ ...prev, deliveryType: value }))}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <label className={`relative flex items-center justify-between gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="online" className="sr-only" />
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">أونلاين</p>
                                        <p className="text-xs text-gray-500">عبر الإنترنت بالكامل</p>
                                    </div>
                                </div>
                                {courseData.deliveryType === 'online' && (
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                )}
                            </label>
                            <label className={`relative flex items-center justify-between gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${courseData.deliveryType === 'in_person' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="in_person" className="sr-only" />
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                        <Building className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">حضوري</p>
                                        <p className="text-xs text-gray-500">داخل القاعة التدريبية</p>
                                    </div>
                                </div>
                                {courseData.deliveryType === 'in_person' && (
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                )}
                            </label>
                        </RadioGroup>
                        {!isModeSelected && (
                            <p className="text-xs text-red-500">يرجى اختيار نوع الدورة.</p>
                        )}
                    </CardContent>
                </Card>

                {/* In-person flow */}
                {courseData.deliveryType === "in_person" && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>اختيار القاعة</CardTitle>
                                <CardDescription>حدد القاعة المناسبة للدورة.</CardDescription>
                            </CardHeader>
                        <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>القاعة *</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-between"
                                        onClick={handleOpenHallPicker}
                                    >
                                        <span>{selectedHallName || "اختر القاعة"}</span>
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                    </Button>
                                    {!courseData.hallId && (
                                        <p className="text-xs text-red-500">يرجى اختيار القاعة.</p>
                                    )}
                                </div>
                                {selectedHall && (
                                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                        <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start sm:gap-2">
                                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100">
                                                <Image
                                                    src={selectedHall.image}
                                                    alt={selectedHall.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-2 text-right" dir="rtl">
                                                <div className="flex items-center gap-2 justify-end flex-row-reverse">
                                                    <h4 className="text-base font-semibold text-slate-900">{selectedHall.name}</h4>
                                                    <Badge variant="secondary">{selectedHall.type}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-600">{selectedHall.description}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                    <a
                                                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-slate-600 hover:text-blue-700"
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHall.location)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {selectedHall.location}
                                                    </a>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        السعة: {selectedHall.capacity} شخص
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold text-blue-700">
                                                    {selectedHall.hourlyRate} ر.ي / ساعة
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                        {courseData.hallId && (
                            <Card>
                                <CardHeader>
                                <CardTitle className="flex items-center gap-2 justify-end text-right w-full">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    اختيار المواعيد
                                </CardTitle>
                                <CardDescription className="text-right">اختر الأيام والأوقات المتاحة لهذه القاعة.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.1fr]">
            <div className="order-2 rounded-2xl border border-slate-100 p-4 lg:order-2">
                <div className="flex items-center justify-between flex-row-reverse">
                    <p className="text-sm font-semibold text-slate-700">{monthLabel}</p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            onClick={() => setCalendarOffset((prev) => Math.max(0, prev - 1))}
                            disabled={calendarOffset === 0}
                        >
                            الشهر السابق
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            onClick={() => setCalendarOffset((prev) => Math.min(maxMonthsAhead, prev + 1))}
                            disabled={calendarOffset === maxMonthsAhead}
                        >
                            الشهر التالي
                        </button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                    {weekDaysShort.map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                    {calendarDays.map((cell, index) => {
                        if (!cell) return <div key={`empty-${index}`} />
                        const meta = getDayMeta(cell.day, cell.dateKey, cell.isPast)
                        const isSelected = selectedDate === cell.dateKey
                        const isToday = formatDateKey(new Date()) === cell.dateKey
                        const hasSelection = selectedSessions.some((s) => s.date === cell.dateKey)
                        return (
                            <button
                                key={cell.dateKey}
                                type="button"
                                title={!meta.isSelectable ? meta.reason : ""}
                                disabled={!meta.isSelectable}
                                onClick={() => handleSelectDay(cell.dateKey, meta.isSelectable, meta.reason)}
                                className={`h-9 rounded-lg text-sm transition ${
                                    isSelected
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : !meta.isSelectable
                                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                            : hasSelection
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "bg-white text-slate-700 hover:bg-blue-50 border border-slate-200"
                                }`}
                            >
                                <span className={`${isToday && !isSelected ? "rounded-full border border-blue-300 px-2 py-0.5" : ""}`}>
                                    {cell.day}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {unavailableMessage && (
                    <p className="mt-2 text-xs text-red-500 text-right">{unavailableMessage}</p>
                )}
            </div>

            <div className="order-1 rounded-2xl border border-slate-100 p-4 lg:order-1">
                <h4 className="text-sm font-semibold text-slate-700 text-right">الأوقات المتاحة</h4>
                {!hasAvailability && (
                    <p className="mt-3 text-sm text-slate-500 text-right">لا توجد مواعيد متاحة لهذه القاعة في هذا الشهر.</p>
                )}
                {selectedDate ? (
                    <>
                        <p className="mt-3 text-sm text-slate-500 text-right">اليوم المحدد: {formatDateLabel(selectedDate)}</p>
                        {slotsForSelectedDate.length === 0 ? (
                            <div className="mt-4 text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-4 text-right">
                                لا توجد أوقات متاحة في هذا اليوم
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {timeSlots.map((slot) => {
                                    const isBooked = bookedSlotsForSelectedDate.includes(slot)
                                    const isAvailable = slotsForSelectedDate.includes(slot)
                                    if (!isAvailable && !isBooked) return null
                                    const selected = selectedSessionsForDay.some((s) => s.slot === slot)
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            disabled={!isAvailable}
                                            onClick={() => isAvailable && toggleSessionSlot(selectedDate, slot)}
                                            className={`rounded-lg border px-3 py-2 text-sm transition ${
                                                selected
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                    : !isAvailable
                                                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                                        : "border-blue-200 text-blue-700 hover:bg-blue-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                {!isAvailable && <Lock className="h-3 w-3" />}
                                                <span>{slot}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="mt-3 text-sm text-slate-500 text-right">اختر يوماً من التقويم لعرض الأوقات.</p>
                )}

                {selectedSessions.length === 0 && (
                    <p className="mt-3 text-xs text-red-500 text-right">يرجى اختيار جلسة واحدة على الأقل</p>
                )}

                {selectedSessions.length > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-right">
                        <p className="font-semibold text-slate-800">تم اختيار {selectedSessions.length} جلسات</p>
                        <ul className="mt-2 space-y-1 text-slate-600">
                            {sortedSessions.map((session) => (
                                <li key={`${session.date}-${session.slot}`}>{formatDateLabel(session.date)} • {session.slot}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedSessions.length > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-white p-3 text-sm text-right">
                        <p className="font-semibold text-slate-800">الإجمالي</p>
                        <p className="mt-2 text-slate-600">
                            عدد الأيام: {totalSelectedDays} | عدد الساعات: {totalSelectedHours} | المبلغ: {totalSelectedPrice} ر.ي
                        </p>
                    </div>
                )}

            </div>
        </div>
    
</CardContent>
                            </Card>
                        )}
                    </>
                )}

                {/* Online flow */}
                {courseData.deliveryType === "online" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>مواعيد الدورة (أونلاين)</CardTitle>
                            <CardDescription>حدد تاريخ ووقت الجلسة الأولى.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>تاريخ البداية *</Label>
                                    <Input
                                        type="date"
                                        value={onlineSchedule.startDate}
                                        onChange={(e) => setOnlineSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                    {!onlineSchedule.startDate && (
                                        <p className="text-xs text-red-500">يرجى اختيار تاريخ البداية.</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>وقت البداية *</Label>
                                    <Input
                                        type="time"
                                        value={onlineSchedule.startTime}
                                        onChange={(e) => setOnlineSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                                    />
                                    {!onlineSchedule.startTime && (
                                        <p className="text-xs text-red-500">يرجى تحديد وقت البداية.</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>مدة الجلسة *</Label>
                                    <Select value={onlineSchedule.duration} onValueChange={(value) => setOnlineSchedule(prev => ({ ...prev, duration: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر المدة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="60">60 دقيقة</SelectItem>
                                            <SelectItem value="90">90 دقيقة</SelectItem>
                                            <SelectItem value="120">120 دقيقة</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {!onlineSchedule.duration && (
                                        <p className="text-xs text-red-500">يرجى اختيار مدة الجلسة.</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>المنصة (اختياري)</Label>
                                    <Select value={onlineSchedule.platform} onValueChange={(value) => setOnlineSchedule(prev => ({ ...prev, platform: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر المنصة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {platforms.map(platform => (
                                                <SelectItem key={platform.value} value={platform.value}>
                                                    {platform.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>رابط الاجتماع (اختياري)</Label>
                                    <Input
                                        type="text"
                                        value={onlineSchedule.meetingLink}
                                        onChange={(e) => setOnlineSchedule(prev => ({ ...prev, meetingLink: e.target.value }))}
                                        placeholder="https://"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setActiveTab("info")}>السابق</Button>
                <Button
                    onClick={() => handleSubmit('submit')}
                    disabled={
                        isSubmitting ||
                        (courseData.deliveryType === "in_person" && selectedSessions.length === 0) ||
                        (courseData.deliveryType === "online" && !isOnlineValid)
                    }
                >
                    {isSubmitting ? 'جاري الحجز...' : 'حجز'}
                </Button>
            </div>
        </TabsContent>

        {/* Tab 3: Location & Publish */}
        <TabsContent value="location" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <Card>
                <CardHeader>
                    <CardTitle>طريقة التقديم والمكان</CardTitle>
                    <CardDescription>حدد كيفية تقديم الدورة ومكان الانعقاد</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                         <Label className="text-base">اختر طريقة التقديم المفضلة</Label>
                         <RadioGroup
                            value={courseData.deliveryType}
                            onValueChange={(value) => setCourseData(prev => ({ ...prev, deliveryType: value }))}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {/* Option 1: Online */}
                            <label className={`
                                relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 cursor-pointer hover:bg-gray-50 transition-all
                                ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}
                            `}>
                                <RadioGroupItem value="online" className="sr-only" />
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold block">أونلاين (عن بعد)</span>
                                    <span className="text-xs text-gray-500">تقديم الدورة عبر الإنترنت بالكامل</span>
                                </div>
                                {courseData.deliveryType === 'online' && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-600" />}
                            </label>

                            {/* Option 2: In-Person (Book Hall) */}
                            <label className={`
                                relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 cursor-pointer hover:bg-gray-50 transition-all
                                ${courseData.deliveryType === 'in_person' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}
                            `}>
                                <RadioGroupItem value="in_person" className="sr-only" />
                                <div className="p-3 bg-green-100 rounded-full text-green-600">
                                    <Building className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold block">حضوري (حجز قاعة)</span>
                                    <span className="text-xs text-gray-500">يتطلب حجز قاعة الآن</span>
                                </div>
                                {courseData.deliveryType === 'in_person' && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-600" />}
                            </label>

                            {/* Option 3: Capacity Based (Risk Free) */}
                            <label className={`
                                relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 cursor-pointer hover:bg-gray-50 transition-all
                                ${courseData.deliveryType === 'capacity_based' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200'}
                            `}>
                                <RadioGroupItem value="capacity_based" className="sr-only" />
                                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold block">تحديد القاعة عند القبول</span>
                                    <span className="text-xs text-gray-500">نشر الدورة أولاً وتحديد القاعة عند اكتمال العدد</span>
                                </div>
                                {courseData.deliveryType === 'capacity_based' && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-purple-600" />}
                            </label>
                         </RadioGroup>
                    </div>

                    {/* Conditional Logic Content */}
                    <div className="pt-4 border-t">
                         {courseData.deliveryType === 'capacity_based' && (
                             <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                                 <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                                 <div>
                                     <h4 className="font-bold text-purple-900">وضع الحجز المرن (Risk-Free)</h4>
                                     <p className="text-purple-700 text-sm mt-1">
                                         عند اختيار هذا الوضع، سيتم نشر الدورة للطلاب للتسجيل المبدئي بدون حجز قاعة فعلية.
                                         يمكنك حجز القاعة وتحديد الموعد النهائي لاحقاً من لوحة التحكم عندما يكتمل العدد المطلوب.
                                     </p>
                                 </div>
                             </div>
                         )}

                         {courseData.deliveryType === 'in_person' && (
                             <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="hall" className="mb-2 block">اختيار القاعة *</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={handleOpenHallPicker}
                                >
                                    <span>{selectedHallName || "اختر القاعة المناسبة"}</span>
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                </Button>
                                {selectedHall && (
                                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                        <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start sm:gap-2">
                                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100">
                                                <Image
                                                    src={selectedHall.image}
                                                    alt={selectedHall.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-2 text-right" dir="rtl">
                                                <div className="flex items-center gap-2 justify-end flex-row-reverse">
                                                    <h4 className="text-base font-semibold text-slate-900">{selectedHall.name}</h4>
                                                    <Badge variant="secondary">{selectedHall.type}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-600">{selectedHall.description}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                    <a
                                                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-slate-600 hover:text-blue-700"
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHall.location)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {selectedHall.location}
                                                    </a>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        السعة: {selectedHall.capacity} شخص
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold text-blue-700">
                                                    {selectedHall.hourlyRate} ر.ي / ساعة
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                             </div>
                         )}

                         {!courseData.deliveryType && (
                             <div className="text-center text-gray-500 py-8 italic">
                                 يرجى اختيار طريقة التقديم للمتابعة
                             </div>
                         )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t mt-8">
                <Button variant="outline" onClick={() => setActiveTab("pricing")}>السابق</Button>
                
                <div className="flex gap-3">
                     <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogTrigger asChild>
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>تأكيد الحذف</DialogTitle>
                            <DialogDescription>
                            هل أنت متأكد من حذف هذه الدورة؟
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
                            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => handleSubmit('draft')}
                        disabled={isSubmitting}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        حفظ كمسودة
                    </Button>

                    <Button
                        type="button"
                        onClick={() => handleSubmit('submit')}
                        disabled={!isLocationValid() || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 w-40"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'جاري النشر...' : 'نشر الدورة'}
                    </Button>
                </div>
            </div>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}






















