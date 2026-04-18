"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { instituteService } from "@/lib/institute-service"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

export default function EditInstituteCoursePage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("info")
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [trainers, setTrainers] = useState<{ id: string, name: string }[]>([])

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
        trainerId: "",
        status: "",
        image: "",
        deliveryType: "",
        objectives: [] as string[],
        prerequisites: [] as string[],
        tags: [] as string[]
    })

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [course, cats, trns, hls] = await Promise.all([
                    instituteService.getCourseById(params.id as string),
                    instituteService.getCategories(),
                    instituteService.getTrainers(),
                    instituteService.getHalls()
                ])
                setCategories(cats); setTrainers(trns); setHalls(hls)
                setCourseData({
                    title: course.title,
                    categoryId: course.categoryId || "",
                    shortDescription: course.shortDescription || "",
                    description: course.description || "",
                    price: course.price.toString(),
                    duration: course.duration?.toString() || "",
                    minStudents: course.minStudents.toString(),
                    maxStudents: course.maxStudents.toString(),
                    startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : "",
                    endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : "",
                    trainerId: course.trainer?.id || "",
                    status: course.status,
                    image: course.image || "",
                    deliveryType: course.deliveryType || "",
                    objectives: course.objectives || [],
                    prerequisites: course.prerequisites || [],
                    tags: course.tags || []
                })
                if (course.image) setImagePreviewUrl(getFileUrl(course.image) || "")
            } catch (err: any) { toast.error("فشل في تحميل البيانات") } finally { setLoading(false) }
        }
        if (params.id) fetchData()
    }, [params.id])

    const handleSubmit = async (publishStatus?: 'DRAFT' | 'ACTIVE') => {
        try {
            setSubmitting(true)
            const formData = new FormData()
            Object.entries(courseData).forEach(([k, v]) => { if (k === 'objectives' || k === 'tags' || k === 'prerequisites') formData.append(k, JSON.stringify(v)); else if (k !== 'image') formData.append(k, String(v)) })
            if (publishStatus) formData.set('status', publishStatus)
            if (selectedImageFile) formData.append('image', selectedImageFile)

            await instituteService.updateCourse(params.id as string, formData)
            toast.success("تم التحديث")
            router.push(`/institute/courses/${params.id}`)
        } catch (err: any) { toast.error(err.message || "خطأ") } finally { setSubmitting(false) }
    }

    const isDraft = courseData.status === 'DRAFT' || courseData.status === 'draft'

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="max-w-5xl mx-auto pb-12" dir="rtl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="sm" asChild><Link href={`/institute/courses/${params.id}`}><ArrowLeft className="ml-2 h-4 w-4" /> العودة</Link></Button>
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
                                <span className="font-bold text-gray-500 group-data-[state=active]:text-blue-700 transition-colors">الحجز والمواعيد</span>
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
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setSelectedImageFile(e.target.files[0]); setImagePreviewUrl(URL.createObjectURL(e.target.files[0])) } }} />
                                </div>
                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-2"><Label className="font-bold">عنوان الدورة *</Label><Input value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} /></div>
                                    <div className="space-y-2"><Label className="font-bold">الفئة *</Label><Select value={courseData.categoryId} onValueChange={v => setCourseData({ ...courseData, categoryId: v })}><SelectTrigger><SelectValue placeholder="الفئة" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="font-bold">وصف مختصر *</Label><Textarea value={courseData.shortDescription} onChange={e => setCourseData({ ...courseData, shortDescription: e.target.value })} rows={2} /></div>
                                </div>
                            </div>

                            <div className="space-y-2"><Label className="font-bold">الوصف التفصيلي *</Label><Textarea value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} rows={4} /></div>

                            <div className="space-y-2 mb-6">
                                <Label className="font-bold">المدرب</Label>
                                <Select value={courseData.trainerId} onValueChange={v => setCourseData({ ...courseData, trainerId: v })}>
                                    <SelectTrigger><SelectValue placeholder="اختر مدرباً" /></SelectTrigger>
                                    <SelectContent>{trainers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2"><Label className="font-bold">السعر *</Label><Input type="number" value={courseData.price} onChange={e => setCourseData({ ...courseData, price: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="font-bold">أقل عدد *</Label><Input type="number" value={courseData.minStudents} onChange={e => setCourseData({ ...courseData, minStudents: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="font-bold">أقصى عدد *</Label><Input type="number" value={courseData.maxStudents} onChange={e => setCourseData({ ...courseData, maxStudents: e.target.value })} /></div>
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
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-6" dir="rtl">
                    <Card><CardHeader><CardTitle className="text-right flex items-center justify-start gap-2 border-b pb-4"><Globe className="h-5 w-5 text-blue-500" />طريقة التقديم</CardTitle></CardHeader>
                    <CardContent>
                        <RadioGroup value={courseData.deliveryType} onValueChange={v => setCourseData({ ...courseData, deliveryType: v })} className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
                            <label className={`border rounded p-4 flex flex-col items-center cursor-pointer ${courseData.deliveryType === 'online' ? 'bg-blue-50 border-blue-500' : ''}`}><RadioGroupItem value="online" className="sr-only" /><Globe className="h-6 w-6 text-blue-500" />أونلاين</label>
                            <label className={`border rounded p-4 flex flex-col items-center cursor-pointer ${courseData.deliveryType === 'in_person' ? 'bg-green-50 border-green-500' : ''}`}><RadioGroupItem value="in_person" className="sr-only" /><Building className="h-6 w-6 text-green-500" />حضوري</label>
                            <label className={`border rounded p-4 flex flex-col items-center cursor-pointer ${courseData.deliveryType === 'capacity_based' ? 'bg-purple-50 border-purple-500' : ''}`}><RadioGroupItem value="capacity_based" className="sr-only" /><Users className="h-6 w-6 text-purple-500" />حجز مرن</label>
                        </RadioGroup>
                    </CardContent></Card>

                    {!isDraft && (
                         <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 text-right">
                             <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                             <p>تغيير المواعيد متاح للمسودات فقط.</p>
                         </div>
                    )}

                    {isDraft && courseData.deliveryType === 'online' && (
                        <div className="space-y-6" dir="rtl">
                            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-right"><Globe className="h-5 w-5 text-blue-600" />المنصة والرابط</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2 text-right"><Label className="block">منصة البث</Label><Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule({ ...onlineSchedule, platform: v })} dir="rtl"><SelectTrigger className="text-right"><SelectValue placeholder="المنصة" /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.value} value={p.value} className="text-right">{p.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2 text-right"><Label className="block">رابط الاجتماع (Meeting Link)</Label><Input placeholder="الرابط..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule({ ...onlineSchedule, meetingLink: e.target.value })} className="text-right" dir="ltr" /></div></CardContent></Card>
                            <Card><CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2 text-right"><Calendar className="h-5 w-5 text-blue-600" />الجلسات ({onlineSessions.length})</CardTitle><Button type="button" size="sm" variant="outline" onClick={() => setOnlineSessions([...onlineSessions, { date: "", startTime: "", duration: "60", topic: "" }])} className="flex items-center gap-2"><Plus className="h-4 w-4" /> <span>إضافة جلسة</span></Button></div></CardHeader><CardContent className="space-y-4">{onlineSessions.map((s, i) => (<div key={i} className="border rounded-xl p-4 space-y-3 bg-blue-50/40 relative text-right"><div className="flex justify-between items-center"><span className="font-bold text-sm">جلسة {i + 1}</span>{onlineSessions.length > 1 && <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setOnlineSessions(prev => prev.filter((_, idx) => idx !== i))}><X className="h-4 w-4"/></Button>}</div><div className="grid grid-cols-3 gap-3"><div className="space-y-1"><Label className="text-xs">التاريخ</Label><Input type="date" value={s.date} onChange={e => updateOnlineSession(i, 'date', e.target.value)} className="text-right" /></div><div className="space-y-1"><Label className="text-xs">البدء</Label><Input type="time" value={s.startTime} onChange={e => updateOnlineSession(i, 'startTime', e.target.value)} className="text-right" /></div><div className="space-y-1"><Label className="text-xs">المدة</Label><Select value={s.duration} onValueChange={v => updateOnlineSession(i, 'duration', v)} dir="rtl"><SelectTrigger className="text-right"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="30" className="text-right">30 د</SelectItem><SelectItem value="60" className="text-right">60 د</SelectItem><SelectItem value="90" className="text-right">90 د</SelectItem></SelectContent></Select></div></div></div>))}</CardContent></Card>
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
