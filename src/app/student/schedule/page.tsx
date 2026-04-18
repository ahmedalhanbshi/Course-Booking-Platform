"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, Video } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UnifiedFilter } from "@/components/ui/unified-filter"
import { toast } from "sonner"
import { studentService } from "@/lib/student-service"
import { formatDate, formatTime } from "@/lib/utils"

type Session = {
  id: string
  topic: string
  courseId: string | null
  courseTitle: string
  startTime: string
  endTime: string
  type: "online" | "in_person" | "hybrid"
  status: "scheduled" | "completed" | "cancelled" | "postponed"
  meetingLink: string | null
  location: string
}

type ViewMode = "upcoming" | "all"

function dateKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatDayHeader(key: string): string {
  return formatDate(`${key}T00:00:00`)
}

function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} - ${formatTime(endIso)}`
}

export default function StudentSchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => new Date())
  const [view, setView] = useState<ViewMode>("upcoming")
  const [selectedCourseId, setSelectedCourseId] = useState("all")

  useEffect(() => {
    let active = true
    studentService
      .getSchedule()
      .then((data: Session[]) => {
        if (active) setSessions(data)
      })
      .catch(() => toast.error("حدث خطأ أثناء جلب الجدول"))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(timer)
  }, [])

  const courses = useMemo(() => {
    return Array.from(new Map(sessions.map((s) => [s.courseId, s.courseTitle])).entries()).filter(([id]) => id !== null) as Array<[string, string]>
  }, [sessions])

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const courseMatch = selectedCourseId === "all" || s.courseId === selectedCourseId
      const isUpcoming = new Date(s.endTime).getTime() > now.getTime()
      return courseMatch && (view === "all" || isUpcoming)
    })
  }, [sessions, selectedCourseId, view, now])

  const grouped = useMemo(() => {
    const map: Record<string, Session[]> = {}
    for (const s of filtered) {
      const key = dateKey(s.startTime)
      if (!map[key]) map[key] = []
      map[key].push(s)
    }
    const keys = Object.keys(map).sort()
    for (const key of keys) {
      map[key].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    }
    return { map, keys }
  }, [filtered])

  const getEffectiveStatus = (s: Session): Session["status"] => {
    if (s.status === "cancelled") return "cancelled"
    if (new Date(s.endTime).getTime() < now.getTime()) return "completed"
    return s.status
  }

  const getStatusBadge = (status: Session["status"]) => {
    if (status === "scheduled") return { label: "قادمة", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" }
    if (status === "completed") return { label: "مكتملة", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" }
    if (status === "cancelled") return { label: "ملغية", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" }
    return { label: "مؤجلة", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" }
  }

  const isNowSession = (s: Session) => {
    const start = new Date(s.startTime).getTime()
    const end = new Date(s.endTime).getTime()
    const n = now.getTime()
    return n >= start && n <= end
  }

  if (loading) {
    return (
      <div className="flex min-h-[380px] items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="text-sm text-slate-500">جاري تحميل الجلسات...</span>
      </div>
    )
  }

  return (
    <section dir="rtl" className="mx-auto w-full max-w-5xl px-2 py-4 md:px-3">
      <UnifiedFilter
        resultsCount={filtered.length}
        resultsLabel="جلسة"
        selectFilters={[
          {
            id: "view",
            label: "الحالة",
            value: view,
            onChange: (v) => setView(v as ViewMode),
            options: [
              { value: "upcoming", label: "الجلسات القادمة" },
              { value: "all", label: "كل الجلسات" }
            ]
          },
          {
            id: "course",
            label: "الدورة",
            value: selectedCourseId,
            onChange: setSelectedCourseId,
            options: [
              { value: "all", label: "جميع الدورات" },
              ...courses.map(([id, title]) => ({ value: id, label: title }))
            ]
          }
        ]}
      />

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <CalendarDays className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">لا توجد جلسات مطابقة للفلاتر الحالية.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {grouped.keys.map((dayKey) => (
            <section key={dayKey} className="space-y-2">
              <div className="border-b border-slate-200 pb-2 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{formatDayHeader(dayKey)}</h2>
              </div>

              <div className="space-y-2.5">
                {grouped.map[dayKey].map((session) => {
                  const status = getEffectiveStatus(session)
                  const statusBadge = getStatusBadge(status)
                  const isNow = isNowSession(session) && (status === "scheduled" || status === "postponed")
                  const canJoin = isNow && Boolean(session.meetingLink) && (session.type === "online" || session.type === "hybrid")

                  return (
                    <Card key={session.id} className="border-slate-200 dark:border-slate-800">
                      <CardContent className="p-3 md:p-4">
                        <div className="grid gap-3 md:grid-cols-[170px_1fr_170px] md:items-center">
                          <div className="text-right md:text-right">
                            <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                              <Clock3 className="h-4 w-4 text-slate-400" />
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{session.topic || "جلسة تدريبية"}</h3>
                              <Badge variant="secondary" className={statusBadge.cls}>
                                {statusBadge.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">{session.courseTitle}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              {session.type === "online" || session.type === "hybrid" ? (
                                <span className="inline-flex items-center gap-1">
                                  <Video className="h-3.5 w-3.5 text-blue-600" />
                                  Google Meet
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {session.location}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-start md:justify-end">
                            {(session.type === "online" || session.type === "hybrid") && session.meetingLink ? (
                              <Button
                                asChild
                                size="sm"
                                disabled={!canJoin}
                                className={canJoin ? "bg-blue-600 text-white hover:bg-blue-700" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
                                variant={canJoin ? "default" : "outline"}
                              >
                                <a href={session.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
                                  <Video className="h-4 w-4" />
                                  {canJoin ? "انضم للدرس" : "رابط الجلسة"}
                                </a>
                              </Button>
                            ) : status === "completed" ? (
                              <div className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                تم الانتهاء
                              </div>
                            ) : status === "cancelled" ? (
                              <div className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                ملغية
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                                <AlertTriangle className="h-4 w-4" />
                                لا يوجد رابط الجلسة
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}
