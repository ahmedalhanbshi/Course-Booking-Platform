"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UnifiedFilter } from "@/components/ui/unified-filter"
import { CalendarDays, Clock3, CheckCircle2, Calendar as CalendarIcon, Clock, MapPin, Video, Plus, CheckCircle, Settings, AlertTriangle, Loader2, ChevronLeft, ChevronRight, Globe, Filter } from "lucide-react"
import { formatDate, formatTime, formatTimeRange } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { trainerService, Session } from "@/lib/trainer-service"

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00"
]
const WEEK_DAYS = ["أحد", "اثن", "ثلا", "أرب", "خم", "جم", "سبت"]

function formatDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TrainerSchedulePage() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [now, setNow] = useState(() => new Date())
    const [selectedCourseId, setSelectedCourseId] = useState<string>("all")
    const [view, setView] = useState<'all' | 'upcoming'>('upcoming')


    // ── Manage Modal ──────────────────────────────────────────────────────────
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const [isManageOpen, setIsManageOpen] = useState(false)
    const [actionType, setActionType] = useState<'reschedule' | 'cancel' | 'update_link'>('reschedule')
    const [reason, setReason] = useState("")
    const [updateAll, setUpdateAll] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // ── Calendar (hall reschedule) ─────────────────────────────────────────────
    const [calendarOffset, setCalendarOffset] = useState(0)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [isSlotsLoading, setIsSlotsLoading] = useState(false)

    // ── Online reschedule (no room) ────────────────────────────────────────────
    const [newDate, setNewDate] = useState("")
    const [newStartTime, setNewStartTime] = useState("")
    const [newEndTime, setNewEndTime] = useState("")

    // ── Data ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        trainerService.getSchedule()
            .then(data => setSessions(data))
            .catch(() => toast.error("حدث خطأ أثناء جلب الجدولة"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 10_000)
        return () => clearInterval(t)
    }, [])

    // ── Calendar logic ────────────────────────────────────────────────────────
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const monthDate = new Date(todayStart.getFullYear(), todayStart.getMonth() + calendarOffset, 1)
    const year = monthDate.getFullYear(); const month = monthDate.getMonth()
    const monthLabel = formatDate(monthDate, { month: "long", year: "numeric" })
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const calendarDays: Array<{ day: number; dateKey: string; isPast: boolean } | null> = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
        calendarDays.push({ day: d, dateKey, isPast: new Date(year, month, d) < todayStart })
    }
    while (calendarDays.length % 7 !== 0) calendarDays.push(null)

    const handleSelectDay = useCallback(async (dateKey: string) => {
        setSelectedDate(dateKey)
        setSelectedSlot(null)
        setAvailableSlots([])
        if (!selectedSession?.roomId) return
        setIsSlotsLoading(true)
        try {
            const data = await trainerService.getHallAvailability(selectedSession.roomId, dateKey)
            const [y, m, d] = dateKey.split("-").map(Number)
            const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][new Date(y, m - 1, d).getDay()]
            const allowedPeriods = data.availability?.filter((a: any) => a.day === dayName) || []
            const hasAvail = (data.availability?.length ?? 0) > 0
            const booked: any[] = data.bookedSessions || []

            const open = TIME_SLOTS.filter(slot => {
                const [s, e] = slot.split(" - ")
                if (hasAvail) {
                    const inHours = allowedPeriods.some((p: any) => s >= p.startTime.substring(0, 5) && e <= p.endTime.substring(0, 5))
                    if (!inHours) return false
                }
                const slotStart = new Date(`${dateKey}T${s}:00`)
                const slotEnd = new Date(`${dateKey}T${e}:00`)
                // Exclude the current session's own slot from conflict check
                return !booked.some((b: any) => {
                    if (b.id === selectedSession.id) return false
                    return slotStart < new Date(b.endTime) && slotEnd > new Date(b.startTime)
                })
            })
            setAvailableSlots(open)
        } catch {
            toast.error("فشل جلب أوقات القاعة")
        } finally {
            setIsSlotsLoading(false)
        }
    }, [selectedSession])

    // ── Open manage modal ─────────────────────────────────────────────────────
    const handleOpenManage = (session: Session) => {
        setSelectedSession(session)
        setActionType('reschedule')
        setReason("")
        setSelectedDate(null)
        setSelectedSlot(null)
        setAvailableSlots([])
        setCalendarOffset(0)
        setUpdateAll(false)
        const d = new Date(session.startTime)
        setNewDate(formatDateKey(d))
        setNewStartTime(d.toTimeString().slice(0, 5))
        setNewEndTime(new Date(session.endTime).toTimeString().slice(0, 5))
        setIsManageOpen(true)
    }

    // ── Confirm action ────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        if (!selectedSession) return
        if (!reason.trim()) { toast.error("يرجى كتابة سبب التغيير/الإلغاء"); return }

        if (actionType === 'reschedule') {
            if (selectedSession.roomId) {
                if (!selectedDate || !selectedSlot) { toast.error("يرجى اختيار يوم ووقت متاح"); return }
            } else {
                if (!newDate || !newStartTime || !newEndTime) { toast.error("يرجى تحديد التاريخ والوقت"); return }
            }
        }

        setIsSaving(true)
        try {
            if (actionType === 'cancel') {
                await trainerService.updateSession(selectedSession.id, { status: 'CANCELLED' })
                setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, status: 'cancelled' } : s))
                toast.error("تم إلغاء الجلسة")
            } else if (actionType === 'update_link') {
                await trainerService.updateSession(selectedSession.id, {
                    meetingLink: selectedSession.meetingLink ?? undefined,
                    updateAll: updateAll
                })
                if (updateAll) {
                    setSessions(prev => prev.map(s => s.courseTitle === selectedSession.courseTitle ? { ...s, meetingLink: selectedSession.meetingLink } : s))
                } else {
                    setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, meetingLink: selectedSession.meetingLink } : s))
                }
                toast.success("تم تحديث الرابط بنجاح")
            } else {
                let startTime: string, endTime: string
                if (selectedSession.roomId && selectedDate && selectedSlot) {
                    const [s, e] = selectedSlot.split(" - ")
                    startTime = new Date(`${selectedDate}T${s}:00`).toISOString()
                    endTime = new Date(`${selectedDate}T${e}:00`).toISOString()
                } else {
                    startTime = new Date(`${newDate}T${newStartTime}:00`).toISOString()
                    endTime = new Date(`${newDate}T${newEndTime}:00`).toISOString()
                }
                await trainerService.updateSession(selectedSession.id, {
                    startTime,
                    endTime,
                    meetingLink: selectedSession.meetingLink ?? undefined,
                    updateAll: updateAll
                })
                if (updateAll && (selectedSession.type === 'online' || selectedSession.type === 'hybrid')) {
                    setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, startTime, endTime, meetingLink: selectedSession.meetingLink } : (s.courseTitle === selectedSession.courseTitle ? { ...s, meetingLink: selectedSession.meetingLink } : s)))
                } else {
                    setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, startTime, endTime, meetingLink: selectedSession.meetingLink } : s))
                }
                toast.success("تم تغيير موعد الجلسة بنجاح")
            }
            setIsManageOpen(false)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err.message || "حدث خطأ")
        } finally {
            setIsSaving(false)
        }
    }

    // ── Unique course list for filter ─────────────────────────────────────────
    const courseOptions = Array.from(
        new Map(sessions.map(s => [s.courseId, s.courseTitle])).entries()
    ).filter(([id]) => id !== null) as [string, string][]

    // ── Filtered sessions ─────────────────────────────────────────────────────
    const filteredSessions = sessions.filter(s => {
        const matchesCourse = selectedCourseId === "all" || s.courseId === selectedCourseId
        const isUpcoming = new Date(s.endTime).getTime() > now.getTime()
        return matchesCourse && (view === 'all' || isUpcoming)
    })


    // ── Grouping ──────────────────────────────────────────────────────────────
    const toLocalDateKey = (iso: string) => formatDateKey(new Date(iso))
    const sessionsByDate = filteredSessions.reduce((acc, s) => {
        const k = toLocalDateKey(s.startTime)
        if (!acc[k]) acc[k] = []
        acc[k].push(s)
        return acc
    }, {} as Record<string, Session[]>)
    const sortedDates = Object.keys(sessionsByDate).sort()
    sortedDates.forEach(k => sessionsByDate[k].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()))

    const getEffectiveStatus = (s: Session) => {
        if (s.status === 'cancelled') return 'cancelled'
        if (new Date(s.endTime).getTime() < now.getTime()) return 'completed'
        return s.status
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'scheduled': return { label: 'قادم', className: 'bg-blue-100 text-blue-700' }
            case 'completed': return { label: 'مكتمل', className: 'bg-green-100 text-green-700' }
            case 'cancelled': return { label: 'ملغي', className: 'bg-red-100 text-red-700' }
            case 'postponed': return { label: 'مؤجل', className: 'bg-amber-100 text-amber-700' }
            default: return { label: status, className: 'bg-gray-100 text-gray-700' }
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
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
                resultsCount={filteredSessions.length}
                resultsLabel="جلسة"
                selectFilters={[
                    {
                        id: "view",
                        label: "الحالة",
                        value: view,
                        onChange: (v) => setView(v as 'all' | 'upcoming'),
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
                            ...courseOptions.map(([id, title]) => ({ value: id, label: title }))
                        ]
                    }
                ]}
            />

            {filteredSessions.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <CalendarDays className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        <p className="text-sm text-slate-500">لا توجد جلسات مطابقة للفلاتر الحالية.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-5">
                    {sortedDates.map((dayKey) => (
                        <section key={dayKey} className="space-y-2">
                            <div className="border-b border-slate-200 pb-2 dark:border-slate-800">
                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {formatDate(new Date(dayKey + 'T00:00:00'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h2>
                            </div>

                            <div className="space-y-2.5">
                                {sessionsByDate[dayKey].map((session) => {
                                    const status = getEffectiveStatus(session)
                                    const statusBadge = getStatusConfig(status)
                                    const isNow = new Date(session.startTime).getTime() <= now.getTime() && new Date(session.endTime).getTime() >= now.getTime() && (status === "scheduled" || status === "postponed")
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
                                                            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{session.title || "جلسة تدريبية"}</h3>
                                                            <Badge variant="secondary" className={statusBadge.className}>
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
                                                            <span className="inline-flex items-center gap-1 before:content-['•'] before:mr-2 before:-ml-1">
                                                                {session.enrolledStudents} طالب مسجل
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-start md:justify-end gap-2 shrink-0">
                                                        {(status === 'scheduled' || status === 'postponed') && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                                                onClick={() => handleOpenManage(session)}
                                                            >
                                                                <Settings className="w-4 h-4 ml-1.5" />
                                                                إدارة
                                                            </Button>
                                                        )}
                                                        
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
                                                                    {canJoin ? "بدء الدرس" : "رابط الجلسة"}
                                                                </a>
                                                            </Button>
                                                        ) : status === "completed" ? (
                                                            <div className="inline-flex items-center gap-1 text-xs font-medium text-green-600 px-2 py-1.5">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                تم الانتهاء
                                                            </div>
                                                        ) : status === "cancelled" ? (
                                                            <div className="inline-flex items-center gap-1 text-xs font-medium text-red-600 px-2 py-1.5">
                                                                <AlertTriangle className="h-4 w-4" />
                                                                ملغية
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1.5 rounded border border-slate-200">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                <span className="truncate max-w-[120px]">{session.location || "قاعة تدريبية"}</span>
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

            {/* ── Manage Session Dialog ── */}
            <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>تعديل موعد الجلسة</DialogTitle>
                        <DialogDescription>{selectedSession?.title} — {selectedSession?.courseTitle}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Action selector */}
                        <RadioGroup value={actionType} onValueChange={v => setActionType(v as any)} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <RadioGroupItem value="reschedule" id="r-reschedule" className="peer sr-only" />
                                <Label htmlFor="r-reschedule" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer h-full">
                                    <Clock className="mb-3 h-6 w-6" />تغيير الموعد
                                </Label>
                            </div>
                            {(selectedSession?.type === 'online' || selectedSession?.type === 'hybrid') && (
                                <div>
                                    <RadioGroupItem value="update_link" id="r-link" className="peer sr-only" />
                                    <Label htmlFor="r-link" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-blue-50 hover:text-blue-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer h-full text-center">
                                        <Globe className="mb-3 h-6 w-6" />تحديث الرابط
                                    </Label>
                                </div>
                            )}
                            <div>
                                <RadioGroupItem value="cancel" id="r-cancel" className="peer sr-only" />
                                <Label htmlFor="r-cancel" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-red-50 hover:text-red-900 peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:text-red-600 cursor-pointer h-full">
                                    <AlertTriangle className="mb-3 h-6 w-6" />إلغاء الجلسة
                                </Label>
                            </div>
                        </RadioGroup>

                        {actionType === 'update_link' && (
                            <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <div className="grid gap-2">
                                    <Label>رابط الاجتماع الجديد (Zoom, Google Meet, etc.)</Label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="https://..."
                                            value={selectedSession?.meetingLink || ""}
                                            onChange={e => setSelectedSession(s => s ? { ...s, meetingLink: e.target.value } : null)}
                                            className="bg-white pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <input type="checkbox" id="manage-update-all" checked={updateAll} onChange={e => setUpdateAll(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <Label htmlFor="manage-update-all" className="text-sm font-medium leading-none cursor-pointer">تطبيق على جميع جلسات هذه الدورة</Label>
                                </div>
                            </div>
                        )}

                        {/* Reschedule content */}
                        {actionType === 'reschedule' && (
                            selectedSession?.roomId ? (
                                /* Hall session → calendar + slot grid */
                                <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                    {/* Month nav */}
                                    <div className="flex items-center justify-between mb-2">
                                        <Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.max(0, p - 1))} disabled={calendarOffset === 0}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <span className="font-semibold text-sm">{monthLabel}</span>
                                        <Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.min(5, p + 1))}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {/* Day headers */}
                                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                                        {WEEK_DAYS.map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    {/* Day cells */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((d, i) => {
                                            if (!d) return <div key={i} />
                                            const isSel = selectedDate === d.dateKey
                                            return (
                                                <button
                                                    key={i} type="button"
                                                    disabled={d.isPast}
                                                    onClick={() => handleSelectDay(d.dateKey)}
                                                    className={`h-9 rounded-lg text-sm transition-all ${isSel ? 'bg-blue-600 text-white' : d.isPast ? 'bg-gray-100 text-gray-300' : 'bg-white border hover:bg-blue-50'}`}
                                                >{d.day}</button>
                                            )
                                        })}
                                    </div>

                                    {/* Available slots */}
                                    {selectedDate && (
                                        <div className="border-t pt-3">
                                            <h4 className="font-semibold text-sm mb-2">الأوقات المتاحة</h4>
                                            {isSlotsLoading ? (
                                                <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-blue-600" /></div>
                                            ) : availableSlots.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {availableSlots.map(slot => (
                                                        <button
                                                            key={slot} type="button"
                                                            onClick={() => setSelectedSlot(slot)}
                                                            className={`p-2 text-sm rounded border transition-colors ${selectedSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50 hover:border-blue-300'}`}
                                                        >{formatTimeRange(slot)}</button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 text-center py-4">لا يوجد أوقات متاحة في هذا اليوم</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Online session → simple date+time inputs */
                                <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                    <div className="grid gap-2">
                                        <Label>التاريخ الجديد</Label>
                                        <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="bg-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>وقت البدء</Label>
                                            <Input type="time" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} className="bg-white" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>وقت النهاية</Label>
                                            <Input type="time" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} className="bg-white" />
                                        </div>
                                    </div>
                                    {(selectedSession?.type === 'online' || selectedSession?.type === 'hybrid') && (
                                        <div className="grid gap-4 mt-2 border-t pt-4">
                                            <div className="grid gap-2">
                                                <Label>رابط الاجتماع (Zoom, Google Meet, etc.)</Label>
                                                <div className="relative">
                                                    <Video className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        placeholder="https://..."
                                                        value={selectedSession.meetingLink || ""}
                                                        onChange={e => setSelectedSession({ ...selectedSession, meetingLink: e.target.value })}
                                                        className="bg-white pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <input type="checkbox" id="resched-update-all" checked={updateAll} onChange={e => setUpdateAll(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <Label htmlFor="resched-update-all" className="text-sm font-medium leading-none cursor-pointer">تطبيق الرابط على جميع جلسات الدورة</Label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        )}

                        {/* Cancel warning */}
                        {actionType === 'cancel' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-red-900 text-sm">تحذير هام</h4>
                                    <p className="text-red-700 text-sm mt-1">هل أنت متأكد؟ سيتم إشعار جميع الطلاب المشتركين بإلغاء هذا الدرس. هذا الإجراء لا يمكن التراجع عنه.</p>
                                </div>
                            </div>
                        )}

                        {/* Reason */}
                        <div className="grid gap-2">
                            <Label>سبب التغيير/الإلغاء (إجباري)</Label>
                            <Textarea
                                placeholder="مثلاً: ظروف صحية طارئة، تأجيل بطلب من الطلاب..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">سيظهر هذا النص في الإشعار المرسل للطلاب.</p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsManageOpen(false)}>إغلاق</Button>
                        <Button
                            className={actionType === 'reschedule' ? "bg-blue-600 hover:bg-blue-700" : (actionType === 'update_link' ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700")}
                            onClick={handleConfirm}
                            disabled={isSaving}
                        >
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                            {actionType === 'reschedule' ? "تأكيد تغيير الموعد" : (actionType === 'update_link' ? "تأكيد تحديث الرابط" : "تأكيد إلغاء الجلسة")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
