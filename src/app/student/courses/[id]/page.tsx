"use client"

import Link from "next/link"
import Image from "next/image"
import { Cairo } from "next/font/google"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  FileText,
  PlayCircle,
  Award,
  MessageSquare,
  Video,
  AlertCircle,
  Globe,
  Play,
  Ban,
  Lock
} from "lucide-react"

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
})

// Mock Data for the single course view
const mockCourseData = {
  id: "1",
  title: "تعلم React من الصفر",
  category: "تطوير الويب",
  shortDescription: "دورة مكثفة لتأسيسك في React من الصفر حتى بناء واجهات تفاعلية قابلة للتطوير.",
  description: "دورة شاملة في تعلم React.js مع مشاريع عملية. ستتعلم أساسيات React، إدارة الحالة، التوجيه، والعديد من المفاهيم المتقدمة.",
  image: "/images/course-web.png",
  deliveryType: "أونلاين",
  onlinePlatform: "Zoom",
  nextSession: {
    date: "2026-02-01",
    time: "11:00 PM"
  },
  instructor: {
    name: "أحمد محمد",
    role: "Senior Frontend Developer",
    avatar: "/images/avatar-1.png"
  },
  announcements: [
    {
      id: 1,
      title: "تغيير موعد المحاضرة القادمة",
      date: "2025-01-18",
      createdAt: "2025-01-18T18:30:00",
      content: "تم تأجيل محاضرة الغد إلى يوم الاثنين القادم لأسباب تقنية."
    },
    {
      id: 2,
      title: "مشروع منتصف الدورة",
      date: "2025-01-15",
      createdAt: "2025-01-15T09:00:00",
      content: "يرجى تسليم المشروع قبل نهاية الأسبوع الحالي."
    }
  ],
  sessions: [
    {
      id: "1",
      date: "2026-01-24",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      status: "completed"
    },
    {
      id: "2",
      date: "2026-01-28",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      status: "completed"
    },
    {
      id: "3",
      date: "2026-02-01",
      startTime: "11:00 PM",
      endTime: "01:00 AM",
      meetingLink: "https://zoom.us",
      status: "active"
    },
    {
      id: "4",
      date: "2026-02-06",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      meetingLink: "https://zoom.us",
      status: "active"
    }
  ]
}

export default function StudentCourseDashboard() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()

  // SIMULATED ENROLLMENT CHECK
  // In a real application, you would check the user's enrollment status from the backend/context.
  // SIMULATED STATES
  // In a real application, you would check the user's enrollment status from the backend/context.
  const isEnrolled = true // Set to false to test redirect
  const searchParams = useSearchParams()
 
  // Check if "completed" is passed in query, OR use a mock toggle if needed. 
  // For now, let's default to FALSE unless ?status=completed is present.
  const isCompleted = searchParams.get('status') === 'completed'
  const isCancelled = searchParams.get('status') === 'cancelled'

  const safeText = (value: string | undefined | null, fallback: string) => {
    if (typeof value !== "string") return fallback
    const trimmed = value.trim()
    return trimmed.length ? trimmed : fallback
  }

  const extractTimeLabel = (value?: string | null) => {
    if (!value || typeof value !== "string") return ""
    const timeMatch = value.match(/\b\d{1,2}:\d{2}\s?(?:AM|PM)?\b/i)
    if (timeMatch) return timeMatch[0]
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ""
    return parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const courseTitle = safeText(mockCourseData.title, "عنوان الدورة")
  const courseDescription = safeText(mockCourseData.description, "لا يوجد وصف للدورة حالياً.")
  const courseShortDescription = safeText(mockCourseData.shortDescription, courseDescription)
  const courseDeliveryType = safeText(mockCourseData.deliveryType, "أونلاين")
  const coursePlatform = safeText(mockCourseData.onlinePlatform, "Zoom")
  const courseImage = mockCourseData.image || "/images/course-abstract.svg"
  const instructorName = safeText(mockCourseData.instructor?.name, "مدرب الدورة")
  const instructorRole = safeText(mockCourseData.instructor?.role, "")
  const instructorAvatar = mockCourseData.instructor?.avatar || "/images/avatar-1.png"
  const nextSessionDate = safeText(mockCourseData.nextSession?.date, "غير محدد")
  const nextSessionTime = safeText(mockCourseData.nextSession?.time, "غير محدد")

  const sessionDates = mockCourseData.sessions.map((session) => session.date).filter(Boolean)
  const sortedSessionDates = [...sessionDates].sort()
  const dateRangeLabel = sortedSessionDates.length
    ? sortedSessionDates[0] === sortedSessionDates[sortedSessionDates.length - 1]
      ? sortedSessionDates[0]
      : `${sortedSessionDates[0]} - ${sortedSessionDates[sortedSessionDates.length - 1]}`
    : "غير محدد"
  const DEFAULT_SESSION_MINUTES = 60
  const lessonOrderLabels = [
    "الأول",
    "الثاني",
    "الثالث",
    "الرابع",
    "الخامس",
    "السادس",
    "السابع",
    "الثامن",
    "التاسع",
    "العاشر"
  ]

  const parseTimeToMinutes = (value: string) => {
    const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i)
    if (!match) return null
    let hours = Number(match[1])
    const minutes = Number(match[2] ?? "0")
    const meridiem = match[3]?.toUpperCase()

    if (meridiem === "PM" && hours < 12) hours += 12
    if (meridiem === "AM" && hours === 12) hours = 0

    return hours * 60 + minutes
  }

  const getSessionTimeLabel = (session: (typeof mockCourseData.sessions)[number]) => {
    if (session.startTime && session.endTime) {
      return `${session.startTime} - ${session.endTime}`
    }
    return session.startTime || session.endTime || "غير محدد"
  }

  const firstSessionTimeLabel = mockCourseData.sessions.length
    ? getSessionTimeLabel(mockCourseData.sessions[0])
    : "غير محدد"
  const totalSessions = mockCourseData.sessions.length

  const getSessionDurationMinutes = (session: (typeof mockCourseData.sessions)[number]) => {
    const start = session.startTime ? parseTimeToMinutes(session.startTime) : null
    const end = session.endTime ? parseTimeToMinutes(session.endTime) : null

    if (start !== null && end !== null) {
      if (end > start) {
        return end - start
      }
      if (end < start) {
        return 24 * 60 - start + end
      }
    }

    return DEFAULT_SESSION_MINUTES
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} دقيقة`
    if (minutes % 60 === 0) {
      const hours = minutes / 60
      if (hours === 1) return "ساعة"
      if (hours === 2) return "ساعتين"
      return `${hours} ساعات`
    }

    const hours = Math.floor(minutes / 60)
    const remainder = minutes % 60
    return `${hours} ساعة و ${remainder} دقيقة`
  }

  const formatDurationShort = (minutes: number) => {
    if (minutes < 60) return "أقل من ساعة"
    const hours = Math.round(minutes / 60)
    if (hours <= 1) return "ساعة"
    if (hours === 2) return "ساعتان"
    return `${hours} ساعات`
  }

  const getLessonLabel = (index: number) =>
    `الدرس ${lessonOrderLabels[index] || index + 1}`

  const getSessionDateTime = (dateValue: string, timeValue?: string) => {
    if (!dateValue || !timeValue) return null
    const baseDate = new Date(`${dateValue}T00:00:00`)
    if (Number.isNaN(baseDate.getTime())) return null
    const minutes = parseTimeToMinutes(timeValue)
    if (minutes === null) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      mins,
      0,
      0
    )
  }

  const getSessionStartTimestamp = (session: (typeof mockCourseData.sessions)[number]) => {
    const startDateTime = getSessionDateTime(session.date, session.startTime)
    return startDateTime ? startDateTime.getTime() : null
  }

  const nowTimestamp = Date.now()
  const upcomingSessions = mockCourseData.sessions
    .map((session, index) => ({
      index,
      startTimeMs: getSessionStartTimestamp(session)
    }))
    .filter((item) => item.startTimeMs !== null && item.startTimeMs >= nowTimestamp)
    .sort(
      (a, b) =>
        (a.startTimeMs ?? 0) - (b.startTimeMs ?? 0) || a.index - b.index
    )

  const nextUpcomingSession = upcomingSessions[0]
  const nextUpcomingIndex = nextUpcomingSession?.index ?? -1
  const nextUpcomingTimeMs = nextUpcomingSession?.startTimeMs ?? null
  const nextUpcomingSessionData =
    nextUpcomingIndex >= 0 ? mockCourseData.sessions[nextUpcomingIndex] : null
  const nextJoinLink = nextUpcomingSessionData?.meetingLink
  const nextLessonLabel = nextUpcomingSessionData
    ? getLessonLabel(nextUpcomingIndex)
    : ""
  const nextLessonDuration = nextUpcomingSessionData
    ? formatDurationShort(getSessionDurationMinutes(nextUpcomingSessionData))
    : ""
  const nextLessonTitle = nextLessonLabel || "الدرس القادم"

  if (!isEnrolled) {
    router.push(`/courses/${courseId}`)
    return null
  }


  return (
    <div className={`${cairo.className} min-h-screen bg-slate-50 pb-20`} dir="rtl" lang="ar">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-l from-blue-950 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="h-8 rounded-full px-4 text-xs transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
            >
              <Link href="/student/my-courses">العودة إلى دوراتي</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_240px] items-center">
            <div className="space-y-3 text-right">
              <h2 className="text-2xl md:text-3xl font-semibold leading-tight line-clamp-2">
                {courseTitle}
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed line-clamp-2">
                {courseShortDescription}
              </p>

              <div className="grid gap-2 text-sm text-blue-100 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>المنوع: {courseDeliveryType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>الموقع: {coursePlatform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{dateRangeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span dir="ltr">{firstSessionTimeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>عدد الدروس: {totalSessions}</span>
                </div>
              </div>
            </div>

            <div className="relative w-[240px] h-[240px] overflow-hidden rounded-2xl border border-white/15 bg-white/5">
              <Image
                src={courseImage}
                alt={courseTitle}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-slate-50" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Right Column (Main) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next Session Alert */}
            {/* Next Session Alert OR Completion/Cancellation Banner */}
            {isCompleted ? (
                // Completion Banner
                <Card className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    <CardContent className="p-8 flex items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-full shadow-sm text-amber-500 border border-amber-100">
                                <Award className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-amber-900 mb-2">مبروك! لقد أتممت الدورة بنجاح</h3>
                                <p className="text-amber-700">تم الانتهاء من الدورة بنجاح. نتمنى لك التوفيق في رحلتك التعليمية القادمة.</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            ) : isCancelled ? (
                // Cancelled Banner
                <Card className="rounded-2xl border border-red-100 bg-red-50 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    <CardContent className="p-8 flex items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-full shadow-sm text-red-500 border border-red-100">
                                <Ban className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-red-900 mb-2">عذراً، تم إلغاء اشتراكك في هذه الدورة</h3>
                                <p className="text-red-700">لم يعد بإمكانك الوصول لمحتوى الدورة. يرجى تجديد الاشتراك للمتابعة.</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            ) : (
                // Upcoming Session Banner
                <Card className="rounded-2xl border border-blue-100 bg-blue-50 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2 text-right">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {nextLessonTitle}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <span dir="ltr">{nextSessionDate}</span>
                        <span dir="ltr">{nextSessionTime}</span>
                        {nextLessonDuration && <span>{nextLessonDuration}</span>}
                      </div>
                    </div>
                    
                    {nextJoinLink && (
                      <Button
                        className="h-9 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold gap-2 px-5 shadow-sm text-sm border-2 border-transparent hover:border-blue-100 transition-all"
                        asChild
                      >
                        <a href={nextJoinLink} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 fill-current" />
                          انضمام للدرس
                        </a>
                      </Button>
                    )}
                </CardContent>
                </Card>
            )}

            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-auto p-1 bg-slate-100/80 rounded-full gap-1">
                <TabsTrigger 
                  value="schedule" 
                  className="rounded-full py-2.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
                >
                  الجدول الدراسي
                </TabsTrigger>
                <TabsTrigger 
                  value="announcements" 
                  className="rounded-full py-2.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
                >
                  الإعلانات
                </TabsTrigger>
              </TabsList>


             <TabsContent value="schedule" className="mt-6 relative" id="schedule">
                  {isCancelled && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">الجدول مقفل</h3>
                        <p className="text-slate-500 text-sm">يجب إعادة الاشتراك</p>
                    </div>
                 )}
                 <div className={isCancelled ? "opacity-40 pointer-events-none select-none filter blur-sm transition-all" : ""}>
                  <Card className="rounded-2xl border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    <CardHeader>
                      <CardTitle className="text-slate-900">جدول الدروس</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockCourseData.sessions.map((session, index) => {
                        const durationMinutes = getSessionDurationMinutes(session)
                        const sessionTimeLabel = getSessionTimeLabel(session)
                        const sessionDate = safeText(session.date, "غير محدد")
                        const sessionStartMs = getSessionStartTimestamp(session)
                        const sessionState =
                          isCompleted
                            ? "completed"
                            : nextUpcomingIndex === -1
                              ? "completed"
                              : index === nextUpcomingIndex
                                ? "current"
                                : sessionStartMs !== null && nextUpcomingTimeMs !== null
                                  ? sessionStartMs < nextUpcomingTimeMs
                                    ? "completed"
                                    : "upcoming"
                                  : index < nextUpcomingIndex
                                    ? "completed"
                                    : "upcoming"

                        const isSessionCompleted = sessionState === "completed"
                        const canJoin = sessionState === "current" && Boolean(session.meetingLink)
                        const actionLabel = isSessionCompleted
                          ? "انتهى الدرس"
                          : canJoin
                            ? "انضمام"
                            : "قادم"
                        const labelTone = isSessionCompleted ? "text-slate-400" : "text-slate-500"
                        const lessonLabel = getLessonLabel(index)

                        return (
                          <div
                            key={session.id}
                            className={`flex items-center justify-between gap-4 rounded-lg border p-4 text-sm ${
                              isSessionCompleted
                                ? "border-slate-200 bg-slate-50 text-slate-400"
                                : "border-slate-200 bg-white text-slate-700"
                            }`}
                            dir="rtl"
                          >
                            <div className="flex-1 space-y-2 text-right">
                              <div className="flex items-center justify-between gap-3">
                                <h4
                                  className={`text-sm font-semibold ${
                                    isSessionCompleted ? "text-slate-500" : "text-slate-900"
                                  }`}
                                >
                                  {lessonLabel}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar
                                  className={`h-4 w-4 ${
                                    isSessionCompleted ? "text-slate-400" : "text-blue-600"
                                  }`}
                                />
                                <span>{sessionDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span dir="ltr">{sessionTimeLabel}</span>
                              </div>
                              <div>
                                <span className={labelTone}>المدة: </span>
                                <span className="font-medium">{formatDuration(durationMinutes)}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              disabled={!canJoin}
                              className={`h-8 w-[110px] shrink-0 rounded-full px-4 text-xs font-semibold gap-2 ${
                                canJoin
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-slate-200 text-slate-500 hover:bg-slate-200"
                              }`}
                              asChild={canJoin}
                            >
                              {canJoin ? (
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  {actionLabel}
                                </a>
                              ) : (
                                <span>{actionLabel}</span>
                              )}
                            </Button>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="announcements" className="mt-6 space-y-4 relative">
                 {isCancelled && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">الإعلانات مقفلة</h3>
                        <p className="text-slate-500 text-sm">يجب إعادة الاشتراك</p>
                    </div>
                 )}
                <div className={isCancelled ? "opacity-40 pointer-events-none select-none filter blur-sm transition-all text-right" : "text-right"}>
                {mockCourseData.announcements.map((announcement) => {
                  const announcementTitle = safeText(announcement.title, "إشعار")
                  const announcementContent = safeText(announcement.content, "لا توجد تفاصيل إضافية.")
                  const announcementDate = safeText(announcement.date, "—")
                  const announcementTime = extractTimeLabel(
                    announcement.publishedAt ?? announcement.createdAt
                  )
                  const announcementDateTime = announcementTime
                    ? `${announcementDate} • ${announcementTime}`
                    : announcementDate

                  return (
                    <div 
                      key={announcement.id}
                      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-all mb-4"
                      dir="rtl"
                    >
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold flex items-center gap-2 text-slate-900">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            {announcementTitle}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium" dir="ltr">
                            {announcementDateTime}
                          </span>
                        </div>

                      <p className="text-slate-600 leading-relaxed text-right">
                        {announcementContent}
                      </p>
                    </div>
                  )
                })}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Left Column (Sidebar) */}
          <div className="space-y-6">
            {/* Quick Actions */}


            {/* Instructor Card */}
            <Card className="rounded-2xl border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">عن المدرب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden border">
                    <Image 
                      src={instructorAvatar} 
                      alt={instructorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{instructorName}</p>
                    {instructorRole && (
                      <p className="text-xs text-slate-500">{instructorRole}</p>
                    )}
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                {/* Replaced Message Button with Contact Info */}
                <div className="space-y-3 text-sm">
                   <div className="flex items-center gap-3 text-slate-600">
                     <div className="p-1.5 bg-slate-100 rounded-md">
                        {/* Using MessageSquare icon as a general contact icon or similar */}
                        <MessageSquare className="w-4 h-4" />
                     </div>
                     <span className="font-medium" dir="ltr">+966 50 123 4567</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-600">
                     <div className="p-1.5 bg-slate-100 rounded-md">
                        <FileText className="w-4 h-4" /> {/* Fallback icon, usually Mail but using standard Lucide imports */}
                     </div>
                     <span className="font-medium">instructor@example.com</span>
                   </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
