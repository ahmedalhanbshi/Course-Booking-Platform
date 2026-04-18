"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, BookOpen, Calendar, Clock, Clock3, Loader2, MapPin, Plus, Sparkles, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Price } from "@/components/ui/price"
import { formatDate, formatTime } from "@/lib/utils"
import { trainerService, TrainerDashboardData } from "@/lib/trainer-service"
import { useAuth } from "@/contexts/auth-context"

export default function TrainerDashboard() {
  const [data, setData] = useState<TrainerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const trainerName = user?.name || ""

  useEffect(() => {
    trainerService
      .getDashboard()
      .then(setData)
      .catch(() => setError("فشل تحميل بيانات لوحة التحكم"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium">جاري تحميل لوحة التحكم...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/70 p-8 text-red-700">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-medium">{error || "حدث خطأ غير متوقع"}</p>
        <Button
          variant="outline"
          onClick={() => {
            setLoading(true)
            setError(null)
            trainerService
              .getDashboard()
              .then(setData)
              .catch(() => setError("فشل تحميل بيانات لوحة التحكم"))
              .finally(() => setLoading(false))
          }}
        >
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  const { stats, upcomingSessions, pendingRoomBookings } = data

  return (
    <section className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 text-right">
            <p className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              لوحة تحكم المدرب
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              مرحباً بك{trainerName ? `، أستاذ ${trainerName}` : ""} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              نظرة عامة على دوراتك، طلابك، وجدولك القادم.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2">
            <Button asChild className="rounded-full px-5">
              <Link href="/trainer/courses">
                إدارة الدورات
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-5">
              <Link href="/trainer/courses/create">
                <Plus className="ml-2 h-4 w-4" />
                إنشاء دورة
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">إجمالي الطلاب</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalStudents}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">الدورات المقدمة</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalCourses}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">إجمالي الأرباح</p>
            <Price 
              value={stats.totalEarnings} 
              variant="plain" 
              className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 block sm:inline-block mt-0.5" 
              currencyClassName="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {/* Upcoming Sessions List */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">الدروس القادمة</h2>
            <Button variant="ghost" size="sm" asChild className="rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              <Link href="/trainer/schedule" className="inline-flex items-center gap-1">
                عرض الجدول
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {upcomingSessions.length === 0 ? (
              <Card className="rounded-2xl border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                <CardContent className="py-12 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-500">لا توجد دروس مجدولة قريباً</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(
                upcomingSessions.reduce((acc, session) => {
                  const dateKey = new Date(session.startTime).setHours(0, 0, 0, 0);
                  if (!acc[dateKey]) acc[dateKey] = [];
                  acc[dateKey].push(session);
                  return acc;
                }, {} as Record<number, typeof upcomingSessions>)
              )
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([dateKey, sessionsGroup]) => (
                <div key={dateKey}>
                  <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {formatDate(Number(dateKey))}
                  </h3>
                  <div className="space-y-2.5">
                    {sessionsGroup.map((session) => {
                      const now = new Date()
                      const isNow = new Date(session.startTime).getTime() <= now.getTime() && new Date(session.endTime).getTime() >= now.getTime()
                      const canJoin = isNow && Boolean(session.meetingLink) && (session.type === "online" || session.type === "hybrid")

                      return (
                        <Card key={session.id} className="border-slate-200 dark:border-slate-800">
                          <CardContent className="p-3 md:p-4">
                            <div className="grid gap-3 md:grid-cols-[170px_1fr_auto] md:items-center">
                              <div className="text-right md:text-right">
                                <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  <Clock3 className="h-4 w-4 text-slate-400" />
                                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                </p>
                              </div>

                              <div className="min-w-0">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {session.title || "جلسة تدريبية"}
                                  </h3>
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    قادم
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                  {session.courseTitle}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  {session.type === "online" || session.type === "hybrid" ? (
                                    <span className="inline-flex items-center gap-1">
                                      <Video className="h-3.5 w-3.5 text-blue-600" />
                                      Google Meet
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {session.room || "قاعة تدريبية"}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1 before:content-['•'] before:mr-2 before:-ml-1">
                                    {session.enrolledStudents} طالب مسجل
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-start md:justify-end gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                  >
                                    <Link href="/trainer/schedule">عرض التفاصيل</Link>
                                  </Button>
                                  
                                  {(session.type === "online" || session.type === "hybrid") && session.meetingLink && (
                                    <Button
                                      asChild
                                      size="sm"
                                      disabled={!canJoin}
                                      className={canJoin ? "bg-blue-600 text-white hover:bg-blue-700" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
                                      variant={canJoin ? "default" : "outline"}
                                    >
                                      <a href={session.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
                                        <Video className="h-4 w-4" />
                                        {canJoin ? "بدء الدرس" : "رابط الجلسة"}
                                      </a>
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Info Widget */}
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">الأنشطة الحالية</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">دروس قادمة</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.upcomingSessions}</p>
              </div>
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/trainer/schedule">الجدول</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pending Room Bookings */}
          {pendingRoomBookings.length > 0 && (
            <Card className="rounded-2xl border-amber-200 bg-amber-50/50 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
              <CardHeader className="pb-2 text-amber-800 dark:text-amber-400">
                <CardTitle className="inline-flex items-center gap-2 text-base font-bold">
                  <MapPin className="h-4 w-4" />
                  طلبات القاعات المعلقة ({pendingRoomBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 {pendingRoomBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="rounded-xl border border-amber-100 bg-white p-3 dark:border-amber-900/40 dark:bg-slate-900/60">
                      <h4 className="text-sm border-b border-amber-50 pb-2 mb-2 font-bold text-slate-900 dark:text-slate-100 dark:border-amber-900/30">
                        {booking.sessionTitle}
                      </h4>
                      <p className="line-clamp-1 mb-2 text-xs text-slate-500 dark:text-slate-400">{booking.courseTitle}</p>
                      
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(new Date(booking.requestedDate))}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {booking.requestedRoom}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" asChild className="w-full text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-full dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/40">
                    <Link href="/trainer/room-bookings">إدارة جميع الطلبات</Link>
                  </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </section>
  )
}
