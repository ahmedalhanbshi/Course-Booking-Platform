"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Bell, BookOpen, GraduationCap, Heart, Loader2, Sparkles, UserRound } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NotificationMessage } from "@/components/notifications/notification-message"
import { formatDate } from "@/lib/utils"
import { studentService, StudentDashboardData } from "@/lib/student-service"

const courseImagePlaceholder = "/images/course-abstract.svg"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

function resolveImage(src: string | null | undefined): string {
  if (!src) return courseImagePlaceholder
  if (src.startsWith("http")) return src
  const cleanSrc = src.replace(/\\/g, "/")
  const separator = cleanSrc.startsWith("/") ? "" : "/"
  return `${API_BASE}${separator}${cleanSrc}`
}

export default function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    studentService
      .getDashboard()
      .then((dashboardData) => {
        setData(dashboardData)
        setFavoriteIds(dashboardData.favoriteIds)
      })
      .catch(() => setError("فشل تحميل الصفحة الرئيسية"))
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = async (courseId: string) => {
    try {
      const result = await studentService.toggleWishlist(courseId)
      setFavoriteIds((prev) => (result.added ? [...prev, courseId] : prev.filter((id) => id !== courseId)))
      toast.success(result.added ? "تمت إضافة الدورة إلى قائمة الرغبات" : "تمت إزالة الدورة من قائمة الرغبات")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء تحديث قائمة الرغبات"
      toast.error(message)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium">جاري تحميل الصفحة الرئيسية...</span>
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
            studentService
              .getDashboard()
              .then((dashboardData) => {
                setData(dashboardData)
                setFavoriteIds(dashboardData.favoriteIds)
              })
              .catch(() => setError("فشل تحميل الصفحة الرئيسية"))
              .finally(() => setLoading(false))
          }}
        >
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  const { user, currentCourses, recentNotifications, stats } = data

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 text-right">
            <p className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              الصفحة الرئيسية
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">مرحبًا {user.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">هذه نظرة سريعة على دوراتك ونشاطك الحالي.</p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2">
            <Button asChild className="rounded-full px-5">
              <Link href="/student/courses">استعراض الدورات</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-5">
              <Link href="/student/my-courses">دوراتي</Link>
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">الدورات النشطة</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.activeCourses}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">الدورات المكتملة</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.completedCourses}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">قائمة الرغبات</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{favoriteIds.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">الدورات الحالية</h2>
            <Button variant="ghost" size="sm" asChild className="rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              <Link href="/student/my-courses" className="inline-flex items-center gap-1">
                عرض الكل
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {currentCourses.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">لا توجد دورات حالية</p>
              </CardContent>
            </Card>
          ) : (
            currentCourses.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-52 w-full overflow-hidden md:h-[230px] md:w-[280px] shrink-0">
                    <Image
                      src={resolveImage(course.image)}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 280px, 100vw"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(course.id)}
                      aria-label={favoriteIds.includes(course.id) ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات"}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow ring-1 ring-slate-200"
                    >
                      <Heart className={favoriteIds.includes(course.id) ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4 text-right md:p-5">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-fit rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {course.category}
                      </Badge>
                      <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                        {course.title}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{course.shortDescription}</p>
                    </div>

                    <div className="mt-4 inline-flex items-center justify-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <UserRound className="h-4 w-4 text-slate-400" />
                      <span>{course.trainer}</span>
                    </div>

                    <div className="mt-auto pt-5">
                      <Button asChild className="rounded-full px-5">
                        <Link href={`/student/courses/${course.id}`}>عرض الدورة</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">قائمة الرغبات</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">الدورات المحفوظة</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{favoriteIds.length}</p>
              </div>
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/student/wishlist">فتح القائمة</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="inline-flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <Bell className="h-4 w-4" />
                الإشعارات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentNotifications.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">لا توجد إشعارات حالياً</p>
              ) : (
                recentNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href="/student/notifications"
                    className="block rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-xs font-semibold text-slate-900 dark:text-slate-100">{notification.title}</p>
                        <NotificationMessage message={notification.message} />
                        <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">{formatDate(new Date(notification.time))}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}

              <Button variant="ghost" asChild className="mt-1 w-full rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <Link href="/student/notifications">عرض كل الإشعارات</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">متابعة الرحلة التعليمية</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">انتقل مباشرة إلى جدولك أو دوراتك.</p>
              </div>
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/student/schedule" className="inline-flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  الجدول
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
