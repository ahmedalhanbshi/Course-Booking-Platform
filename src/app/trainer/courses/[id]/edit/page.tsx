"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { trainerService } from "@/lib/trainer-service"
import { HallImage } from "@/components/halls/HallImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Price } from "@/components/ui/price"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowRight, Save, Send, X, Plus, ImageIcon, MapPin, Users, Building, Globe, Calendar, CheckCircle, Banknote, AlertCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatTimeRange, getFileUrl } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const platforms = [
    { value: "zoom", label: "Zoom" },
    { value: "teams", label: "Microsoft Teams" },
    { value: "meet", label: "Google Meet" },
    { value: "webex", label: "Webex" },
    { value: "other", label: "أخرى" }
]

const timeSlots = [
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00"
]
const weekDaysShort = ["أحد", "اثن", "ثلا", "أرب", "خم", "جم", "سبت"]

export default function EditCoursePage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("info")
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])

    const [courseData, setCourseData] = useState({
        title: "",
        categoryId: "",
        shortDescription: "",
        description: "",
        price: "",
        duration: "",
        minStudents: "",
        maxStudents: "",
        startDate: "",
        endDate: "",
        status: "",
        image: "",
        deliveryType: "",
        objectives: [] as string[],
        prerequisites: [] as string[],
        tags: [] as string[]
    })

    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    const [isImageDragging, setIsImageDragging] = useState(false)
    const [imagePreviewUrl, setImagePreviewUrl] = useState("")
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Schedule State
    const [halls, setHalls] = useState<any[]>([])
    const [selectedHallId, setSelectedHallId] = useState("")
    const [isHallDialogOpen, setIsHallDialogOpen] = useState(false)
    const [selectedSessions, setSelectedSessions] = useState<{ date: string, slot: string }[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [calendarOffset, setCalendarOffset] = useState(0)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isSlotsLoading, setIsSlotsLoading] = useState(false)
    const [unavailableMessage, setUnavailableMessage] = useState("")

    type OnlineSession = { date: string; startTime: string; duration: string; topic: string }
    const [onlineSchedule, setOnlineSchedule] = useState({ platform: "", meetingLink: "" })
    const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>([
        { date: "", startTime: "", duration: "60", topic: "" }
    ])

    const updateOnlineSession = (idx: number, field: keyof OnlineSession, value: string) =>
        setOnlineSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [course, cats, hls] = await Promise.all([
                    trainerService.getCourseById(params.id as string),
                    trainerService.getCategories(),
                    trainerService.getHalls()
                ])
                setCategories(cats)
                setHalls(hls)
                setCourseData({
                    title: course.title,
                    categoryId: course.categoryId || "",
                    shortDescription: course.shortDescription || "",
                    description: course.description || "",
                    price: course.price.toString(),
                    duration: course.duration.toString(),
                    minStudents: course.minStudents.toString(),
                    maxStudents: course.maxStudents.toString(),
                    startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : "",
                    endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : "",
                    status: course.status,
                    image: course.image || "",
                    deliveryType: course.deliveryType || "",
                    objectives: course.objectives || [],
                    prerequisites: course.prerequisites || [],
                    tags: course.tags || []
                })
                if (course.image) setImagePreviewUrl(getFileUrl(course.image) || "")
            } catch (err: any) {
                toast.error("فشل في تحميل بيانات الدورة")
            } finally { setLoading(false) }
        }
        if (params.id) fetchData()
    }, [params.id])

    const handleFile = (file?: File | null) => {
        if (!file) return
        setImagePreviewUrl(URL.createObjectURL(file))
        setSelectedImageFile(file)
    }

    const handleSubmit = async (publishStatus?: 'DRAFT' | 'ACTIVE') => {
        try {
            setSubmitting(true)
            const formData = new FormData()
            Object.entries(courseData).forEach(([k, v]) => { if (k === 'objectives' || k === 'tags' || k === 'prerequisites') formData.append(k, JSON.stringify(v)); else if (k !== 'image') formData.append(k, String(v)) })
            if (publishStatus) formData.set('status', publishStatus)
            if (selectedImageFile) formData.append('image', selectedImageFile)

            if (publishStatus === 'ACTIVE') {
                if (courseData.deliveryType === 'in_person') {
                    if (!selectedHallId || selectedSessions.length === 0) throw new Error("اختر القاعة والمواعيد")
                    formData.set('hallId', selectedHallId)
                    formData.append('sessions', JSON.stringify(selectedSessions.map(s => ({ date: s.date, startTime: s.slot.split(" - ")[0], endTime: s.slot.split(" - ")[1], location: "قاعة التدريب", topic: "جلسة جديدة" }))))
                } else if (courseData.deliveryType === 'online') {
                    const valid = onlineSessions.filter(s => s.date && s.startTime)
                    if (valid.length === 0) throw new Error("أضف جلسة أونلاين")
                    formData.append('sessions', JSON.stringify(valid.map(s => ({ date: s.date, startTime: s.startTime, endTime: "23:59", location: onlineSchedule.platform || "Online", topic: s.topic || "جلسة أونلاين" }))))
                }
            }

            await trainerService.updateCourse(params.id as string, formData)
            toast.success("تم التحديث")
            router.push(`/trainer/courses/${params.id}`)
        } catch (err: any) { toast.error(err.message || "خطأ") } finally { setSubmitting(false) }
    }

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const monthDate = new Date(todayStart.getFullYear(), todayStart.getMonth() + calendarOffset, 1)
    const monthLabel = formatDate(monthDate, { month: "long", year: "numeric" })
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay()

    const calendarDays: Array<{ day: number; dateKey: string; isPast: boolean } | null> = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        calendarDays.push({ day, dateKey, isPast: new Date(monthDate.getFullYear(), monthDate.getMonth(), day) < todayStart })
    }
    while (calendarDays.length % 7 !== 0) calendarDays.push(null)

    const handleSelectDay = async (dateKey: string) => {
        setSelectedDate(dateKey); setUnavailableMessage(""); setAvailableSlots([])
        if (!selectedHallId) return
        setIsSlotsLoading(true)
        try {
            const data = await trainerService.getHallAvailability(selectedHallId, dateKey)
            const dateObj = new Date(dateKey)
            const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][dateObj.getDay()]
            const allowedPeriods = data.availability?.filter((a: any) => a.day === dayName) || []
            const booked = data.bookedSessions || []
            const open = timeSlots.filter(slot => {
                const [s, e] = slot.split(" - ")
                if (data.availability?.length > 0 && !allowedPeriods.some((p: any) => s >= p.startTime.substring(0, 5) && e <= p.endTime.substring(0, 5))) return false
                return !booked.some((b: any) => new Date(`${dateKey}T${s}:00`) < new Date(b.endTime) && new Date(`${dateKey}T${e}:00`) > new Date(b.startTime))
            })
            setAvailableSlots(open)
            if (open.length === 0) setUnavailableMessage("لا يوجد أوقات متاحة")
        } catch { toast.error("فشل جلب الأوقات") } finally { setIsSlotsLoading(false) }
    }

    const isDraft = courseData.status === 'DRAFT' || courseData.status === 'draft'

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="max-w-5xl mx-auto pb-12" dir="rtl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="sm" asChild><Link href={`/trainer/courses/${params.id}`}><ArrowLeft className="ml-2 h-4 w-4" /> العودة</Link></Button>
                <h1 className="text-2xl font-bold">تعديل الدورة: {courseData.title}</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10" dir="rtl">
                    <TabsList className="relative flex w-full h-12 bg-transparent gap-8 p-0 border-none">
                        {/* Connector Line */}
                        <div className="absolute top-1/2 right-12 left-12 h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
                        
                        <TabsTrigger value="info" className="flex-1 relative z-10 bg-white data-[state=active]:bg-white data-[state=active]:shadow-none border-none group px-0">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-data-[state=active]:bg-blue-600 group-data-[state=active]:text-white text-sm font-bold ring-4 ring-white transition-all shadow-sm">1</span>
                                <span className="font-bold text-gray-500 group-data-[state=active]:text-blue-700 transition-colors">بيانات الدورة</span>
                            </div>
                        </TabsTrigger>
                        
                        <TabsTrigger value="schedule" disabled={!isDraft} className="flex-1 relative z-10 bg-white data-[state=active]:bg-white data-[state=active]:shadow-none border-none group px-0">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-data-[state=active]:bg-blue-600 group-data-[state=active]:text-white text-sm font-bold ring-4 ring-white transition-all shadow-sm">2</span>
                                <span className="font-bold text-gray-500 group-data-[state=active]:text-blue-700 transition-colors">المواعيد والتسعير</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="info" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>المعلومات الأساسية</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-8 items-start mb-6 pb-6 border-b">
                                <div className="w-full md:w-72 space-y-4">
                                    <Label className="font-bold">صورة الدورة *</Label>
                                    <div className="relative h-48 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        {imagePreviewUrl ? <Image src={imagePreviewUrl} alt="Preview" fill className="object-cover" /> : <Plus className="h-10 w-10 text-gray-400" />}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
                                </div>
                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-2"><Label className="font-bold">عنوان الدورة *</Label><Input value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} /></div>
                                    <div className="space-y-2"><Label className="font-bold">الفئة *</Label><Select value={courseData.categoryId} onValueChange={v => setCourseData({ ...courseData, categoryId: v })}><SelectTrigger><SelectValue placeholder="الفئة" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="font-bold">وصف مختصر *</Label><Textarea value={courseData.shortDescription} onChange={e => setCourseData({ ...courseData, shortDescription: e.target.value })} rows={2} /></div>
                                </div>
                            </div>

                            <div className="space-y-2"><Label className="font-bold">الوصف التفصيلي *</Label><Textarea value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} rows={4} /></div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2"><Label className="font-bold">السعر *</Label><Input type="number" value={courseData.price} onChange={e => setCourseData({ ...courseData, price: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="font-bold">المدة (ساعة)</Label><Input type="number" value={courseData.duration} onChange={e => setCourseData({ ...courseData, duration: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="font-bold">الحالة</Label><Input value={courseData.status} disabled /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between items-center pt-6 border-t mt-8" dir="rtl">
                        <Button variant="ghost" onClick={() => handleSubmit()} disabled={submitting} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border">
                            <Save className="h-4 w-4" />
                            <span>حفظ كمسودة</span>
                        </Button>
                        <Button onClick={() => setActiveTab("schedule")} className="flex items-center gap-2 px-6">
                            <span>التالي</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-6" dir="rtl">
                    <Card><CardHeader><CardTitle className="text-right flex items-center justify-start gap-2 border-b pb-4"><Globe className="h-5 w-5 text-blue-600" />طريقة التقديم</CardTitle></CardHeader>
                    <CardContent>
                        <RadioGroup value={courseData.deliveryType} onValueChange={v => setCourseData({ ...courseData, deliveryType: v })} className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
                            <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50' : ''}`}><RadioGroupItem value="online" className="sr-only" /><Globe className="h-6 w-6 text-blue-600" /><span className="font-bold">أونلاين</span></label>
                            <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'in_person' ? 'border-green-600 bg-green-50' : ''}`}><RadioGroupItem value="in_person" className="sr-only" /><Building className="h-6 w-6 text-green-600" /><span className="font-bold">حضوري</span></label>
                            <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'capacity_based' ? 'border-purple-600 bg-purple-50' : ''}`}><RadioGroupItem value="capacity_based" className="sr-only" /><Users className="h-6 w-6 text-purple-600" /><span className="font-bold">حجز مرن</span></label>
                        </RadioGroup>
                    </CardContent></Card>

                    {!isDraft && (
                         <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 text-right">
                             <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                             <p>تغيير المواعيد وتعريف الجلسات متاح للمسودات فقط. للدورات النشطة، يرجى التواصل مع الدعم الفني.</p>
                         </div>
                    )}

                    {isDraft && courseData.deliveryType === 'online' && (
                        <div className="space-y-6" dir="rtl">
                            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-right"><Globe className="h-5 w-5 text-blue-600" />منصة البث والرابط</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2 text-right"><Label className="text-right block">منصة البث</Label><Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule({ ...onlineSchedule, platform: v })} dir="rtl"><SelectTrigger className="text-right"><SelectValue placeholder="اختر المنصة" /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.value} value={p.value} className="text-right">{p.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2 text-right"><Label className="text-right block">رابط الاجتماع (Meeting Link)</Label><Input placeholder="https://zoom.us/j/..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule({ ...onlineSchedule, meetingLink: e.target.value })} className="text-right" dir="ltr" /></div></CardContent></Card>
                            <Card><CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2 text-right"><Calendar className="h-5 w-5 text-blue-600" />الجلسات ({onlineSessions.length})</CardTitle><Button type="button" size="sm" variant="outline" onClick={() => setOnlineSessions([...onlineSessions, { date: "", startTime: "", duration: "60", topic: "" }])} className="flex items-center gap-2"><Plus className="h-4 w-4" /> <span>إضافة جلسة</span></Button></div></CardHeader><CardContent className="space-y-4">{onlineSessions.map((session, idx) => (<div key={idx} className="border rounded-xl p-4 space-y-3 bg-blue-50/40 relative text-right"><div className="flex justify-between items-center"><span className="font-semibold text-sm text-blue-800">جلسة {idx + 1}</span>{onlineSessions.length > 1 && (<Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => setOnlineSessions(prev => prev.filter((_, i) => i !== idx))}><X className="h-4 w-4" /></Button>)}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="space-y-1 text-right"><Label className="text-xs">التاريخ</Label><Input type="date" value={session.date} onChange={e => updateOnlineSession(idx, 'date', e.target.value)} className="text-right" /></div><div className="space-y-1 text-right"><Label className="text-xs">وقت البدء</Label><Input type="time" value={session.startTime} onChange={e => updateOnlineSession(idx, 'startTime', e.target.value)} className="text-right" /></div><div className="space-y-1 text-right"><Label className="text-xs">المدة (دقيقة)</Label><Select value={session.duration} onValueChange={v => updateOnlineSession(idx, 'duration', v)} dir="rtl"><SelectTrigger className="text-right"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="30" className="text-right">30 دقيقة</SelectItem><SelectItem value="45" className="text-right">45 دقيقة</SelectItem><SelectItem value="60" className="text-right">60 دقيقة</SelectItem><SelectItem value="90" className="text-right">90 دقيقة</SelectItem><SelectItem value="120" className="text-right">120 دقيقة</SelectItem><SelectItem value="180" className="text-right">180 دقيقة</SelectItem></SelectContent></Select></div></div><div className="space-y-1 text-right"><Label className="text-xs">عنوان الجلسة (اختياري)</Label><Input placeholder="مثال: المقدمة" value={session.topic} onChange={e => updateOnlineSession(idx, 'topic', e.target.value)} className="text-right" /></div></div>))}</CardContent></Card>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t mt-8" dir="rtl">
                        <Button variant="outline" onClick={() => setActiveTab("info")} className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            <span>السابق</span>
                        </Button>
                        <Button onClick={() => handleSubmit('ACTIVE')} disabled={submitting} className="flex items-center gap-2 px-8">
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            <span>تحديث البيانات</span>
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
