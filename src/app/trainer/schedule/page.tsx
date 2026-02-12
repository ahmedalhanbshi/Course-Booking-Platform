"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, MapPin, Video, Plus, CheckCircle, Settings, AlertTriangle } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

// Mock sessions data for trainer
const mockSessions = [
    {
        id: "1",
        title: "المكونات في React (Components)",
        courseTitle: "تعلم React من الصفر",
        startTime: new Date("2025-01-20T10:00:00"),
        endTime: new Date("2025-01-20T12:00:00"),
        type: "online",
        link: "https://meet.google.com/abc-defg-hij",
        status: "upcoming"
    },
    {
        id: "2",
        title: "مبادئ التصميم الأساسية",
        courseTitle: "تصميم واجهات المستخدم",
        startTime: new Date("2025-01-20T14:00:00"),
        endTime: new Date("2025-01-20T16:00:00"),
        type: "in_person",
        location: "قاعة المحاضرات الأولى",
        status: "upcoming"
    },
    {
        id: "3",
        title: "إدارة الحالة (State Management)",
        courseTitle: "تعلم React من الصفر",
        startTime: new Date("2025-01-21T10:00:00"),
        endTime: new Date("2025-01-21T12:00:00"),
        type: "online",
        link: "https://meet.google.com/xyz-uvw-123",
        status: "upcoming"
    },
    {
        id: "4",
        title: "الألوان والخطوط",
        courseTitle: "تصميم واجهات المستخدم",
        startTime: new Date("2025-01-25T14:00:00"),
        endTime: new Date("2025-01-25T16:00:00"),
        type: "in_person",
        location: "قاعة المحاضرات الثانية",
        status: "upcoming"
    },
    {
        id: "5",
        title: "مقدمة في البرمجة",
        courseTitle: "أساسيات البرمجة",
        startTime: new Date("2025-01-18T09:00:00"),
        endTime: new Date("2025-01-18T11:00:00"),
        type: "in_person",
        location: "معمل الحاسوب 1",
        status: "completed"
    }
]

export default function TrainerSchedulePage() {
    const [selectedSession, setSelectedSession] = useState<typeof mockSessions[0] | null>(null)
    const [isManageModalOpen, setIsManageModalOpen] = useState(false)

    // Manage Modal State
    const [actionType, setActionType] = useState<'reschedule' | 'cancel'>('reschedule')
    const [newDate, setNewDate] = useState("")
    const [newStartTime, setNewStartTime] = useState("")
    const [newEndTime, setNewEndTime] = useState("")
    const [reason, setReason] = useState("")

    const handleOpenManageModal = (session: typeof mockSessions[0]) => {
        setSelectedSession(session)
        // Initialize fields with current session data
        const dateStr = session.startTime.toISOString().split('T')[0]
        const startTimeStr = session.startTime.toTimeString().slice(0, 5)
        const endTimeStr = session.endTime.toTimeString().slice(0, 5)
        
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
    const sessionsByDate = mockSessions.reduce((acc, session) => {
        const dateKey = session.startTime.toISOString().split('T')[0]
        if (!acc[dateKey]) {
            acc[dateKey] = []
        }
        acc[dateKey].push(session)
        return acc
    }, {} as Record<string, typeof mockSessions>)

    const sortedDates = Object.keys(sessionsByDate).sort()

    const sessionOrderById = mockSessions
        .slice()
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .reduce((acc, session, index) => {
            acc[session.id] = index + 1
            return acc
        }, {} as Record<string, number>)

    const getLessonLabel = (sessionId: string) => {
        const lessonNumber = sessionOrderById[sessionId]
        const ordinalLabels: Record<number, string> = {
            1: "الأول",
            2: "الثاني",
            3: "الثالث",
            4: "الرابع",
            5: "الخامس",
            6: "السادس",
            7: "السابع",
            8: "الثامن",
            9: "التاسع",
            10: "العاشر",
        }

        if (!lessonNumber) return "درس"
        const ordinal = ordinalLabels[lessonNumber]
        return ordinal ? `الدرس ${ordinal}` : `الدرس ${lessonNumber}`
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'upcoming':
                return { label: 'قادم', className: 'bg-blue-100 text-blue-700' }
            case 'completed':
                return { label: 'مكتمل', className: 'bg-gray-100 text-gray-700' }
            default:
                return { label: status, className: 'bg-gray-100 text-gray-700' }
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">جدولي</h1>
                    <p className="text-gray-600">إدارة ومتابعة مواعيد دروسك القادمة</p>
                </div>
            </div>

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
                                                <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center border ${session.status === 'completed' ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                                    <span className="text-sm font-bold">{formatTime(session.startTime)}</span>
                                                    <span className={`text-xs ${session.status === 'completed' ? 'text-gray-400' : 'text-blue-400'}`}>إلى</span>
                                                    <span className="text-sm font-bold">{formatTime(session.endTime)}</span>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-lg font-bold text-gray-900">{getLessonLabel(session.id)}</h4>
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
                                                            <span>
                                                                {session.type === 'online' ? 'أونلاين' : session.location}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>ساعتان</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                {session.status !== 'completed' && (
                                                    <>
                                                        {session.type === 'online' ? (
                                                            <Button asChild className="w-full">
                                                                <a href={session.link} target="_blank" rel="noopener noreferrer">
                                                                    بدء الدرس
                                                                </a>
                                                            </Button>
                                                        ) : (
                                                             <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-md justify-center border text-sm mb-1">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>{session.location}</span>
                                                             </div>
                                                        )}
                                                        
                                                        {/* Manage Session Button */}
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
                                                     <div className="flex items-center gap-2 text-gray-500 justify-center">
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                        <span className="text-sm">تم الانتهاء</span>
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

            {/* Manage Session Modal */}
            <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>تعديل موعد الجلسة</DialogTitle>
                        <DialogDescription>
                            {selectedSession ? `${getLessonLabel(selectedSession.id)} - ${selectedSession.courseTitle}` : ""}
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
                            <p className="text-xs text-muted-foreground">سيظهر هذا النص في الإشعار المرسل للطلاب.</p>
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
