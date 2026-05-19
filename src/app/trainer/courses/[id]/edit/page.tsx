"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HallImage } from "@/components/halls/HallImage"
import { Save, Send, Trash2, ArrowLeft, X, Loader2, AlertCircle, UploadCloud, Banknote, Plus, Globe, Building, Users, MapPin, Calendar, CheckCircle, Landmark } from "lucide-react"
import { toast } from "sonner"
import { trainerService } from "@/lib/trainer-service"
import { PublicService, Tag } from "@/lib/public-service"
import { getFileUrl } from "@/lib/utils"
import Image from "next/image"

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

export default function EditTrainerCoursePage() {
    const router = useRouter()
    const params = useParams()
    const courseId = params.id as string

    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [activeTab, setActiveTab] = useState("info")

    const [courseData, setCourseData] = useState<any>(null)
    const [availableTags, setAvailableTags] = useState<Tag[]>([])
    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")

    const [resubmitFile, setResubmitFile] = useState<File | null>(null)
    const [resubmitPreview, setResubmitPreview] = useState<string>("")
    const [isResubmitting, setIsResubmitting] = useState(false)

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ---- Schedule State (Tab 2 - only for DRAFT) ----
    const [halls, setHalls] = useState<any[]>([])
    const [selectedHallId, setSelectedHallId] = useState("")
    const [isHallDialogOpen, setIsHallDialogOpen] = useState(false)
    const [selectedSessions, setSelectedSessions] = useState<{ date: string; slot: string }[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [calendarOffset, setCalendarOffset] = useState(0)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isSlotsLoading, setIsSlotsLoading] = useState(false)
    const [unavailableMessage, setUnavailableMessage] = useState("")

    const [paymentFile, setPaymentFile] = useState<File | null>(null)
    const [paymentPreview, setPaymentPreview] = useState("")
    const paymentInputRef = useRef<HTMLInputElement>(null)

    type OnlineSession = { date: string; startTime: string; duration: string; topic: string }
    const [onlineSchedule, setOnlineSchedule] = useState({ platform: "", meetingLink: "" })
    const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>([{ date: "", startTime: "", duration: "60", topic: "" }])
    const addOnlineSession = () => setOnlineSessions(prev => [...prev, { date: "", startTime: "", duration: "60", topic: "" }])
    const removeOnlineSession = (idx: number) => setOnlineSessions(prev => prev.filter((_, i) => i !== idx))
    const updateOnlineSession = (idx: number, field: keyof OnlineSession, value: string) =>
        setOnlineSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))

    // Calendar helpers
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const maxMonthsAhead = 5
    const monthDate = new Date(todayStart.getFullYear(), todayStart.getMonth() + calendarOffset, 1)
    const calYear = monthDate.getFullYear()
    const calMonth = monthDate.getMonth()
    const monthLabel = monthDate.toLocaleDateString("ar-SA", { month: "long", year: "numeric" })
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const calendarDays: Array<{ day: number; dateKey: string; isPast: boolean } | null> = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        calendarDays.push({ day, dateKey, isPast: new Date(calYear, calMonth, day) < todayStart })
    }
    while (calendarDays.length % 7 !== 0) calendarDays.push(null)
    const formatDateLabel = (k: string) => { const [y, m, d] = k.split("-"); return `${d}-${m}-${y}` }

    const mappedHalls = halls.map(h => ({
        id: h.id, name: h.name,
        type: h.type || "قاعة تدريب",
        location: h.location || "مقر المعهد",
        capacity: h.capacity,
        hourlyRate: Number(h.pricePerHour),
        image: h.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
        features: h.facilities?.length > 0 ? h.facilities : ["مجهزة بالكامل"],
        owner: h.institute?.name || "المعهد",
        bankAccounts: h.institute?.bankAccounts || [],
        description: h.description
    }))
    const selectedHall = mappedHalls.find(h => h.id === selectedHallId)
    const totalPrice = selectedHall ? selectedHall.hourlyRate * selectedSessions.length : 0

    useEffect(() => { setSelectedDate(null); setSelectedSessions([]); setAvailableSlots([]); setCalendarOffset(0) }, [selectedHallId])

    const handleSelectDay = async (dateKey: string) => {
        setSelectedDate(dateKey); setUnavailableMessage(""); setAvailableSlots([])
        if (!selectedHallId) return
        setIsSlotsLoading(true)
        try {
            const data = await trainerService.getHallAvailability(selectedHallId, dateKey)
            const [y, m, d] = dateKey.split("-").map(Number)
            const dateObj = new Date(y, m - 1, d)
            const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][dateObj.getDay()]
            const availabilitySlots = Array.isArray(data.availability)
                ? data.availability
                : ((data.availability as any)?.slots ?? [])
            const allowedPeriods = availabilitySlots.filter((a: any) => a.day === dayName) || []
            const hasAvailability = availabilitySlots.length > 0
            const booked = data.bookedSessions || []
            const openSlots = timeSlots.filter(slot => {
                const [s, e] = slot.split(" - ")
                if (hasAvailability) {
                    if (!allowedPeriods.some((p: any) => s >= p.startTime.substring(0, 5) && e <= p.endTime.substring(0, 5))) return false
                }
                const slotStart = new Date(`${dateKey}T${s}:00`)
                const slotEnd = new Date(`${dateKey}T${e}:00`)
                return !booked.some((b: any) => {
                    const bStart = new Date(b.startTime)
                    const bEnd = new Date(b.endTime)
                    return slotStart < bEnd && slotEnd > bStart
                })
            })

            setAvailableSlots(openSlots)
            if (openSlots.length === 0) setUnavailableMessage("لا يوجد أوقات متاحة في هذا اليوم أو القاعة مغلقة")
        } catch { toast.error("فشل جلب أوقات القاعة المتاحة") }
        finally { setIsSlotsLoading(false) }
    }

    const toggleSlot = (date: string, slot: string) => {
        const exists = selectedSessions.some(s => s.date === date && s.slot === slot)
        setSelectedSessions(prev => exists ? prev.filter(s => !(s.date === date && s.slot === slot)) : [...prev, { date, slot }])
    }

    const handleResubmit = async () => {
        if (!resubmitFile || !courseData.roomBooking?.id) return
        try {
            setIsResubmitting(true)
            await trainerService.resubmitBookingPayment(courseId, courseData.roomBooking.id, resubmitFile)
            toast.success("تم إعادة إرسال طلب الحجز بنجاح")
            const data = await trainerService.getTrainerCourseById(courseId)
            setCourseData({ ...data, startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '', endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '' })
            setResubmitFile(null); setResubmitPreview("")
        } catch (err: any) { toast.error(err?.response?.data?.message || "فشل في إعادة الإرسال") }
        finally { setIsResubmitting(false) }
    }

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true)
                const [data, hls, tags] = await Promise.all([
                    trainerService.getTrainerCourseById(courseId),
                    trainerService.getHalls(),
                    PublicService.getTags()
                ])
                setCourseData({ ...data,
                    startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
                    endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
                    enrolledStudents: data.enrolledStudents ?? 0,
                })
                setHalls(hls)
                setAvailableTags(tags)
                if (data.image) setImagePreview(getFileUrl(data.image) ?? "")
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "فشل في تحميل بيانات الدورة")
                router.push('/trainer/courses')
            } finally { setLoading(false) }
        }
        if (courseId) fetchCourse()
    }, [courseId, router])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
    }

    const handleSubmit = async (publishStatus?: 'DRAFT' | 'ACTIVE') => {
        if (!courseData) return
        try {
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append('title', courseData.title)
            formData.append('shortDescription', courseData.shortDescription || '')
            formData.append('description', courseData.description || '')
            formData.append('price', courseData.price.toString())
            formData.append('duration', courseData.duration.toString())
            formData.append('maxStudents', courseData.maxStudents.toString())
            formData.append('startDate', courseData.startDate)
            formData.append('endDate', courseData.endDate)
            formData.append('categoryId', courseData.categoryId || '')
            formData.append('objectives', JSON.stringify(courseData.objectives))
            formData.append('prerequisites', JSON.stringify(courseData.prerequisites))
            formData.append('tags', JSON.stringify(courseData.tags))
            if (imageFile) formData.append('image', imageFile)
            if (publishStatus) formData.append('status', publishStatus)

            // If publishing, validate and include sessions
            if (publishStatus === 'ACTIVE') {
                const deliveryType = courseData.deliveryType
                if (!deliveryType) throw new Error("يجب اختيار طريقة التقديم")
                formData.append('deliveryType', deliveryType)
                let startDate: string, endDate: string
                let sessionsPayload: any[] = []

                if (deliveryType === 'in_person') {
                    if (!selectedHallId) throw new Error("يجب اختيار القاعة")
                    if (selectedSessions.length === 0) throw new Error("يجب اختيار جلسة واحدة على الأقل")
                    if (!paymentFile && !courseData.roomBooking) throw new Error("يجب إرفاق إيصال الدفع لحجز القاعة")
                    const sorted = [...selectedSessions].sort((a, b) => a.date.localeCompare(b.date))
                    startDate = sorted[0].date; endDate = sorted[sorted.length - 1].date
                    sessionsPayload = selectedSessions.map(s => ({
                        date: s.date, startTime: s.slot.split(" - ")[0], endTime: s.slot.split(" - ")[1],
                        location: selectedHall?.name || "القاعة", topic: "جلسة حضورية"
                    }))
                    formData.set('hallId', selectedHallId)
                    formData.set('duration', selectedSessions.length.toString())
                    if (paymentFile) formData.append('paymentReceipt', paymentFile)
                } else if (deliveryType === 'online') {
                    const valid = onlineSessions.filter(s => s.date && s.startTime)
                    if (!valid.length) throw new Error("يجب إضافة جلسة أونلاين واحدة على الأقل")
                    const sorted = [...valid].sort((a, b) => a.date.localeCompare(b.date))
                    startDate = sorted[0].date; endDate = sorted[sorted.length - 1].date
                    sessionsPayload = valid.map(s => {
                        const start = new Date(`${s.date}T${s.startTime}`)
                        const end = new Date(start.getTime() + Number(s.duration || 60) * 60000)
                        return { date: s.date, startTime: s.startTime, endTime: end.toTimeString().substring(0, 5), location: onlineSchedule.platform || 'Online', meetingLink: onlineSchedule.meetingLink || undefined, topic: s.topic || 'جلسة أونلاين' }
                    })
                    formData.set('duration', (valid.reduce((sum, s) => sum + Number(s.duration || 60), 0) / 60).toString())
                } else {
                    startDate = courseData.startDate || new Date().toISOString().split('T')[0]
                    endDate = courseData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
                formData.set('startDate', startDate)
                formData.set('endDate', endDate)
                formData.append('sessions', JSON.stringify(sessionsPayload))
            }

            await trainerService.updateTrainerCourse(courseId, formData)
            toast.success(publishStatus === 'ACTIVE' ? "تم نشر الدورة بنجاح" : "تم تحديث الدورة بنجاح")
            router.push('/trainer/courses')
        } catch (err: any) {
            toast.error(err?.message || err?.response?.data?.message || "فشل في تحديث الدورة")
        } finally { setIsSubmitting(false) }
    }

    // ---- List helpers ----
    const addObjective = () => { if (currentObjective.trim()) { setCourseData((p: any) => ({ ...p, objectives: [...p.objectives, currentObjective.trim()] })); setCurrentObjective("") } }
    const removeObjective = (i: number) => setCourseData((p: any) => ({ ...p, objectives: p.objectives.filter((_: any, idx: number) => idx !== i) }))
    const addPrerequisite = () => { if (currentPrerequisite.trim()) { setCourseData((p: any) => ({ ...p, prerequisites: [...p.prerequisites, currentPrerequisite.trim()] })); setCurrentPrerequisite("") } }
    const removePrerequisite = (i: number) => setCourseData((p: any) => ({ ...p, prerequisites: p.prerequisites.filter((_: any, idx: number) => idx !== i) }))

    const toggleTag = (tagName: string) => {
        setCourseData((prev: any) => {
            const exists = prev.tags.includes(tagName)
            return {
                ...prev,
                tags: exists
                    ? prev.tags.filter((t: string) => t !== tagName)
                    : [...prev.tags, tagName]
            }
        })
    }

    const handleDelete = async () => {
        try { setIsSubmitting(true); await trainerService.deleteCourse(courseId); toast.success("تم حذف الدورة بنجاح"); router.push('/trainer/courses') }
        catch (err: any) { toast.error(err?.response?.data?.message || "فشل في حذف الدورة") }
        finally { setIsSubmitting(false); setShowDeleteDialog(false) }
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    if (!courseData) return null

    const isDraft = courseData.status === 'DRAFT' || courseData.status === 'draft'
    const isPendingMinimum = courseData.status === 'PENDING_MINIMUM' || courseData.status === 'pending_minimum'
    // For PENDING_MINIMUM courses, only unlock the schedule tab if minimum is reached
    const minimumReached = isPendingMinimum
        && Number(courseData.minStudents) > 0
        && Number(courseData.enrolledStudents ?? 0) >= Number(courseData.minStudents)
    const canSetupSchedule = isDraft || minimumReached

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12" dir="rtl">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600 group mb-2">
                        <Link href={`/trainer/courses/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            العودة إلى التفاصيل
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">تعديل الدورة: {courseData.title}</h1>
                    {isDraft && <Badge variant="secondary" className="mt-1">مسودة — أكمل الحجز والمواعيد لنشر الدورة</Badge>}
                    {isPendingMinimum && !minimumReached && <Badge className="mt-1 bg-purple-100 text-purple-800">بانتظار اكتمال العدد</Badge>}
                    {minimumReached && <Badge className="mt-1 bg-green-100 text-green-800">اكتمل العدد — أكمل الإعداد لتفعيل الدورة</Badge>}
                </div>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isSubmitting}><Trash2 className="mr-2 h-4 w-4" />حذف الدورة</Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl">
                        <DialogHeader className="text-right">
                            <DialogTitle className="text-lg font-bold">تأكيد الحذف</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600">
                                هل أنت متأكد من حذف هذه الدورة؟ هذا الإجراء لا يمكن التراجع عنه.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button><Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>{isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}حذف نهائي</Button></div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* PENDING_MINIMUM instructional banner */}
            {minimumReached && (
                <div className="flex items-start gap-3 rounded-xl border border-green-400/40 bg-green-50 px-4 py-3 text-sm mb-6">
                    <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-600" />
                    <div>
                        <p className="font-semibold text-green-800">🎉 اكتمل الحد الأدنى من الطلاب!</p>
                        <p className="text-green-700 text-xs mt-0.5">
                            الدورة جاهزة للتفعيل. انتقل إلى تبويب <strong>"الحجز والمواعيد"</strong> لإضافة
                            {courseData.deliveryType === 'online' ? ' الجلسات والرابط ثم اضغط "تفعيل الدورة".' : ' القاعة والمواعيد ورفع سند الدفع.'}
                        </p>
                        <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => setActiveTab('schedule')}>
                            الانتقال للإعداد ←
                        </Button>
                    </div>
                </div>
            )}

            {/* Rejection Alert */}
            {courseData.roomBooking?.status === 'rejected' && (
                <Card className="mb-8 border-red-200 bg-red-50/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-red-700"><AlertCircle className="h-5 w-5" /><h3 className="font-bold text-lg">تم رفض طلب حجز القاعة</h3></div>
                        <p className="text-red-600 font-medium text-sm mt-1">سبب الرفض: {courseData.roomBooking.rejectionReason || "لم يتم ذكر سبب محدد"}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="relative h-40 w-full md:w-64 rounded-lg border-2 border-dashed border-red-200 overflow-hidden bg-white flex items-center justify-center cursor-pointer hover:bg-red-50" onClick={() => document.getElementById('resubmit-input')?.click()}>
                                {resubmitPreview ? <img src={resubmitPreview} alt="New Receipt" className="h-full w-full object-contain" /> : <div className="flex flex-col items-center text-gray-400"><UploadCloud className="h-8 w-8 mb-2" /><span className="text-xs">إرفاق سند جديد</span></div>}
                                <input id="resubmit-input" type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) { setResubmitFile(e.target.files[0]); setResubmitPreview(URL.createObjectURL(e.target.files[0])) } }} />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="bg-white p-3 rounded border border-red-100 text-xs text-gray-600">
                                    <h5 className="font-bold flex items-center gap-1 mb-1"><Banknote className="h-3 w-3" /> بيانات الحساب البنكي:</h5>
                                    <p>المبلغ المطلوب: {courseData.roomBooking.totalPrice?.toLocaleString()} ر.ي</p>
                                </div>
                                <Button onClick={handleResubmit} disabled={!resubmitFile || isResubmitting} className="w-full md:w-auto bg-red-600 hover:bg-red-700">
                                    {isResubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                    إعادة إرسال سند الدفع
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="w-full bg-white p-2 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-50/50">
                        <TabsTrigger value="info" className="data-[state=active]:bg-white h-10">1. بيانات الدورة</TabsTrigger>
                        <TabsTrigger value="schedule" className="data-[state=active]:bg-white h-10" disabled={!canSetupSchedule}>
                            {canSetupSchedule ? "2. الحجز والمواعيد (لتفعيل الدورة)" : "2. الحجز والمواعيد"}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* ---- Tab 1: Info ---- */}
                <TabsContent value="info" className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>المعلومات الأساسية</CardTitle><CardDescription>أدخل المعلومات الأساسية للدورة</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="title">عنوان الدورة *</Label><Input id="title" value={courseData.title} onChange={e => setCourseData((p: any) => ({ ...p, title: e.target.value }))} /></div>
                            <div className="space-y-2"><Label htmlFor="shortDescription">وصف مختصر</Label><Textarea id="shortDescription" value={courseData.shortDescription} onChange={e => setCourseData((p: any) => ({ ...p, shortDescription: e.target.value }))} rows={2} /></div>
                            <div className="space-y-4">
                                <Label>صورة الدورة</Label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="relative h-32 w-48 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized /> : <div className="flex flex-col items-center text-gray-400"><Plus className="h-8 w-8 mb-2" /><span className="text-xs">إضافة صورة</span></div>}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-sm text-gray-500">تغيير صورة الدورة. يفضل JPG أو PNG بجودة عالية.</p>
                                        <div className="flex gap-2">
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>تغيير الصورة</Button>
                                            {imageFile && <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => { setImageFile(null); setImagePreview(courseData.image ? (getFileUrl(courseData.image) ?? "") : "") }}>إلغاء التغيير</Button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="description">الوصف التفصيلي</Label><Textarea id="description" value={courseData.description} onChange={e => setCourseData((p: any) => ({ ...p, description: e.target.value }))} rows={4} /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>التسعير والتواريخ</CardTitle><CardDescription>حدد سعر الدورة ومواعيدها</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>السعر (ر.ي) *</Label><Input type="number" value={courseData.price} onChange={e => setCourseData((p: any) => ({ ...p, price: e.target.value }))} /></div>
                                <div className="space-y-2"><Label>المدة (ساعة)</Label><Input type="number" value={courseData.duration} onChange={e => setCourseData((p: any) => ({ ...p, duration: e.target.value }))} /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label>الحد الأدنى للطلاب</Label>
                                    <Input type="number" value={courseData.minStudents} 
                                        onChange={e => setCourseData((p: any) => ({ ...p, minStudents: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>الحد الأقصى للطلاب</Label>
                                    <Input type="number" value={courseData.maxStudents} 
                                        onChange={e => setCourseData((p: any) => ({ ...p, maxStudents: e.target.value }))}
                                    />
                                </div>
                                {courseData.minStudents && courseData.maxStudents && Number(courseData.minStudents) > Number(courseData.maxStudents) && <p className="text-sm text-red-500 md:col-span-2 mt-1">⚠️ الحد الأدنى يجب أن يكون أقل من أو يساوي الحد الأقصى</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>أهداف الدورة</CardTitle><CardDescription>ما سيتعلمه الطلاب</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2"><Input placeholder="أدخل هدف الدورة" value={currentObjective} onChange={e => setCurrentObjective(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addObjective())} /><Button type="button" onClick={addObjective}>إضافة</Button></div>
                            {courseData.objectives?.length > 0 && <div className="space-y-2">{courseData.objectives.map((o: string, i: number) => (<div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded"><span>{o}</span><Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(i)}><X className="h-4 w-4" /></Button></div>))}</div>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>المتطلبات المسبقة</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2"><Input placeholder="مثال: معرفة أساسية في HTML" value={currentPrerequisite} onChange={e => setCurrentPrerequisite(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())} /><Button type="button" onClick={addPrerequisite}>إضافة</Button></div>
                            {courseData.prerequisites?.length > 0 && <div className="space-y-2">{courseData.prerequisites.map((p: string, i: number) => (<div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded"><span>{p}</span><Button type="button" variant="ghost" size="sm" onClick={() => removePrerequisite(i)}><X className="h-4 w-4" /></Button></div>))}</div>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">الوسوم</CardTitle>
                            <CardDescription>انقر على الوسوم لتحديدها أو إلغاء تحديدها</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map(tag => {
                                    const isSelected = courseData.tags?.includes(tag.name)
                                    return (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleTag(tag.name)}
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-150 ${
                                                isSelected
                                                    ? 'text-white border-transparent shadow-md scale-105'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                            }`}
                                            style={isSelected ? { backgroundColor: tag.color || '#6366F1', borderColor: tag.color || '#6366F1' } : {}}
                                        >
                                            {isSelected && <CheckCircle className="h-3.5 w-3.5" />}
                                            {tag.name}
                                        </button>
                                    )
                                })}
                                {availableTags.length === 0 && (
                                    <p className="text-xs text-gray-400">جاري تحميل الوسوم...</p>
                                )}
                            </div>
                            {courseData.tags?.length > 0 && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500 mb-1.5">المختار ({courseData.tags.length}):</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {courseData.tags.map((t: string) => (
                                            <Badge key={t} variant="secondary" className="text-xs">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-4 justify-between pb-4">
                        <Button variant="outline" type="button" onClick={() => router.back()}>إلغاء</Button>
                        <div className="flex gap-2">
                            {canSetupSchedule && <Button variant="outline" onClick={() => setActiveTab("schedule")}>الحجز والمواعيد ←</Button>}
                            <Button variant="outline" type="button" onClick={() => handleSubmit()} disabled={isSubmitting || Boolean(courseData.minStudents && courseData.maxStudents && Number(courseData.minStudents) > Number(courseData.maxStudents))}><Save className="mr-2 h-4 w-4" />{isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ---- Tab 2: Schedule (DRAFT only) ---- */}
                <TabsContent value="schedule" className="space-y-6">
                    {!canSetupSchedule ? (
                        <Card><CardContent className="py-12 text-center text-gray-500">
                            <AlertCircle className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                            {isPendingMinimum
                                ? <p>لا يمكن إعداد الجلسات حتى يكتمل الحد الأدنى من الطلاب المسجلين.</p>
                                : <p>لا يمكن تعديل الحجز والمواعيد إلا للدورات في حالة المسودة.</p>}
                        </CardContent></Card>
                    ) : (
                        <>
                            <Card>
                                <CardHeader><CardTitle>طريقة التقديم</CardTitle></CardHeader>
                                <CardContent>
                                    <RadioGroup value={courseData.deliveryType || ""} onValueChange={v => setCourseData((p: any) => ({ ...p, deliveryType: v }))} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50' : ''}`}><RadioGroupItem value="online" className="sr-only" /><Globe className="h-6 w-6 text-blue-600" /><span className="font-bold">أونلاين</span></label>
                                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'in_person' ? 'border-green-600 bg-green-50' : ''}`}><RadioGroupItem value="in_person" className="sr-only" /><Building className="h-6 w-6 text-green-600" /><span className="font-bold">حضوري</span></label>
                                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'capacity_based' ? 'border-purple-600 bg-purple-50' : ''}`}><RadioGroupItem value="capacity_based" className="sr-only" /><Users className="h-6 w-6 text-purple-600" /><span className="font-bold">حجز مرن</span></label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* In-Person */}
                            {courseData.deliveryType === 'in_person' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader><CardTitle>اختيار القاعة</CardTitle></CardHeader>
                                        <CardContent>
                                            {!selectedHall ? (
                                                <Button variant="outline" className="w-full justify-between h-14 border-dashed border-2 hover:bg-gray-50 hover:border-blue-500 text-gray-600" onClick={() => setIsHallDialogOpen(true)}>
                                                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> اختر قاعة التدريب لعرض المواعيد المتاحة</span>
                                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium">الاستعراض والقائمة</span>
                                                </Button>
                                            ) : (
                                                <div className="mt-2 p-5 border-2 border-blue-100 bg-blue-50/40 rounded-xl flex flex-col md:flex-row gap-5 items-start md:items-center cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setIsHallDialogOpen(true)}>
                                                    <div className="relative h-24 w-full md:w-36 rounded-lg overflow-hidden shadow-sm shrink-0 border border-gray-100">
                                                        <HallImage src={selectedHall.image} alt={selectedHall.name} className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 space-y-2 w-full">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-bold text-lg text-gray-900">{selectedHall.name}</h4>
                                                            <Badge variant="outline" className="bg-white hidden md:inline-flex">قاعة مختارة <CheckCircle className="mr-1 h-3 w-3 text-green-500 inline" /></Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm mt-1">
                                                            <span className="flex items-center gap-1.5 bg-white text-gray-700 px-2 py-1.5 rounded-md border shadow-sm"><Building className="h-4 w-4 text-purple-500" /> معهد: <strong>{selectedHall.owner}</strong></span>
                                                            <span className="flex items-center gap-1.5 bg-white text-gray-700 px-2 py-1.5 rounded-md border shadow-sm"><Users className="h-4 w-4 text-blue-500" /> السعة: <strong>{selectedHall.capacity}</strong></span>
                                                            <span className="flex items-center gap-1.5 bg-white text-gray-700 px-2 py-1.5 rounded-md border shadow-sm"><Banknote className="h-4 w-4 text-green-500" /> التكلفة: <strong>{selectedHall.hourlyRate} ر.ي/ساعة</strong></span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 hover:bg-white border w-full md:w-auto mt-2 md:mt-0" onClick={e => { e.stopPropagation(); setIsHallDialogOpen(true) }}>تغيير القاعة</Button>
                                                </div>
                                            )}
                                            <Dialog open={isHallDialogOpen} onOpenChange={setIsHallDialogOpen}>
                                                <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg font-bold">اختيار القاعة</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                                        {mappedHalls.map(hall => (
                                                            <div key={hall.id} className="border rounded-xl overflow-hidden hover:border-blue-500 transition-colors group flex flex-col bg-white">
                                                                <div className="relative h-40 bg-slate-100 group-hover:opacity-90 transition-opacity">
                                                                    <HallImage src={hall.image} alt={hall.name} className="object-cover" />
                                                                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm">{hall.type}</Badge>
                                                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm flex items-center gap-1">
                                                                            <MapPin className="h-3 w-3" /> {hall.location}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <div className="p-4 flex-1 flex flex-col">
                                                                    <h4 className="font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-1">{hall.name}</h4>
                                                                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
                                                                        <Building className="h-3 w-3 shrink-0 mt-0.5" /> <span className="line-clamp-2 leading-tight">{hall.owner}</span>
                                                                    </div>
                                                                    {hall.description && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{hall.description}</p>}
                                                                    {hall.features?.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1 mb-3">
                                                                            {hall.features.slice(0, 3).map((f: string, i: number) => <span key={i} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">{f}</span>)}
                                                                            {hall.features.length > 3 && <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">+{hall.features.length - 3}</span>}
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between items-center mb-4 text-sm text-gray-500 border-t pt-3 mt-auto">
                                                                        <span>السعة: {hall.capacity}</span>
                                                                        <span className="text-blue-600 font-medium">{hall.hourlyRate} ر.ي/ساعة</span>
                                                                    </div>
                                                                    <Button variant="outline" className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors" onClick={() => { setSelectedHallId(hall.id); setIsHallDialogOpen(false) }}>اختيار القاعة</Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {!mappedHalls.length && <div className="col-span-full py-12 text-center text-gray-500">لا توجد قاعات متاحة</div>}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>

                                    {selectedHall && (
                                        <Card>
                                            <CardHeader>
                                                <div className="flex justify-between items-center">
                                                    <CardTitle>جدول المواعيد - {monthLabel}</CardTitle>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.max(0, p - 1))} disabled={calendarOffset === 0}>السابق</Button>
                                                        <Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.min(maxMonthsAhead, p + 1))}>التالي</Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">{weekDaysShort.map(d => <div key={d}>{d}</div>)}</div>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {calendarDays.map((d, i) => {
                                                        if (!d) return <div key={i} />
                                                        const isSel = selectedDate === d.dateKey
                                                        const hasS = selectedSessions.some(s => s.date === d.dateKey)
                                                        return <button key={i} type="button" onClick={() => handleSelectDay(d.dateKey)} disabled={d.isPast} className={`h-10 rounded-lg text-sm ${isSel ? 'bg-blue-600 text-white' : d.isPast ? 'bg-gray-100 text-gray-300' : hasS ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-white border hover:bg-gray-50'}`}>{d.day}</button>
                                                    })}
                                                </div>
                                                {selectedDate && (
                                                    <div className="border-t pt-4">
                                                        <h4 className="font-semibold mb-3">الأوقات المتاحة ليوم {formatDateLabel(selectedDate)}</h4>
                                                        {isSlotsLoading ? <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
                                                            : availableSlots.length > 0 ? (
                                                                <div className="grid grid-cols-3 gap-2">{availableSlots.map(slot => { const sel = selectedSessions.some(s => s.date === selectedDate && s.slot === slot); return <button key={slot} type="button" onClick={() => toggleSlot(selectedDate, slot)} className={`p-2 text-sm rounded border ${sel ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>{slot}</button> })}</div>
                                                            ) : <p className="text-sm text-gray-500 text-center py-4">{unavailableMessage}</p>}
                                                    </div>
                                                )}
                                                {selectedSessions.length > 0 && (
                                                    <div className="space-y-4">
                                                        <div className="bg-blue-50 p-4 rounded-lg">
                                                            <div className="flex justify-between mb-2"><h4 className="font-bold text-blue-800">{selectedSessions.length} جلسات محددة</h4><span className="text-blue-900 font-bold">الإجمالي: {totalPrice.toLocaleString()} ر.ي</span></div>
                                                            <div className="flex flex-wrap gap-2">{selectedSessions.map((s, i) => <Badge key={i} variant="secondary" className="bg-white">{formatDateLabel(s.date)} ({s.slot})</Badge>)}</div>
                                                        </div>
                                                        <Card className="border-2 border-dashed border-blue-200">
                                                            <CardHeader className="pb-3">
                                                                <CardTitle className="text-base flex items-center gap-2">
                                                                    <Banknote className="h-5 w-5 text-blue-600" />
                                                                    بيانات الدفع لحجز القاعة
                                                                </CardTitle>
                                                                <CardDescription>يرجى تحويل مبلغ {totalPrice.toLocaleString()} ر.ي إلى أحد الحسابات التالية وإرفاق صورة السند أدناه</CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="space-y-6">
                                                                
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-semibold text-gray-700">الحسابات البنكية للمعهد</h4>
                                                                    {selectedHall?.bankAccounts && selectedHall.bankAccounts.length > 0 ? (
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                            {selectedHall.bankAccounts.map((bank: any) => (
                                                                                <div key={bank.id} className="relative overflow-hidden group p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100">
                                                                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600"></div>
                                                                                    <div className="flex items-center gap-3 mb-4">
                                                                                        <div className="h-10 w-10 bg-blue-50/80 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                                                                            <Landmark className="h-5 w-5" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <h5 className="font-bold text-gray-900 leading-tight">{bank.bankName}</h5>
                                                                                            <p className="text-xs text-gray-500 mt-1">{bank.accountName}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100/60">
                                                                                        <div className="flex justify-between items-center text-sm">
                                                                                            <span className="text-xs text-gray-500 font-medium">رقم الحساب</span>
                                                                                            <span className="font-mono font-semibold text-blue-900" dir="ltr">{bank.accountNumber}</span>
                                                                                        </div>
                                                                                        {bank.iban && (
                                                                                            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                                                                                                <span className="text-xs text-gray-500 font-medium">IBAN</span>
                                                                                                <span className="font-mono text-xs font-semibold text-gray-700" dir="ltr">{bank.iban}</span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg border border-dashed">
                                                                            لا توجد حسابات بنكية مضافة لهذا المعهد حالياً. يمكنك التواصل مع المعهد مباشرة.
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="relative h-48 w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden group" onClick={() => paymentInputRef.current?.click()}>
                                                                    {paymentPreview ? <><img src={paymentPreview} alt="Payment" className="h-full w-full object-contain" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Button variant="secondary" size="sm">تغيير الصورة</Button></div></> : <div className="text-center p-6"><div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3"><Plus className="h-6 w-6 text-blue-600" /></div><p className="font-medium text-gray-700">إرفاق صورة سند الدفع</p><p className="text-xs text-gray-500 mt-1">اضغط هنا لرفع الملف</p></div>}
                                                                    <input type="file" ref={paymentInputRef} className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) { setPaymentFile(e.target.files[0]); setPaymentPreview(URL.createObjectURL(e.target.files[0])) } }} />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Online */}
                            {courseData.deliveryType === 'online' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600" />منصة البث والرابط</CardTitle></CardHeader>
                                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2"><Label>منصة البث</Label><Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule({ ...onlineSchedule, platform: v })}><SelectTrigger><SelectValue placeholder="اختر المنصة" /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent></Select></div>
                                            <div className="space-y-2"><Label>رابط الاجتماع</Label><Input placeholder="https://zoom.us/j/..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule({ ...onlineSchedule, meetingLink: e.target.value })} /></div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-600" />الجلسات ({onlineSessions.length})</CardTitle><Button type="button" size="sm" variant="outline" onClick={addOnlineSession}><Plus className="h-4 w-4 mr-1" /> إضافة جلسة</Button></div></CardHeader>
                                        <CardContent className="space-y-4">
                                            {onlineSessions.map((s, idx) => (
                                                <div key={idx} className="border rounded-xl p-4 space-y-3 bg-blue-50/40">
                                                    <div className="flex justify-between items-center"><span className="font-semibold text-sm text-blue-800">جلسة {idx + 1}</span>{onlineSessions.length > 1 && <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeOnlineSession(idx)}><X className="h-4 w-4" /></Button>}</div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="space-y-1"><Label className="text-xs">التاريخ</Label><Input type="date" value={s.date} onChange={e => updateOnlineSession(idx, 'date', e.target.value)} /></div>
                                                        <div className="space-y-1"><Label className="text-xs">وقت البدء</Label><Input type="time" value={s.startTime} onChange={e => updateOnlineSession(idx, 'startTime', e.target.value)} /></div>
                                                        <div className="space-y-1"><Label className="text-xs">المدة (دقيقة)</Label><Select value={s.duration} onValueChange={v => updateOnlineSession(idx, 'duration', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">30</SelectItem><SelectItem value="45">45</SelectItem><SelectItem value="60">60</SelectItem><SelectItem value="90">90</SelectItem><SelectItem value="120">120</SelectItem><SelectItem value="180">180</SelectItem></SelectContent></Select></div>
                                                    </div>
                                                    <div className="space-y-1"><Label className="text-xs">عنوان الجلسة (اختياري)</Label><Input placeholder="مثال: المقدمة والتعريف بالمنهج" value={s.topic} onChange={e => updateOnlineSession(idx, 'topic', e.target.value)} /></div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            <div className="flex justify-between pt-6 border-t mt-8">
                                <Button variant="outline" onClick={() => setActiveTab("info")}>السابق</Button>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleSubmit('ACTIVE')} disabled={isSubmitting || !courseData.deliveryType}>
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                                        {isPendingMinimum
                                            ? 'تفعيل الدورة وإشعار الطلاب'
                                            : courseData.deliveryType === 'in_person' ? 'إرسال للمراجعة' : 'نشر الدورة'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
