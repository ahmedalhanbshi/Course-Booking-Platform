"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, MapPin, Video, Plus, CheckCircle, Settings, AlertTriangle, Loader2 } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { trainerService, Session } from "@/lib/trainer-service"

export default function TrainerSchedulePage() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const [isManageModalOpen, setIsManageModalOpen] = useState(false)

    // Manage Modal State
    const [actionType, setActionType] = useState<'reschedule' | 'cancel'>('reschedule')
    const [newDate, setNewDate] = useState("")
    const [newStartTime, setNewStartTime] = useState("")
    const [newEndTime, setNewEndTime] = useState("")
    const [reason, setReason] = useState("")

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await trainerService.getSchedule()
                const now = new Date();
                const processed = data.map(session => {
                    const isPast = new Date(session.endTime) < now;
                    if (isPast && session.status !== 'cancelled') {
                        return { ...session, status: 'completed' as Session['status'] }
                    }
                    return session;
                });
                setSessions(processed)
            } catch (err: any) {
                console.error("Failed to fetch sessions:", err)
                toast.error("حدث خطأ أثناء جلب الجدولة")
            } finally {
                setLoading(false)
            }
        }
        fetchSessions()
    }, [])

    const handleOpenManageModal = (session: Session) => {
        setSelectedSession(session)
        // Initialize fields with current session data
        const startTimeObj = new Date(session.startTime)
        const endTimeObj = new Date(session.endTime)

        const dateStr = session.startTime.split('T')[0]
        const startTimeStr = startTimeObj.toTimeString().slice(0, 5)
        const endTimeStr = endTimeObj.toTimeString().slice(0, 5)

        setNewDate(dateStr)
        setNewStartTime(startTimeStr)
        setNewEndTime(endTimeStr)
        setActionType('reschedule')
        setReason("")

        setIsManageModalOpen(true)
    }

    const handleConfirmAction = () => {
        if (!reason.trim()) {
            toast.error("يرجى كتابة سبب التغيير/الإلغاء")
            return
        }

        if (actionType === 'reschedule') {
            toast.success("تم تغيير موعد الجلسة وإشعار الطلاب")
        } else {
            toast.error("تم إلغاء الجلسة وإشعار الطلاب")
        }
        setIsManageModalOpen(false)
    }

    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
        const dateKey = session.startTime.split('T')[0]
        if (!acc[dateKey]) {
            acc[dateKey] = []
        }
        acc[dateKey].push(session)
        return acc
    }, {} as Record<string, Session[]>)

    const sortedDates = Object.keys(sessionsByDate).sort()

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return { label: 'قادم', className: 'bg-blue-100 text-blue-700' }
            case 'completed':
                return { label: 'مكتمل', className: 'bg-green-100 text-green-700' }
            case 'cancelled':
                return { label: 'ملغي', className: 'bg-red-100 text-red-700' }
            case 'postponed':
                return { label: 'مؤجل', className: 'bg-amber-100 text-amber-700' }
            default:
                return { label: status, className: 'bg-gray-100 text-gray-700' }
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-500">جاري جلب جدولك...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">جدولي</h1>
                    <p className="text-gray-600">إدارة ومتابعة مواعيد دروسك القادمة</p>
                </div>
            </div>

            {sessions.length === 0 ? (
                <Card className="bg-gray-50 border-dashed border-2">
                    <CardContent className="p-12 text-center">
                        <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد دروس مجدولة</h3>
                        <p className="text-gray-500">لم تقم بإضافة أي دروس بعد أو ليس لديك دروس قادمة.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {sortedDates.map((dateStr) => (
                        <div key={dateStr}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                {formatDate(new Date(dateStr), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>

                            <div className="grid gap-4">
                                {sessionsByDate[dateStr].map((session) => (
                                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex gap-4">
                                                    <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center border ${session.status === 'completed' ? 'bg-green-50 border-green-100 text-green-600' : session.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                                        <span className="text-sm font-bold">{formatTime(new Date(session.startTime))}</span>
                                                        <span className="text-xs opacity-60">إلى</span>
                                                        <span className="text-sm font-bold">{formatTime(new Date(session.endTime))}</span>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-lg font-bold text-gray-900">{session.title}</h4>
                                                            <Badge variant="secondary" className={getStatusConfig(session.status).className}>
                                                                {getStatusConfig(session.status).label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{session.courseTitle}</p>

                                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                {session.type === 'online' ? (
                                                                    <Video className="h-4 w-4" />
                                                                ) : (
                                                                    <MapPin className="h-4 w-4" />
                                                                )}
                                                                <span className="truncate max-w-[200px]">
                                                                    {session.location}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{session.enrolledStudents} طالب مسجل</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 min-w-[140px]">
                                                    {['scheduled', 'postponed'].includes(session.status) && (
                                                        <>
                                                            {session.type === 'online' && session.meetingLink ? (
                                                                <Button asChild className="w-full">
                                                                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                                                        بدء الدرس
                                                                    </a>
                                                                </Button>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-md justify-center border text-sm mb-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span className="truncate max-w-[120px]">{session.location}</span>
                                                                </div>
                                                            )}

                                                            <Button
                                                                variant="outline"
                                                                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                                                                onClick={() => handleOpenManageModal(session)}
                                                            >
                                                                <Settings className="w-4 h-4 ml-2" />
                                                                إدارة الجلسة
                                                            </Button>
                                                        </>
                                                    )}

                                                    {session.status === 'completed' && (
                                                        <div className="flex items-center gap-2 text-green-600 justify-center font-medium">
                                                            <CheckCircle className="h-5 w-5" />
                                                            <span className="text-sm">تم الانتهاء</span>
                                                        </div>
                                                    )}

                                                    {session.status === 'cancelled' && (
                                                        <div className="flex items-center gap-2 text-red-600 justify-center font-medium">
                                                            <AlertTriangle className="h-5 w-5" />
                                                            <span className="text-sm">ملغي</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Manage Session Modal */}
            <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>تعديل موعد الجلسة</DialogTitle>
                        <DialogDescription>
                            {selectedSession?.title} - {selectedSession?.courseTitle}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Action Type Selection */}
                        <RadioGroup
                            defaultValue="reschedule"
                            value={actionType}
                            onValueChange={(val) => setActionType(val as 'reschedule' | 'cancel')}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="reschedule" id="reschedule" className="peer sr-only" />
                                <Label
                                    htmlFor="reschedule"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer"
                                >
                                    <Clock className="mb-3 h-6 w-6" />
                                    تغيير الموعد
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="cancel" id="cancel" className="peer sr-only" />
                                <Label
                                    htmlFor="cancel"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-red-50 hover:text-red-900 peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:text-red-600 cursor-pointer"
                                >
                                    <AlertTriangle className="mb-3 h-6 w-6" />
                                    إلغاء الجلسة
                                </Label>
                            </div>
                        </RadioGroup>

                        {/* Dynamic Content based on Action */}
                        {actionType === 'reschedule' ? (
                            <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">التاريخ الجديد</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start-time">وقت البدء</Label>
                                        <Input
                                            id="start-time"
                                            type="time"
                                            value={newStartTime}
                                            onChange={(e) => setNewStartTime(e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end-time">وقت النهاية</Label>
                                        <Input
                                            id="end-time"
                                            type="time"
                                            value={newEndTime}
                                            onChange={(e) => setNewEndTime(e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-red-900 text-sm">تحذير هام</h4>
                                    <p className="text-red-700 text-sm mt-1">
                                        هل أنت متأكد؟ سيتم إشعار جميع الطلاب المشتركين بإلغاء هذا الدرس. هذا الإجراء لا يمكن التراجع عنه.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Reason Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="reason">سبب التغيير/الإلغاء (إجباري)</Label>
                            <Textarea
                                id="reason"
                                placeholder="مثلاً: ظروف صحية طارئة، تأجيل بطلب من الطلاب..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className={!reason && isManageModalOpen ? "border-red-200 focus-visible:ring-red-500" : ""}
                            />
                            <p className="text-xs text-muted-foreground">سيظهر هذا نص في الإشعار المرسل للطلاب.</p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>إلغاء</Button>
                        <Button
                            className={actionType === 'reschedule' ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
                            onClick={handleConfirmAction}
                        >
                            {actionType === 'reschedule' ? "تأكيد تغيير الموعد" : "تأكيد إلغاء الجلسة"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
