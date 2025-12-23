"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Building, Users, MapPin, Wifi, Monitor, Coffee, Search, Calendar, Clock, X, CheckCircle, AlertCircle, Filter, Trash2, Plus, ArrowRight, CreditCard, Upload, Image as ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatTime } from "@/lib/utils"
// Define generic or minimal types to avoid import errors if strictly typed in a separate file I can't check
import { RoomBooking } from "@/types"
import { toast } from "sonner"

// --- Mock Data for Halls ---
const mockHalls = [
    {
        id: "1",
        name: "القاعة الرئيسية - A1",
        capacity: 50,
        type: "lecture",
        features: ["wifi", "projector", "whiteboard", "ac"],
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
        description: "قاعة واسعة مناسبة للمحاضرات الكبيرة والندوات. مجهزة بأحدث تقنيات العرض والصوت.",
        location: "الدور الأول - الجناح الشرقي"
    },
    {
        id: "2",
        name: "معمل الحاسب (1)",
        capacity: 25,
        type: "lab",
        features: ["wifi", "computers", "projector", "ac"],
        image: "https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?q=80&w=2070&auto=format&fit=crop",
        description: "معمل حاسب آلي مجهز بـ 25 جهاز كمبيوتر عالي المواصفات. مثالي لدورات البرمجة والتصميم.",
        location: "الدور الثاني - الجناح الغربي"
    },
    {
        id: "3",
        name: "قاعة الاجتماعات (ب)",
        capacity: 15,
        type: "meeting",
        features: ["wifi", "screen", "whiteboard", "ac", "coffee"],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        description: "قاعة اجتماعات مريحة ومجهزة لعقد ورش العمل الصغيرة والاجتماعات الإدارية.",
        location: "الدور الأرضي - قرب الإدارة"
    },
    {
        id: "4",
        name: "القاعة التدريبية (ج)",
        capacity: 30,
        type: "lecture",
        features: ["wifi", "projector", "whiteboard", "ac"],
        image: "https://images.unsplash.com/photo-1503428593586-e225b476b849?q=80&w=2070&auto=format&fit=crop",
        description: "قاعة تدريبية متوسطة الحجم، مناسبة للدورات التفاعلية وورش العمل.",
        location: "الدور الأول - الجناح الشرقي"
    }
]

const featureLabels: Record<string, string> = {
    wifi: "واي فاي",
    projector: "جهاز عرض",
    whiteboard: "سبورة ذكية",
    ac: "تكييف",
    computers: "أجهزة كمبيوتر",
    screen: "شاشة عرض",
    coffee: "ضيافة"
}

const featureIcons: Record<string, any> = {
    wifi: Wifi,
    projector: Monitor,
    whiteboard: Building,
    ac: Building,
    computers: Monitor,
    screen: Monitor,
    coffee: Coffee
}

// --- Mock Data for Requests ---
const mockRoomBookings: RoomBooking[] = [
  {
    id: "1",
    roomId: "1",
    sessionId: "3",
    startTime: new Date("2025-02-05T10:00:00"),
    endTime: new Date("2025-02-05T12:00:00"),
    status: "pending",
    requestedById: "2",
    notes: "درس مهم تتطلب معدات عرض متقدمة",
    initialConfirmation: true,
    paymentConfirmation: false,
    createdAt: new Date("2025-02-01"),
  },
  {
    id: "2",
    roomId: "2",
    sessionId: "5",
    startTime: new Date("2025-02-10T14:00:00"),
    endTime: new Date("2025-02-10T16:00:00"),
    status: "approved",
    requestedById: "2",
    approvedById: "3",
    notes: "تم تخصيص القاعة المطلوبة",
    initialConfirmation: true,
    paymentConfirmation: true,
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "3",
    roomId: "3",
    sessionId: "8",
    startTime: new Date("2025-02-15T09:00:00"),
    endTime: new Date("2025-02-15T11:00:00"),
    status: "rejected",
    requestedById: "2",
    approvedById: "3",
    notes: "القاعة محجوزة لفعالية أخرى",
    initialConfirmation: false,
    paymentConfirmation: false,
    createdAt: new Date("2025-02-03"),
  },
  {
    id: "4",
    roomId: "1",
    sessionId: "6",
    startTime: new Date("2025-02-20T10:00:00"),
    endTime: new Date("2025-02-20T12:00:00"),
    status: "pending",
    requestedById: "2",
    notes: "مطلوب معدات صوتية إضافية",
    initialConfirmation: false,
    paymentConfirmation: false,
    createdAt: new Date("2025-02-04"),
  },
]

const mockSessionCourses = {
  "3": { title: "تعلم React من الصفر" },
  "5": { title: "تصميم واجهات المستخدم" },
  "8": { title: "إدارة المشاريع الرقمية" },
  "6": { title: "تعلم React من الصفر" },
}

const mockRooms = {
  "1": { name: "قاعة المحاضرات الأولى", capacity: 50 },
  "2": { name: "قاعة المحاضرات الثانية", capacity: 30 },
  "3": { name: "قاعة الحاسوب الأولى", capacity: 25 },
}


import { Separator } from "@/components/ui/separator"

// Standalone Booking Form Component with Sticky Footer Layout
const BookingForm = ({ hall, onCancel, onBook }: { 
    hall: typeof mockHalls[0], 
    onCancel: () => void, 
    onBook: (data: any) => void 
}) => {
    // Mode State
    const [mode, setMode] = useState<'unified' | 'custom'>('unified')
    
    // Data State
    const [sessions, setSessions] = useState<{ id: string, date: string, startTime: string, endTime: string }[]>([])
    const [reason, setReason] = useState<string>("")

    // Unified Mode Inputs
    const [unifiedDates, setUnifiedDates] = useState<string[]>([])
    const [unifiedDateInput, setUnifiedDateInput] = useState<string>("")
    const [unifiedStartTime, setUnifiedStartTime] = useState<string>("")
    const [unifiedEndTime, setUnifiedEndTime] = useState<string>("")

    // Custom Mode Inputs
    const [customDate, setCustomDate] = useState<string>("")
    const [customStartTime, setCustomStartTime] = useState<string>("")
    const [customEndTime, setCustomEndTime] = useState<string>("")

    // Handlers for Unified Mode
    const handleAddUnifiedDate = () => {
        if (unifiedDateInput && !unifiedDates.includes(unifiedDateInput)) {
            setUnifiedDates([...unifiedDates, unifiedDateInput].sort())
            setUnifiedDateInput("")
        }
    }

    const handleRemoveUnifiedDate = (dateToRemove: string) => {
        setUnifiedDates(unifiedDates.filter(d => d !== dateToRemove))
    }

    const handleAddUnifiedSessions = () => {
        if (unifiedDates.length > 0 && unifiedStartTime && unifiedEndTime) {
            const newSessions = unifiedDates.map(date => ({
                id: Math.random().toString(36).substr(2, 9),
                date,
                startTime: unifiedStartTime,
                endTime: unifiedEndTime
            }))
            
            // Filter out duplicate dates if logic requires, but allowing same date different times is okay?
            // For now, let's just add them.
            setSessions([...sessions, ...newSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
            
            // Reset unified inputs
            setUnifiedDates([])
            setUnifiedStartTime("")
            setUnifiedEndTime("")
            toast.success("تم إضافة الجلسات للقائمة")
        }
    }

    // Handlers for Custom Mode
    const handleAddCustomSession = () => {
        if (customDate && customStartTime && customEndTime) {
            const newSession = {
                id: Math.random().toString(36).substr(2, 9),
                date: customDate,
                startTime: customStartTime,
                endTime: customEndTime
            }
            setSessions([...sessions, newSession].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
            
            // Reset custom inputs
            setCustomDate("")
            setCustomStartTime("")
            setCustomEndTime("")
            toast.success("تم إضافة الجلسة")
        }
    }

    const handleRemoveSession = (sessionId: string) => {
        setSessions(sessions.filter(s => s.id !== sessionId))
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* 1. Header (Fixed) */}
            <div className="flex items-center justify-between p-6 border-b shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-500 hover:text-gray-900">
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">طلب حجز القاعة</h2>
                        <p className="text-sm text-gray-500">{hall.name}</p>
                    </div>
                </div>
            </div>

            {/* 2. Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="space-y-6">
                    
                    {/* Mode Selection */}
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            onClick={() => setMode('unified')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                mode === 'unified' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            وقت موحد للكل
                        </button>
                        <button
                            onClick={() => setMode('custom')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                mode === 'custom' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            وقت مخصص لكل جلسة
                        </button>
                    </div>

                    {/* Unified Mode UI */}
                    {mode === 'unified' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-3">
                                <label className="text-sm font-medium block">1. تحديد التواريخ</label>
                                <div className="flex gap-2">
                                    <Input 
                                        type="date" 
                                        value={unifiedDateInput} 
                                        onChange={e => setUnifiedDateInput(e.target.value)} 
                                        className="flex-1 bg-gray-50"
                                    />
                                    <Button 
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAddUnifiedDate}
                                        disabled={!unifiedDateInput}
                                        className="shrink-0"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {unifiedDates.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {unifiedDates.map(date => (
                                            <Badge key={date} variant="outline" className="gap-1 bg-white">
                                                {formatDate(new Date(date))}
                                                <X 
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                                    onClick={() => handleRemoveUnifiedDate(date)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">2. وقت البدء</label>
                                    <Input 
                                        type="time" 
                                        value={unifiedStartTime} 
                                        onChange={e => setUnifiedStartTime(e.target.value)} 
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">3. وقت الانتهاء</label>
                                    <Input 
                                        type="time" 
                                        value={unifiedEndTime} 
                                        onChange={e => setUnifiedEndTime(e.target.value)} 
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={handleAddUnifiedSessions}
                                disabled={unifiedDates.length === 0 || !unifiedStartTime || !unifiedEndTime}
                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4 ml-2" />
                                إضافة للقائمة
                            </Button>
                        </div>
                    )}

                    {/* Custom Mode UI */}
                    {mode === 'custom' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="space-y-2">
                                <label className="text-sm font-medium">1. التاريخ</label>
                                <Input 
                                    type="date" 
                                    value={customDate} 
                                    onChange={e => setCustomDate(e.target.value)} 
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">2. وقت البدء</label>
                                    <Input 
                                        type="time" 
                                        value={customStartTime} 
                                        onChange={e => setCustomStartTime(e.target.value)} 
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">3. وقت الانتهاء</label>
                                    <Input 
                                        type="time" 
                                        value={customEndTime} 
                                        onChange={e => setCustomEndTime(e.target.value)} 
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                            <Button 
                                onClick={handleAddCustomSession}
                                disabled={!customDate || !customStartTime || !customEndTime}
                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4 ml-2" />
                                إضافة للجلسة
                            </Button>
                        </div>
                    )}

                    <Separator />

                    {/* Sessions List */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center justify-between">
                            <span>الجلسات المضافة ({sessions.length})</span>
                            {sessions.length > 0 && <span className="text-xs font-normal text-muted-foreground">تأكد من صحة المواعيد</span>}
                        </label>
                        
                        {sessions.length === 0 ? (
                            <div className="border border-dashed rounded-lg p-6 text-center text-gray-500 text-sm bg-gray-50/50">
                                <Calendar className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                <p>لم يتم إضافة أي جلسات بعد.</p>
                                <p className="text-xs mt-1">استخدم النموذج أعلاه لإضافة مواعيد الحجز.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 border rounded-lg p-1 bg-gray-50 max-h-[200px] overflow-y-auto">
                                {sessions.map((session, index) => (
                                    <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded border text-sm shadow-sm group">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="h-6 w-6 flex items-center justify-center rounded-full p-0">
                                                {index + 1}
                                            </Badge>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                                    {formatDate(new Date(session.date))}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                                    <Clock className="h-3 w-3" />
                                                    {session.startTime} - {session.endTime}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveSession(session.id)}
                                            className="text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 my-4" />

                    {/* Booking Reason */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">سبب الحجز / النشاط</label>
                        <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                            placeholder="يرجى توضيح سبب الحجز بالتفصيل..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Footer */}
            <div className="p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-10 sticky bottom-0">
                <Button 
                    disabled={sessions.length === 0 || !reason}
                    onClick={() => {
                        onBook({ 
                            sessions,
                            reason 
                        })
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold shadow-sm"
                >
                   {sessions.length > 0
                        ? `إرسال طلب الحجز (${sessions.length} جلسات)`
                        : "إرسال طلب الحجز"
                    }
                </Button>
            </div>
        </div>
    )
}

const PaymentModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    amount 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onConfirm: () => void,
    amount: number
}) => {
    const [selectedTab, setSelectedTab] = useState("card")

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>سداد رسوم الحجز</DialogTitle>
                    <DialogDescription>
                        يرجى اختيار طريقة الدفع لإكمال عملية الحجز. المبلغ المستحق: {amount} ريال
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="card" onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="card">دفع إلكتروني</TabsTrigger>
                        <TabsTrigger value="transfer">حوالة بنكية</TabsTrigger>
                    </TabsList>

                    {/* Online Payment Tab */}
                    <TabsContent value="card" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-name">اسم صاحب البطاقة</Label>
                            <Input id="card-name" placeholder="الاسم كما يظهر على البطاقة" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card-number">رقم البطاقة</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                                <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">رمز الأمان (CVC)</Label>
                                <Input id="cvc" placeholder="123" />
                            </div>
                        </div>
                        <Button onClick={onConfirm} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                            دفع {amount} ريال
                        </Button>
                    </TabsContent>

                    {/* Bank Transfer Tab */}
                    <TabsContent value="transfer" className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 border text-sm">
                            <p className="font-semibold text-gray-900 mb-2">بيانات الحساب البنكي:</p>
                            <div className="space-y-1 text-gray-600">
                                <p>بنك الإنماء</p>
                                <p>SA56 0500 0012 3456 7890 1234</p>
                                <p>معهد التدريب المتقدم</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>صورة الإيصال</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-900">اضغط لرفع الصورة</span>
                                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                            </div>
                        </div>

                        <Button onClick={onConfirm} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                            إرسال الإيصال للتأكيد
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

// Simplified Booking Action Component to handle the multi-stage flow
const BookingActionArea = ({ hall, bookings, onBookStart, onPaymentClick }: { 
    hall: typeof mockHalls[0], 
    bookings: RoomBooking[], 
    onBookStart: () => void,
    onPaymentClick: (id: string) => void 
}) => {
    // Check for existing pending/approved booking
    const userBooking = bookings.find(b => b.roomId === hall.id && (b.status === 'pending' || b.status === 'approved'))
    
    if (userBooking) {
        // Status: Approved (Booked)
        if (userBooking.status === 'approved') {
             return (
                <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                        <p className="font-semibold text-green-900">تم حجز القاعة</p>
                        <p className="text-sm text-green-700">لقد تم الموافقة على طلبك.</p>
                    </div>
                </div>
            )
        }

        // Status: Pending - Payment Confirmed (Waiting for Final Approval)
        if (userBooking.initialConfirmation && userBooking.paymentConfirmation) {
             return (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                        <p className="font-semibold text-blue-900">بانتظار الموافقة النهائية</p>
                        <p className="text-sm text-blue-700">جاري التحقق من الدفع وإصدار التصريح.</p>
                    </div>
                </div>
            )
        }

        // Status: Pending - Ready for Payment
        if (userBooking.initialConfirmation && !userBooking.paymentConfirmation) {
            return (
                <div className="space-y-3">
                    <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">تمت الموافقة المبدئية! يرجى سداد الرسوم.</p>
                    </div>
                    <Button 
                        onClick={() => onPaymentClick(userBooking.id)}
                        className="w-full bg-green-600 hover:bg-green-700 gap-2"
                    >
                        <CheckCircle className="h-4 w-4" />
                        سداد الرسوم / رفع الإيصال
                    </Button>
                </div>
            )
        }

        // Status: Pending - Waiting for Initial Confirmation
        return (
            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                    <p className="font-semibold text-yellow-900">بانتظار الموافقة المبدئية</p>
                    <p className="text-sm text-yellow-700">طلبك قيد المراجعة من قبل المعهد.</p>
                </div>
            </div>
        )
    }

    // Default: Show Booking Button
    return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2 h-12 text-base" onClick={onBookStart}>
            <Calendar className="h-5 w-5" />
            حجز القاعة الآن
        </Button>
    )
}


export default function TrainerHallsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'guide' | 'requests'>('guide')
    
    // Halls state
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [selectedHall, setSelectedHall] = useState<typeof mockHalls[0] | null>(null)
    const [isBookingMode, setIsBookingMode] = useState(false) // New State for Booking Wizard Logic

    // Bookings state
    const [bookings, setBookings] = useState(mockRoomBookings)
    const [requestFilter, setRequestFilter] = useState<string>("all")
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)


    // Halls Logic
    const filteredHalls = mockHalls.filter(hall => {
        const matchesSearch = hall.name.includes(searchTerm) || hall.description.includes(searchTerm)
        const matchesType = typeFilter === "all" || hall.type === typeFilter
        return matchesSearch && matchesType
    })

    // Bookings Logic
    const filteredBookings = bookings.filter(booking => {
        if (requestFilter === "all") return true
        return booking.status === requestFilter
    })

    const getStatusLabel = (booking: RoomBooking) => {
        if (booking.status === 'pending') {
            if (booking.initialConfirmation && !booking.paymentConfirmation) {
                return 'بانتظار الدفع'
            }
            if (booking.initialConfirmation && booking.paymentConfirmation) {
                return 'بانتظار الموافقة النهائية' // Ready for approval
            }
            return 'قيد المراجعة' // Initial state
        }
        
        switch (booking.status) {
          case 'approved': return 'مقبول'
          case 'rejected': return 'مرفوض'
          case 'cancelled': return 'ملغى'
          default: return booking.status
        }
    }
    
    const getStatusColor = (booking: RoomBooking) => {
        if (booking.status === 'pending') {
             if (booking.initialConfirmation && !booking.paymentConfirmation) {
                return 'text-amber-600 bg-amber-50 border-amber-200'
            }
            return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        }

        switch (booking.status) {
          case 'approved': return 'text-green-600 bg-green-50 border-green-200'
          case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
          case 'cancelled': return 'text-gray-600 bg-gray-50 border-gray-200'
          default: return 'text-gray-600'
        }
    }

    const getStatusIcon = (booking: RoomBooking) => {
        if (booking.status === 'pending') {
             if (booking.initialConfirmation && !booking.paymentConfirmation) {
                return <Clock className="h-4 w-4 text-amber-600" />
            }
             return <Clock className="h-4 w-4" />
        }

        switch (booking.status) {
          case 'approved': return <CheckCircle className="h-4 w-4" />
          case 'rejected': return <X className="h-4 w-4" />
          case 'cancelled': return <AlertCircle className="h-4 w-4" />
          default: return null
        }
    }

    const getFilterLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'قيد المعالجة'
            case 'approved': return 'مقبولة'
            case 'rejected': return 'مرفوضة'
            case 'cancelled': return 'ملغاة'
            default: return status
        }
    }

    const handleCancelBooking = (booking: RoomBooking) => {
        setSelectedBooking(booking)
        setShowCancelDialog(true)
    }
    
    const confirmCancellation = () => {
        if (!selectedBooking) return
    
        setBookings(bookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ))
    
        setShowCancelDialog(false)
        setSelectedBooking(null)
    }

    const handlePaymentSubmit = () => {
        if (!selectedBooking) return
        
        setBookings(bookings.map(booking => 
            booking.id === selectedBooking.id 
                ? { ...booking, paymentConfirmation: true, status: 'pending' } // Ensure status stays pending but now waiting for final approval
                : booking
        ))
        
        toast.success("تم إرسال بيانات الدفع بنجاح، بانتظار التأكيد.")
        setIsPaymentModalOpen(false)
        setSelectedBooking(null)
    }

    const getCourseTitle = (sessionId: string | undefined) => {
        if (!sessionId) return 'دورة غير معروفة'
        return mockSessionCourses[sessionId as keyof typeof mockSessionCourses]?.title || 'دورة غير معروفة'
    }
    
    const getRoomName = (roomId: string) => {
        return mockRooms[roomId as keyof typeof mockRooms]?.name || 'قاعة غير معروفة'
    }

    const getInstituteNote = (booking: RoomBooking) => {
        if (booking.status === 'rejected') {
            return booking.notes || 'لم يتم ذكر سبب الرفض'
        }
        
        if (booking.status === 'pending') {
            if (booking.initialConfirmation && !booking.paymentConfirmation) {
                return 'تمت الموافقة المبدئية. يرجى سداد الرسوم لتثبيت الحجز'
            }
            if (booking.initialConfirmation && booking.paymentConfirmation) {
                return 'جاري مراجعة إيصال الدفع'
            }
            return 'الطلب قيد المراجعة'
        }
    
        if (booking.status === 'approved') {
            return 'تم حجز القاعة بنجاح'
        }
        
        return '-'
    }


    const pendingBookings = bookings.filter(b => b.status === 'pending')
    const approvedBookings = bookings.filter(b => b.status === 'approved')
    const rejectedBookings = bookings.filter(b => b.status === 'rejected')

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة القاعات</h1>
                    <p className="text-gray-600 mt-2">استعراض دليل القاعات ومتابعة طلبات الحجز</p>
                </div>

                {/* Segmented Control / Pill Tabs */}
                <div className="bg-gray-100 p-1 rounded-xl flex items-center w-fit">
                    <button
                        onClick={() => setActiveTab('guide')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'guide'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        دليل القاعات
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'requests'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        حجوزاتي
                    </button>
                </div>
            </div>

            {/* Tab 1: Halls Guide */}
            {activeTab === 'guide' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="ابحث عن قاعة..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pr-10"
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="نوع القاعة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">الكل</SelectItem>
                                            <SelectItem value="lecture">قاعة محاضرات</SelectItem>
                                            <SelectItem value="lab">معمل حاسب</SelectItem>
                                            <SelectItem value="meeting">قاعة اجتماعات</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Halls Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHalls.map((hall) => (
                            <Card key={hall.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-video relative bg-gray-100 group">
                                    <img 
                                        src={hall.image} 
                                        alt={hall.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white shadow-sm font-medium backdrop-blur-sm">
                                        {hall.type === 'lecture' ? 'قاعة محاضرات' : hall.type === 'lab' ? 'معمل حاسب' : 'قاعة اجتماعات'}
                                    </Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span>{hall.name}</span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {hall.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                        {hall.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{hall.capacity} شخص</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {hall.features.slice(0, 3).map((feature) => (
                                            <Badge key={feature} variant="secondary" className="text-xs">
                                                {featureLabels[feature]}
                                            </Badge>
                                        ))}
                                        {hall.features.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{hall.features.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full" onClick={() => {
                                                setSelectedHall(hall)
                                                setIsBookingMode(false)
                                            }}>
                                                عرض التفاصيل
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden gap-0">
                                            <div className="grid md:grid-cols-5 h-full max-h-[90vh] md:max-h-[600px] overflow-hidden">
                                                
                                                {/* Left Column: Image (40%) */}
                                                <div className="hidden md:block md:col-span-2 relative h-full bg-gray-100">
                                                    <img 
                                                        src={hall.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"}
                                                        alt={hall.name}
                                                        className="w-full h-full object-cover md:rounded-r-2xl" 
                                                    />
                                                    
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 md:rounded-r-2xl" />
                                                    
                                                    {/* Type Badge Overlay */}
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-sm">
                                                            {hall.type === 'lecture' ? 'قاعة محاضرات' : hall.type === 'lab' ? 'معمل حاسب' : 'قاعة اجتماعات'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Right Column: Details or Booking Wizard (60%) */}
                                                <div className="md:col-span-3 h-full overflow-hidden relative">
                                                    
                                                    {isBookingMode ? (
                                                        <BookingForm 
                                                            hall={hall} 
                                                            onCancel={() => setIsBookingMode(false)}
                                                            onBook={(data) => {
                                                                    const bookingsToAdd = data.sessions.map((session: any) => ({
                                                                        id: Math.random().toString(),
                                                                        roomId: hall.id,
                                                                        sessionId: "manual", 
                                                                        startTime: new Date(session.date + 'T' + session.startTime), 
                                                                        endTime: new Date(session.date + 'T' + session.endTime), 
                                                                        status: 'pending' as const,
                                                                        requestedById: 'current-user', 
                                                                        createdAt: new Date(),
                                                                        initialConfirmation: false,
                                                                        paymentConfirmation: false,
                                                                        notes: data.reason
                                                                    }))
                                                                    setBookings([...bookings, ...bookingsToAdd])
                                                                    toast.success(`تم إرسال ${bookingsToAdd.length} طلبات حجز بنجاح.`)
                                                                    setIsBookingMode(false)
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col h-full bg-white">
                                                            {/* Standard Header */}
                                                            <div className="flex items-start justify-between p-6 pb-2 shrink-0">
                                                                <div>
                                                                    <DialogTitle className="text-2xl font-bold text-gray-900">{hall.name}</DialogTitle>
                                                                    <DialogDescription className="flex items-center gap-1 mt-1 text-gray-500">
                                                                        <MapPin className="h-3.5 w-3.5" />
                                                                        {hall.location}
                                                                    </DialogDescription>
                                                                </div>
                                                                <DialogClose asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogClose>
                                                            </div>

                                                            {/* Scrollable Details */}
                                                            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                                                        {/* Description */}
                                                        <div>
                                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                                {hall.description}
                                                            </p>
                                                        </div>

                                                        {/* Stats Row - Compact */}
                                                        <div className="flex flex-wrap gap-4 items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <Users className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium">{hall.capacity}</span> <span className="text-gray-500 text-xs">شخص</span>
                                                            </div>
                                                            <div className="w-px h-4 bg-gray-300"></div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <Building className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium">{hall.type === 'lab' ? 'معمل' : 'قاعة'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Equipment - Inline Badges */}
                                                        <div>
                                                            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">التجهيزات المتوفرة</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {hall.features.map((feature) => {
                                                                    const Icon = featureIcons[feature] || Building
                                                                    return (
                                                                        <Badge key={feature} variant="secondary" className="gap-1 font-normal text-xs px-2 py-1 bg-white border border-gray-100 hover:bg-gray-50">
                                                                            <Icon className="h-3 w-3 text-gray-500" />
                                                                            {featureLabels[feature]}
                                                                        </Badge>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>

                                                        <Separator className="my-2" />

                                                        {/* Booking Action Entry Point */}
                                                        <div className="pt-2">
                                                            <BookingActionArea 
                                                                hall={hall} 
                                                                bookings={bookings} 
                                                                onBookStart={() => setIsBookingMode(true)}
                                                                onPaymentClick={(bookingId) => {
                                                                    const booking = bookings.find(b => b.id === bookingId)
                                                                    if (booking) {
                                                                        setSelectedBooking(booking)
                                                                        setIsPaymentModalOpen(true)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab 2: My Requests */}
            {activeTab === 'requests' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                    <div className="mr-4">
                                        <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
                                        <p className="text-2xl font-bold">{pendingBookings.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <div className="mr-4">
                                        <p className="text-sm font-medium text-gray-600">مقبولة</p>
                                        <p className="text-2xl font-bold">{approvedBookings.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <X className="h-8 w-8 text-red-600" />
                                    <div className="mr-4">
                                        <p className="text-sm font-medium text-gray-600">مرفوضة</p>
                                        <p className="text-2xl font-bold">{rejectedBookings.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <MapPin className="h-8 w-8 text-blue-600" />
                                    <div className="mr-4">
                                        <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                                        <p className="text-2xl font-bold">{bookings.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filter */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-gray-500" />
                                    <span className="font-medium">تصفية الطلبات:</span>
                                </div>
                                <Select value={requestFilter} onValueChange={setRequestFilter}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">جميع الطلبات</SelectItem>
                                        <SelectItem value="pending">قيد المعالجة</SelectItem>
                                        <SelectItem value="approved">مقبولة</SelectItem>
                                        <SelectItem value="rejected">مرفوضة</SelectItem>
                                        <SelectItem value="cancelled">ملغاة</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bookings Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>قائمة طلبات الحجز</CardTitle>
                            <CardDescription>
                                جميع طلبات حجز القاعات المرتبطة بدوراتك
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        لا توجد طلبات حجز
                                    </h3>
                                    <p className="text-gray-500">
                                        {requestFilter === "all"
                                            ? "لم تقم بطلب حجز أي قاعة بعد"
                                            : `لا توجد طلبات ${getFilterLabel(requestFilter)}`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>الدورة</TableHead>
                                            <TableHead>التاريخ والوقت</TableHead>
                                            <TableHead>القاعة المطلوبة</TableHead>
                                            <TableHead>الحالة</TableHead>
                                            <TableHead>ملاحظات المعهد</TableHead>
                                            <TableHead>الإجراءات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{getCourseTitle(booking.sessionId)}</div>
                                                        <div className="text-sm text-gray-500">
                                                            درس #{booking.sessionId}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(booking.startTime)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span>{getRoomName(booking.roomId)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className={`flex items-center gap-2 ${getStatusColor(booking)}`}>
                                                        {getStatusIcon(booking)}
                                                        <Badge variant="outline" className={getStatusColor(booking)}>
                                                            {getStatusLabel(booking)}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        <p className={`text-sm ${
                                                            booking.status === 'rejected' ? 'text-red-600 font-medium' :
                                                            booking.status === 'approved' ? 'text-green-600 font-medium' :
                                                            'text-gray-600'
                                                        }`}>
                                                            {getInstituteNote(booking)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {booking.status === 'pending' && (
                                                        <Dialog open={showCancelDialog && selectedBooking?.id === booking.id} onOpenChange={setShowCancelDialog}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleCancelBooking(booking)}
                                                                >
                                                                    <X className="mr-2 h-4 w-4" />
                                                                    إلغاء الطلب
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>تأكيد إلغاء الطلب</DialogTitle>
                                                                    <DialogDescription>
                                                                        هل أنت متأكد من رغبتك في إلغاء طلب حجز القاعة لدرس &ldquo;{getCourseTitle(booking.sessionId)}&rdquo;؟
                                                                        هذا الإجراء لا يمكن التراجع عنه.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="flex gap-2 justify-end">
                                                                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                                                                        إلغاء
                                                                    </Button>
                                                                    <Button variant="destructive" onClick={confirmCancellation}>
                                                                        تأكيد الإلغاء
                                                                    </Button>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Help Section */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>معلومات مهمة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">كيفية طلب حجز قاعة</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• أضف درس حضوري في جدول الدورة</li>
                                        <li>• اختر القاعة المناسبة من القائمة</li>
                                        <li>• احفظ الدرس وسيتم إرسال طلب الحجز تلقائياً</li>
                                        <li>• انتظر موافقة المعهد على الطلب</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">سياسة الحجز</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• يجب طلب الحجز قبل أسبوع على الأقل</li>
                                        <li>• يمكن إلغاء الطلب قبل 24 ساعة من الموعد</li>
                                        <li>• في حالة الرفض سيتم إشعارك بالأسباب</li>
                                        <li>• يمكن طلب قاعة بديلة في حالة الرفض</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            
            {/* Payment Modal */}
            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handlePaymentSubmit}
                amount={500} 
            />
        </div>
    )
}
