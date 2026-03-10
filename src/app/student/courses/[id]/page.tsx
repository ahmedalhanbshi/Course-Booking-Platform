"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Cairo } from "next/font/google"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { studentService } from "@/lib/student-service"
import { formatDate, formatTime, getFileUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
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
  Lock,
  MapPin
} from "lucide-react"

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
})

export default function StudentCourseDashboard() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()
  const searchParams = useSearchParams()

  const [courseData, setCourseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true)
        const data = await studentService.getCourseDetails(courseId)
        setCourseData(data)
      } catch (err: any) {
        console.error("Error fetching course details:", err)
        setError(err.message || "حدث خطأ أثناء جلب بيانات الدورة")
        toast.error("خطأ في جلب بيانات الدورة")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId])

  if (loading) {
    return (
      <div className={`${cairo.className} min-h-screen bg-slate-50 pb-20`} dir="rtl" lang="ar">
        <div className="bg-blue-950 p-12">
          <Skeleton className="h-10 w-1/3 mb-4 bg-white/20" />
          <Skeleton className="h-6 w-1/2 bg-white/10" />
        </div>
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className={`${cairo.className} min-h-screen flex items-center justify-center`} dir="rtl">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">{error || "لم يتم العثور على الدورة"}</h2>
          <Button asChild>
            <Link href="/student/my-courses">العودة إلى دوراتي</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // Simplified enrollment check based on what we fetched
  // If the API returned it, the user is authorized.
  // We can further check the enrollment status if we want to redirect to the public page.
  const isEnrolled = !!courseData
  const isCompleted = courseData.enrollmentStatus === 'COMPLETED' || searchParams.get('status') === 'completed'
  const isCancelled = courseData.enrollmentStatus === 'CANCELLED' || searchParams.get('status') === 'cancelled'

  const safeText = (value: string | undefined | null, fallback: string) => {
    if (typeof value !== "string") return fallback
    const trimmed = value.trim()
    return trimmed.length ? trimmed : fallback
  }

  const courseTitle = safeText(courseData.title, "عنوان الدورة")
  const courseDescription = safeText(courseData.description, "لا يوجد وصف للدورة حالياً.")
  const courseShortDescription = safeText(courseData.shortDescription, courseDescription)
  const courseDeliveryType = safeText(courseData.deliveryType, "أونلاين")
  const coursePlatform = safeText(courseData.onlinePlatform, "Zoom")
  const courseImage = getFileUrl(courseData.image) || "/images/course-abstract.svg"

  const instructor = courseData.instructor || {}
  const instructorName = safeText(instructor.name, "مدرب الدورة")
  const instructorRole = safeText(instructor.role, "")
  const instructorAvatar = getFileUrl(instructor.avatar) || "/images/avatar-1.png"

  const sessions = courseData.sessions || []
  const sessionDates = sessions.map((s: any) => s.startTime ? formatDate(s.startTime) : "").filter(Boolean)

  const dateRangeLabel = (() => {
    if (sessions.length === 0 || !sessions[0].startTime) return "غير محدد"
    const start = formatDate(sessions[0].startTime)
    const end = formatDate(sessions[sessions.length - 1].startTime)
    return start === end ? start : `${start} - ${end}`
  })()

  const DEFAULT_SESSION_MINUTES = 60
  const lessonOrderLabels = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"]

  // ... (rest of helper functions same)
  const getSessionTimeLabel = (session: any) => {
    if (session.startTime && session.endTime) {
      return `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`
    }
    return session.startTime ? formatTime(session.startTime) : "غير محدد"
  }

  const firstSessionTimeLabel = sessions.length > 0 ? getSessionTimeLabel(sessions[0]) : "غير محدد"
  const totalSessions = sessions.length

  const getSessionDurationMinutes = (session: any) => {
    if (!session.startTime || !session.endTime) return DEFAULT_SESSION_MINUTES
    const start = new Date(session.startTime).getTime()
    const end = new Date(session.endTime).getTime()
    return Math.round((end - start) / (1000 * 60))
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} دقيقة`
    const hours = Math.floor(minutes / 60)
    const remainder = minutes % 60
    if (remainder === 0) {
      if (hours === 1) return "ساعة"
      if (hours === 2) return "ساعتين"
      return `${hours} ساعات`
    }
    return `${hours} ساعة و ${remainder} دقيقة`
  }

  const getLessonLabel = (index: number) => `الدرس ${lessonOrderLabels[index] || index + 1}`

  const nextUpcomingSessionData = courseData.nextSession
  const nextJoinLink = nextUpcomingSessionData?.meetingLink
  const nextLessonTitle = nextUpcomingSessionData?.topic || "الدرس القادم"

  // Find index of next session in the list
  const nextUpcomingIndex = sessions.findIndex((s: any) => s.id === nextUpcomingSessionData?.id)

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
              className="h-8 rounded-full px-4 text-xs transition-all duration-200 hover:shadow-md active:scale-[0.99]"
            >
              <Link href="/student/my-courses">العودة إلى دوراتي</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_240px] items-center">
            <div className="space-y-3 text-right">
              <h2 className="text-2xl md:text-3xl font-semibold leading-tight line-clamp-2">
                {courseTitle}
              </h2>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <span>بواسطة: {instructorName}</span>
                {instructorRole && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                    <span>{instructorRole}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-blue-100/70 leading-relaxed line-clamp-2 max-w-2xl">
                {courseShortDescription}
              </p>

              <div className="grid gap-x-6 gap-y-3 pt-4 text-sm text-blue-100 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>النوع: {courseDeliveryType}</span>
                </div>
                <div className="flex items-center gap-2">
                  {courseDeliveryType === "حضوري" ? (
                    <MapPin className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Video className="h-4 w-4 text-blue-400" />
                  )}
                  <span>{courseDeliveryType === "حضوري" ? "القاعة/المكان:" : "المنصة:"} {coursePlatform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>{dateRangeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span dir="ltr">{firstSessionTimeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-400" />
                  <span>عدد الدروس: {totalSessions}</span>
                </div>
              </div>
            </div>

            <div className="relative w-[240px] h-[240px] overflow-hidden rounded-2xl border border-white/15 bg-white/5 mx-auto lg:mx-0">
              <Image
                src={courseImage}
                alt={courseTitle}
                fill
                className="object-cover"
                sizes="240px"
                unoptimized={true}
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

            {/* Banners */}
            {isCompleted ? (
              <Card className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className="p-4 bg-white rounded-full shadow-sm text-amber-500 border border-amber-100">
                    <Award className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-amber-900 mb-2">مبروك! لقد أتممت الدورة بنجاح</h3>
                    <p className="text-amber-700">تم الانتهاء من الدورة بنجاح. نتمنى لك التوفيق في رحلتك التعليمية القادمة.</p>
                  </div>
                </CardContent>
              </Card>
            ) : isCancelled ? (
              <Card className="rounded-2xl border border-red-100 bg-red-50 shadow-sm">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className="p-4 bg-white rounded-full shadow-sm text-red-500 border border-red-100">
                    <Ban className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-red-900 mb-2">عذراً، تم إلغاء اشتراكك في هذه الدورة</h3>
                    <p className="text-red-700">لم يعد بإمكانك الوصول لمحتوى الدورة. يرجى تجديد الاشتراك للمتابعة.</p>
                  </div>
                </CardContent>
              </Card>
            ) : nextUpcomingSessionData ? (
              <Card className="rounded-2xl border border-blue-100 bg-blue-50 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2 text-right">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {nextLessonTitle}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                      <span dir="rtl">{formatDate(nextUpcomingSessionData.startTime)}</span>
                      <span dir="rtl">{formatTime(nextUpcomingSessionData.startTime)}</span>
                    </div>
                  </div>

                  {nextJoinLink && (
                    <Button
                      className="h-9 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold gap-2 px-5 shadow-sm text-sm border-2 border-transparent hover:border-blue-100 transition-all font-cairo"
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
            ) : null}

            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-auto p-1 bg-slate-100/80 rounded-full gap-1">
                <TabsTrigger
                  value="schedule"
                  className="rounded-full py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  الجدول الدراسي
                </TabsTrigger>
                <TabsTrigger
                  value="announcements"
                  className="rounded-full py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  الإعلانات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="mt-6 relative">
                {isCancelled && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200">
                    <Lock className="w-12 h-12 text-slate-400 mb-2" />
                    <h3 className="font-bold text-lg text-slate-900">الجدول مقفل</h3>
                    <p className="text-slate-500 text-sm">يجب إعادة الاشتراك</p>
                  </div>
                )}
                <div className={isCancelled ? "opacity-40 pointer-events-none blur-sm" : ""}>
                  <Card className="rounded-2xl border border-slate-100 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg">جدول الدروس</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sessions.map((session: any, index: number) => {
                        const durationMinutes = getSessionDurationMinutes(session)
                        const sessionTimeLabel = getSessionTimeLabel(session)

                        // Status logic
                        let sessionState = "upcoming"
                        const nowMs = Date.now()
                        const startMs = new Date(session.startTime).getTime()
                        const endMs = new Date(session.endTime).getTime()

                        if (isCompleted || endMs < nowMs) {
                          sessionState = "completed"
                        } else if (nowMs >= startMs && nowMs <= endMs) {
                          sessionState = "current"
                        }

                        const isSessionCompleted = sessionState === "completed"
                        const canJoin = sessionState === "current" && !!session.meetingLink
                        const actionLabel = isSessionCompleted ? "انتهى الدرس" : canJoin ? "انضمام" : "قادم"

                        return (
                          <div
                            key={session.id}
                            className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-all ${isSessionCompleted ? "bg-slate-50 opacity-75" : "bg-white hover:border-blue-200"
                              }`}
                          >
                            <div className="flex-1 space-y-2 text-right">
                              <h4 className={`font-bold ${isSessionCompleted ? "text-slate-500" : "text-slate-900"}`}>
                                {session.topic || getLessonLabel(index)}
                              </h4>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                <span className="flex items-center gap-1.5 text-slate-600">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(session.startTime)}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-600" dir="ltr">
                                  <Clock className="w-3.5 h-3.5" />
                                  {sessionTimeLabel}
                                </span>
                                <span className="text-slate-500">
                                  المدة: {formatDuration(durationMinutes)}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              disabled={!canJoin}
                              className={`rounded-full px-6 text-xs font-bold ${canJoin ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-100 text-slate-400"
                                }`}
                              asChild={canJoin}
                            >
                              {canJoin ? (
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <PlayCircle className="w-4 h-4 ml-1.5" />
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

              <TabsContent value="announcements" className="mt-6 space-y-4">
                {courseData.announcements?.length > 0 ? (
                  courseData.announcements.map((announcement: any) => (
                    <Card key={announcement.id} className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <CardHeader className="bg-slate-50/50 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold flex items-center gap-2 text-slate-900">
                            <AlertCircle className="w-4 h-4 text-primary" />
                            {announcement.title}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium" dir="rtl">
                            {formatDate(announcement.createdAt)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-500">لا توجد إعلانات حالياً</div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Left Column (Sidebar) */}
          <div className="space-y-6">
            <Card className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">عن المدرب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 relative rounded-full overflow-hidden border-2 border-slate-100">
                    <Image
                      src={instructorAvatar}
                      alt={instructorName}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{instructorName}</p>
                    <p className="text-xs text-slate-500">{instructorRole}</p>
                  </div>
                </div>

                <Separator className="my-4 opacity-50" />

                <div className="space-y-3">
                  {instructor.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-medium" dir="ltr">{instructor.phone}</span>
                    </div>
                  )}
                  {instructor.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">{instructor.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
