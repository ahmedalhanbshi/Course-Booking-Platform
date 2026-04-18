"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { trainerService } from "@/lib/trainer-service"
import { HallImage } from "@/components/halls/HallImage"
import { HallCard } from "@/components/halls/HallCard"
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
import { Save, Send, Trash2, ArrowLeft, ArrowRight, X, MapPin, Users, Building, Globe, Plus, Calendar, Clock, CheckCircle, AlertCircle, Banknote, Lock, Loader2, Landmark, HelpCircle, Info } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, formatTimeRange } from "@/lib/utils"


const platforms = [
    { value: "zoom", label: "Zoom" },
    { value: "teams", label: "Microsoft Teams" },
    { value: "meet", label: "Google Meet" },
    { value: "webex", label: "Webex" },
    { value: "other", label: "أخرى" }
]

const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00"
]

const weekDaysShort = ["أحد", "اثن", "ثلا", "أرب", "خم", "جم", "سبت"]

export default function CreateCoursePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("info")

    // Reference Data State
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [halls, setHalls] = useState<any[]>([])
    const [newCategoryInput, setNewCategoryInput] = useState("")
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)

    const [courseData, setCourseData] = useState({
        title: "",
        categoryId: "",
        shortDescription: "",
        description: "",
        deliveryType: "", // in_person, online, hybrid, capacity_based (risk-free)
        price: "",
        minStudents: "",
        maxStudents: "",
        isFree: false,
        hallId: "",
        objectives: [] as string[],
        prerequisites: [] as string[],
        tags: [] as string[]
    })

    // Schedule State
    const [selectedSessions, setSelectedSessions] = useState<{ date: string, slot: string }[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [calendarOffset, setCalendarOffset] = useState(0)
    const [unavailableMessage, setUnavailableMessage] = useState("")
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isSlotsLoading, setIsSlotsLoading] = useState(false)
    const [isHallDialogOpen, setIsHallDialogOpen] = useState(false)
    const [onlineSchedule, setOnlineSchedule] = useState({
        platform: "",
        meetingLink: ""
    })

    type OnlineSession = { date: string; startTime: string; duration: string; topic: string }
    const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>([
        { date: "", startTime: "", duration: "60", topic: "" }
    ])

    const addOnlineSession = () => {
        setOnlineSessions(prev => [...prev, { date: "", startTime: "", duration: "60", topic: "" }])
    }
    const removeOnlineSession = (idx: number) => {
        setOnlineSessions(prev => prev.filter((_, i) => i !== idx))
    }
    const updateOnlineSession = (idx: number, field: keyof OnlineSession, value: string) => {
        setOnlineSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
    }

    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [paymentFile, setPaymentFile] = useState<File | null>(null)
    const [paymentPreview, setPaymentPreview] = useState<string>("")
    const paymentInputRef = useRef<HTMLInputElement>(null)

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setPaymentFile(file)
            setPaymentPreview(URL.createObjectURL(file))
        }
    }

    const handleAddCategory = async () => {
        if (!newCategoryInput.trim()) return
        try {
            setIsCreatingCategory(true)
            const newCat = await trainerService.createCategory(newCategoryInput.trim())
            setCategories(prev => [...prev.filter(c => c.id !== newCat.id), newCat].sort((a, b) => a.name.localeCompare(b.name)))
            setCourseData(prev => ({ ...prev, categoryId: newCat.id }))
            setNewCategoryInput("")
            setIsAddingCategory(false)
            toast.success(`تم إضافة التصنيف "${newCat.name}" بنجاح`)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في إضافة التصنيف")
        } finally {
            setIsCreatingCategory(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [cats, hls] = await Promise.all([
                    trainerService.getCategories(),
                    trainerService.getHalls()
                ])
                setCategories(cats)
                setHalls(hls)
            } catch (err) {
                toast.error("فشل في تحميل البيانات الأساسية")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Derived Halls for UI
    const mappedHalls = halls.map(h => ({
        id: h.id,
        name: h.name,
        type: h.type || "قاعة تدريب",
        location: h.location || "مقر المعهد",
        capacity: h.capacity,
        hourlyRate: Number(h.pricePerHour),
        image: h.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
        features: h.facilities && h.facilities.length > 0 ? h.facilities : ["مجهزة بالكامل"],
        description: h.description || `${h.facilities?.join(' • ') || 'لا يوجد وصف'}`,
        owner: h.institute?.name || "المعهد",
        bankAccounts: h.institute?.bankAccounts || []
    }))

    const selectedHall = mappedHalls.find(h => h.id === courseData.hallId)
    const totalPrice = selectedHall ? selectedHall.hourlyRate * selectedSessions.length : 0;

    // Calendar Logic
    useEffect(() => {
        setSelectedDate(null)
        setSelectedSessions([])
        setUnavailableMessage("")
        setAvailableSlots([])
        setCalendarOffset(0)
    }, [courseData.hallId])

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const maxMonthsAhead = 5

    const monthDate = new Date(todayStart.getFullYear(), todayStart.getMonth() + calendarOffset, 1)
    const monthLabel = formatDate(monthDate, { month: "long", year: "numeric" })
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay()

    const calendarDays: Array<{ day: number; dateKey: string; isPast: boolean } | null> = []
    for (let i = 0; i < firstDay; i += 1) calendarDays.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
        const dateKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const dateValue = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        const isPast = dateValue < todayStart
        calendarDays.push({ day, dateKey, isPast })
    }
    while (calendarDays.length % 7 !== 0) calendarDays.push(null)

    const handleSelectDay = async (dateKey: string) => {
        setSelectedDate(dateKey)
        setUnavailableMessage("")
        setAvailableSlots([])
        if (!courseData.hallId) return
        setIsSlotsLoading(true)
        try {
            const data = await trainerService.getHallAvailability(courseData.hallId, dateKey)
            const dateObj = new Date(dateKey)
            const dayOfWeekMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
            const dayName = dayOfWeekMap[dateObj.getDay()]
            const allowedPeriods = data.availability?.filter((a: any) => a.day === dayName) || []
            const hasAvailabilityDefined = data.availability && data.availability.length > 0
            const booked = data.bookedSessions || []
            const openSlots = timeSlots.filter(slot => {
                const [startHourStr, endHourStr] = slot.split(" - ")
                if (hasAvailabilityDefined) {
                    const isWithinWorkingHours = allowedPeriods.some((period: any) => {
                        const pStart = period.startTime.substring(0, 5)
                        const pEnd = period.endTime.substring(0, 5)
                        return startHourStr >= pStart && endHourStr <= pEnd
                    })
                    if (!isWithinWorkingHours) return false
                }
                const slotStart = new Date(`${dateKey}T${startHourStr}:00`)
                const slotEnd = new Date(`${dateKey}T${endHourStr}:00`)
                const isOverlap = booked.some((b: any) => {
                    const bStart = new Date(b.startTime)
                    const bEnd = new Date(b.endTime)
                    return slotStart < bEnd && slotEnd > bStart
                })
                return !isOverlap
            })
            setAvailableSlots(openSlots)
            if (openSlots.length === 0) setUnavailableMessage("لا يوجد أوقات متاحة في هذا اليوم أو القاعة مغلقة")
        } catch (e: any) {
            toast.error("فشل جلب أوقات القاعة المتاحة")
        } finally {
            setIsSlotsLoading(false)
        }
    }

    const toggleSessionSlot = (date: string, slot: string) => {
        const exists = selectedSessions.some((s) => s.date === date && s.slot === slot)
        if (exists) {
            setSelectedSessions(prev => prev.filter(s => !(s.date === date && s.slot === slot)))
        } else {
            setSelectedSessions(prev => [...prev, { date, slot }])
        }
    }

    // --- Submission Logic ---
    const handleSubmit = async (status: 'DRAFT' | 'ACTIVE') => {
        try {
            setIsSubmitting(true)

            // Calculate Dates
            let startDate: string, endDate: string;
            let sessionsPayload: any[] = [];

            if (status === 'DRAFT') {
                startDate = new Date().toISOString().split('T')[0];
                endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                sessionsPayload = [];
            } else if (courseData.deliveryType === 'in_person') {
                if (selectedSessions.length === 0) throw new Error("يجب اختيار جلسة واحدة على الأقل");
                if (!paymentFile) throw new Error("يجب إرفاق سند الدفع لحجز القاعة");
                const sortedSessions = [...selectedSessions].sort((a, b) => a.date.localeCompare(b.date));
                startDate = sortedSessions[0].date;
                endDate = sortedSessions[sortedSessions.length - 1].date;
                sessionsPayload = selectedSessions.map(s => ({
                    date: s.date,
                    startTime: s.slot.split(" - ")[0],
                    endTime: s.slot.split(" - ")[1],
                    location: selectedHall?.name || "القاعة المختارة",
                    topic: "عنوان الجلسة"
                }));
            } else if (courseData.deliveryType === 'online') {
                const validSessions = onlineSessions.filter(s => s.date && s.startTime)
                if (validSessions.length === 0) throw new Error("يجب إضافة جلسة واحدة على الأقل مع تحديد التاريخ والوقت");
                const sortedDates = [...validSessions].sort((a, b) => a.date.localeCompare(b.date));
                startDate = sortedDates[0].date;
                endDate = sortedDates[sortedDates.length - 1].date;
                sessionsPayload = validSessions.map(s => {
                    const start = new Date(`${s.date}T${s.startTime}`);
                    const end = new Date(start.getTime() + Number(s.duration || 60) * 60000);
                    return {
                        date: s.date,
                        startTime: s.startTime,
                        endTime: end.toTimeString().substring(0, 5),
                        location: onlineSchedule.platform || 'Online',
                        meetingLink: onlineSchedule.meetingLink || undefined,
                        topic: s.topic || 'جلسة أونلاين'
                    };
                });
            } else {
                startDate = new Date().toISOString().split('T')[0];
                endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }

            const formData = new FormData()
            formData.append('title', courseData.title)
            formData.append('categoryId', courseData.categoryId)
            formData.append('shortDescription', courseData.shortDescription)
            formData.append('description', courseData.description)
            formData.append('deliveryType', courseData.deliveryType)
            formData.append('price', courseData.price.toString())
            formData.append('minStudents', courseData.minStudents.toString())
            formData.append('maxStudents', courseData.maxStudents.toString())
            formData.append('hallId', courseData.hallId)
            formData.append('objectives', JSON.stringify(courseData.objectives))
            formData.append('prerequisites', JSON.stringify(courseData.prerequisites))
            formData.append('tags', JSON.stringify(courseData.tags))
            formData.append('status', status)
            formData.append('startDate', startDate)
            formData.append('endDate', endDate)
            formData.append('duration', (courseData.deliveryType === 'in_person' ? selectedSessions.length : (onlineSessions.reduce((sum, s) => sum + Number(s.duration || 60), 0) / 60)).toString())
            formData.append('sessions', JSON.stringify(sessionsPayload))

            if (imageFile) formData.append('image', imageFile)
            if (paymentFile) formData.append('paymentReceipt', paymentFile)

            await trainerService.createCourse(formData);
            toast.success(status === 'DRAFT' ? 'تم حفظ المسودة بنجاح' : 'تم إنشاء الدورة بنجاح');
            router.push('/trainer/courses');
        } catch (err: any) {
            toast.error(err.message || 'حدث خطأ أثناء إنشاء الدورة');
        } finally {
            setIsSubmitting(false);
        }
    }

    const addObjective = () => {
        if (currentObjective.trim()) {
            setCourseData(prev => ({ ...prev, objectives: [...prev.objectives, currentObjective.trim()] }))
            setCurrentObjective("")
        }
    }
    const removeObjective = (i: number) => setCourseData(prev => ({ ...prev, objectives: prev.objectives.filter((_, idx) => idx !== i) }))

    const addPrerequisite = () => {
        if (currentPrerequisite.trim()) {
            setCourseData(prev => ({ ...prev, prerequisites: [...prev.prerequisites, currentPrerequisite.trim()] }))
            setCurrentPrerequisite("")
        }
    }
    const removePrerequisite = (i: number) => setCourseData(prev => ({ ...prev, prerequisites: prev.prerequisites.filter((_, idx) => idx !== i) }))

    const addTag = () => {
        if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
            setCourseData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
            setCurrentTag("")
        }
    }
    const removeTag = (t: string) => setCourseData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }))

    const minS = parseInt(courseData.minStudents) || 0;
    const maxS = parseInt(courseData.maxStudents) || 0;
    const isMinGreater = (courseData.minStudents && courseData.maxStudents) ? minS > maxS : false;
    const isInfoValid = courseData.title && courseData.categoryId && courseData.description && courseData.price && courseData.minStudents && courseData.maxStudents && !!imageFile && !isMinGreater;
    const isLocationValid = () => {
        if (courseData.deliveryType === 'in_person') return !!courseData.hallId && selectedSessions.length > 0;
        if (courseData.deliveryType === 'online') return onlineSessions.some(s => s.date && s.startTime);
        return true;
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="max-w-5xl mx-auto pb-12" dir="rtl">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/trainer/courses">
                            <ArrowLeft className="mr-2 h-4 w-4" /> العودة للدورات
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء دورة تدريبية جديدة</h1>
                <p className="text-gray-600">اتبع الخطوات التالية لإنشاء ونشر دورتك التدريبية</p>
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
                        
                        <TabsTrigger value="pricing" disabled={!isInfoValid} className="flex-1 relative z-10 bg-white data-[state=active]:bg-white data-[state=active]:shadow-none border-none group px-0">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-data-[state=active]:bg-blue-600 group-data-[state=active]:text-white text-sm font-bold ring-4 ring-white transition-all shadow-sm">2</span>
                                <span className="font-bold text-gray-500 group-data-[state=active]:text-blue-700 transition-colors">حجز القاعة</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="info" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>المعلومات الأساسية</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-8 items-start mb-6 pb-6 border-b border-gray-100">
                                {/* Right Side: Image */}
                                <div className="w-full md:w-72 shrink-0 space-y-4 text-right">
                                    <Label className="text-base font-bold inline-block" dir="rtl">صورة الدورة <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                    <div className="relative h-48 w-full rounded-xl border-1 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                        {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-500"><Plus className="h-10 w-10 mb-2" /><span className="text-sm font-medium">إضافة صورة</span></div>}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                    {imageFile && <div className="flex justify-center gap-3 mt-1"><Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>تغيير</Button><Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => { setImageFile(null); setImagePreview(""); }}>إزالة</Button></div>}
                                </div>

                                {/* Left Side: Title, Category, Short Description */}
                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-base font-bold inline-block" dir="rtl">عنوان الدورة <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                        <Input value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} placeholder="مثال: تعلم React" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-bold inline-block" dir="rtl">الفئة <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                        <Select value={courseData.categoryId} onValueChange={v => v === '__add_new__' ? setIsAddingCategory(true) : (setCourseData({ ...courseData, categoryId: v }), setIsAddingCategory(false))}>
                                            <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                                            <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}<SelectItem value="__add_new__" className="text-blue-600 font-medium border-t mt-1">+ إضافة تصنيف جديد</SelectItem></SelectContent>
                                        </Select>
                                        {isAddingCategory && <div className="flex gap-2 items-center mt-1"><Input value={newCategoryInput} onChange={e => setNewCategoryInput(e.target.value)} placeholder="اسم التصنيف..." className="h-8 text-sm" onKeyDown={e => e.key === 'Enter' && handleAddCategory()} autoFocus /><Button type="button" size="sm" onClick={handleAddCategory} disabled={isCreatingCategory}>{isCreatingCategory ? <Loader2 className="h-3 w-3 animate-spin" /> : 'إضافة'}</Button><Button type="button" size="sm" variant="ghost" onClick={() => { setIsAddingCategory(false); setNewCategoryInput(''); }}>إلغاء</Button></div>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-bold inline-block" dir="rtl">وصف مختصر <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                        <Textarea value={courseData.shortDescription} onChange={e => setCourseData({ ...courseData, shortDescription: e.target.value })} rows={2} placeholder="نبذة سريعة عن الدورة..." />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-bold inline-block" dir="rtl">الوصف التفصيلي <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                <Textarea value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} rows={4} placeholder="اشرح محتوى الدورة بالتفصيل..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2">
                                    <Label className="text-base font-bold inline-block" dir="rtl">سعر الدورة (ر.ي) <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                    <Input type="number" dir="rtl" className="text-right" value={courseData.price} onChange={e => setCourseData({ ...courseData, price: e.target.value })} />
                                </div>
                                <div className="space-y-2 relative">
                                    <Label className={`text-base font-bold inline-block ${isMinGreater ? 'text-red-500' : ''}`} dir="rtl">أقل عدد مقاعد <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                    <Input type="number" min="1" dir="rtl" className={`text-right ${isMinGreater ? 'border-red-500 focus-visible:ring-red-500' : ''}`} value={courseData.minStudents} onChange={e => setCourseData({ ...courseData, minStudents: e.target.value })} />
                                    {isMinGreater && <p className="text-xs text-red-500 mt-1" dir="rtl">أقل عدد لا يمكن أن يتجاوز الأقصى!</p>}
                                </div>
                                <div className="space-y-2 relative">
                                    <Label className={`text-base font-bold inline-block ${isMinGreater ? 'text-red-500' : ''}`} dir="rtl">أقصى عدد مقاعد <span className="text-red-500 mx-1 inline-block">*</span></Label>
                                    <Input type="number" min="1" dir="rtl" className={`text-right ${isMinGreater ? 'border-red-500 focus-visible:ring-red-500' : ''}`} value={courseData.maxStudents} onChange={e => setCourseData({ ...courseData, maxStudents: e.target.value })} />
                                    {isMinGreater && <p className="text-xs text-red-500 mt-1" dir="rtl">أقصى عدد يجب أن يكون أكبر من الأدنى!</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card><CardHeader><CardTitle className="text-base">الأهداف</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2 w-full" dir="rtl"><Input value={currentObjective} onChange={e => setCurrentObjective(e.target.value)} placeholder="أضف هدف..." onKeyDown={e => e.key === 'Enter' && addObjective()} /><Button type="button" onClick={addObjective} size="icon"><Plus className="h-4 w-4" /></Button></div><div className="space-y-2">{courseData.objectives.map((o, i) => (<div key={i} className="flex items-center justify-between w-full p-2 bg-gray-50 rounded text-sm" dir="rtl"><span>{o}</span><button type="button" onClick={() => removeObjective(i)} className="text-red-500 hover:text-red-700 transition-colors"><X className="h-4 w-4" /></button></div>))}</div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">المتطلبات السابقة</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2 w-full" dir="rtl"><Input value={currentPrerequisite} onChange={e => setCurrentPrerequisite(e.target.value)} placeholder="أضف متطلب..." onKeyDown={e => e.key === 'Enter' && addPrerequisite()} /><Button type="button" onClick={addPrerequisite} size="icon"><Plus className="h-4 w-4" /></Button></div><div className="space-y-2">{courseData.prerequisites.map((p, i) => (<div key={i} className="flex items-center justify-between w-full p-2 bg-gray-50 rounded text-sm" dir="rtl"><span>{p}</span><button type="button" onClick={() => removePrerequisite(i)} className="text-red-500 hover:text-red-700 transition-colors"><X className="h-4 w-4" /></button></div>))}</div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">الوسوم</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2 w-full" dir="rtl"><Input value={currentTag} onChange={e => setCurrentTag(e.target.value)} placeholder="أضف وسم..." onKeyDown={e => e.key === 'Enter' && addTag()} /><Button type="button" onClick={addTag} size="icon"><Plus className="h-4 w-4" /></Button></div><div className="flex flex-wrap gap-2" dir="rtl">{courseData.tags.map(t => (<Badge key={t} variant="secondary" className="flex items-center gap-1" dir="rtl"><span>{t}</span><button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-red-500"><X className="h-3 w-3" /></button></Badge>))}</div></CardContent></Card>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t mt-8" dir="rtl">
                        <Button variant="ghost" onClick={() => handleSubmit('DRAFT')} disabled={isSubmitting || !isInfoValid} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border">
                            <Save className="h-4 w-4" />
                            <span>حفظ كمسودة</span>
                        </Button>
                        <Button onClick={() => setActiveTab("pricing")} disabled={!isInfoValid} className="flex items-center gap-2 px-6">
                            <span>التالي</span>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6" dir="rtl">
                    <Card><CardHeader><CardTitle className="text-right flex items-center justify-start gap-2 border-b pb-4"><Globe className="h-5 w-5 text-blue-600" />طريقة التقديم</CardTitle></CardHeader><CardContent><RadioGroup value={courseData.deliveryType} onValueChange={v => setCourseData({ ...courseData, deliveryType: v })} className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50' : ''}`}><RadioGroupItem value="online" className="sr-only" /><Globe className="h-6 w-6 text-blue-600" /><span className="font-bold">أونلاين</span></label>
                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'in_person' ? 'border-green-600 bg-green-50' : ''}`}><RadioGroupItem value="in_person" className="sr-only" /><Building className="h-6 w-6 text-green-600" /><span className="font-bold">حضوري</span></label>
                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 ${courseData.deliveryType === 'capacity_based' ? 'border-purple-600 bg-purple-50' : ''}`}><RadioGroupItem value="capacity_based" className="sr-only" /><Users className="h-6 w-6 text-purple-600" /><span className="font-bold">حجز مرن</span></label>
                    </RadioGroup>
                    
                    {courseData.deliveryType === 'capacity_based' && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300" dir="rtl">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                <Info className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="text-right">
                                <h4 className="font-bold text-purple-900 mb-1">ما هو الحجز المرن؟</h4>
                                <p className="text-sm text-purple-800/80 leading-relaxed">
                                    خيار الحجز المرن يمنحك التواجد في قاعات المعاهد الحقيقية مع دفع تكاليف الساعات التي تختارها فقط. لا حاجة لحجز القاعة لفترة طويلة، بل تختار أيامك وساعاتك بدقة وتدفع مقابل استخدامك الفعلي، مما يقلل المخاطر المالية ويمنحك مرونة قصوى.
                                </p>
                            </div>
                        </div>
                    )}
                    </CardContent></Card>

                    {courseData.deliveryType === 'in_person' && (<div className="space-y-6">
                        <Card><CardHeader><CardTitle className="text-right flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600" />اختيار القاعة</CardTitle></CardHeader><CardContent>
                            {!selectedHall ? (<Button variant="outline" className="w-full justify-between h-14 border-dashed border-2 hover:bg-gray-50 text-gray-600" onClick={() => setIsHallDialogOpen(true)} dir="rtl"><span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> اختر قاعة التدريب لعرض المواعيد المتاحة</span><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium">الاستعراض والقائمة</span></Button>) : (
                                <div className="mt-2 p-5 border-2 border-blue-100 bg-blue-50/40 rounded-xl flex flex-col md:flex-row gap-5 items-start md:items-center cursor-pointer" onClick={() => setIsHallDialogOpen(true)}>
                                    <div className="relative h-24 w-full md:w-36 rounded-lg overflow-hidden shadow-sm shrink-0 border"><HallImage src={selectedHall.image} alt="Hall" className="object-cover" /></div>
                                    <div className="flex-1 space-y-2 w-full"><div className="flex items-center justify-between"><h4 className="font-bold text-lg text-gray-900">{selectedHall.name}</h4><Badge variant="outline" className="bg-white">قاعة مختارة <CheckCircle className="ml-1 h-3 w-3 text-green-500 inline" /></Badge></div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm mt-1"><span className="flex items-center gap-1.5 bg-white text-gray-700 px-2 py-1.5 rounded-md border text-right"><Building className="h-4 w-4 text-purple-500" /> معهد: <strong>{selectedHall.owner}</strong> </span><span className="flex items-center gap-1.5 bg-white text-gray-700 px-2 py-1.5 rounded-md border"><Users className="h-4 w-4 text-blue-500" /> السعة: <strong>{selectedHall.capacity}</strong> </span><span className="flex items-center gap-1.5 bg-white text-gray-700 px-2 py-1.5 rounded-md border"><Banknote className="h-4 w-4 text-green-500" /> التكلفة: <strong><Price value={selectedHall.hourlyRate} currency="ر.ي/ساعة" /></strong></span></div></div>
                                    <Button variant="ghost" size="sm" className="text-gray-500 border bg-white" onClick={(e) => { e.stopPropagation(); setIsHallDialogOpen(true); }}>تغيير القاعة</Button>
                                </div>)}
                            <Dialog open={isHallDialogOpen} onOpenChange={setIsHallDialogOpen}><DialogContent className="max-w-4xl h-[80vh] overflow-y-auto"><DialogHeader className="sr-only"><DialogTitle>اختيار القاعة</DialogTitle><DialogDescription>اختر قاعة من القائمة</DialogDescription></DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 items-start">
                                    {mappedHalls.map((hall) => (
                                        <HallCard 
                                            key={hall.id} 
                                            hall={hall} 
                                            onSelect={(id) => {
                                                setCourseData(p => ({ ...p, hallId: id }));
                                                setIsHallDialogOpen(false);
                                            }}
                                        />
                                    ))}
                                </div></DialogContent></Dialog>
                        </CardContent></Card>
                        {selectedHall && (<Card><CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-600" />جدول المواعيد - {monthLabel}</CardTitle><div className="flex gap-2" dir="rtl"><Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.max(0, p - 1))} disabled={calendarOffset === 0} className="flex items-center gap-1">السابق <ArrowRight className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.min(maxMonthsAhead, p + 1))} className="flex items-center gap-1">التالي <ArrowLeft className="h-4 w-4" /></Button></div></div></CardHeader><CardContent className="space-y-6">
                            <div><div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">{weekDaysShort.map(d => <div key={d}>{d}</div>)}</div><div className="grid grid-cols-7 gap-2">{calendarDays.map((d, i) => { if (!d) return <div key={i} />; const isSelected = selectedDate === d.dateKey; const hasSessions = selectedSessions.some(s => s.date === d.dateKey); return (<button key={i} type="button" onClick={() => handleSelectDay(d.dateKey)} disabled={d.isPast} className={`h-10 rounded-lg text-sm transition-all ${isSelected ? 'bg-blue-600 text-white' : d.isPast ? 'bg-gray-100 text-gray-300' : hasSessions ? 'bg-blue-100 text-blue-800 border-blue-200 border' : 'bg-white border hover:bg-gray-50'}`}>{d.day}</button>); })}</div></div>
                            {selectedDate && (<div className="border-t pt-4" dir="rtl"><h4 className="font-semibold mb-3 text-right">الأوقات المتاحة ليوم {formatDateLabel(selectedDate)}</h4>{isSlotsLoading ? (<div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>) : availableSlots.length > 0 ? (<div className="grid grid-cols-3 gap-2">{availableSlots.map(slot => { const isSelected = selectedSessions.some(s => s.date === selectedDate && s.slot === slot); return (<button key={slot} type="button" onClick={() => toggleSessionSlot(selectedDate, slot)} className={`p-2 text-sm rounded border ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>{formatTimeRange(slot)}</button>); })}</div>) : (<p className="text-sm text-gray-500 text-center py-4">{unavailableMessage || "لا يوجد أوقات متاحة"}</p>)}</div>)}
                            {selectedSessions.length > 0 && (<div className="space-y-4" dir="rtl"><div className="bg-blue-50 p-4 rounded-lg"><div className="flex justify-between items-center mb-3"><h4 className="font-bold text-blue-800">تم اختيار {selectedSessions.length} جلسات</h4><div className="text-blue-900 font-bold">الإجمالي: <Price value={totalPrice.toLocaleString()} className="text-blue-900 font-bold" /></div></div><div className="flex flex-wrap gap-2">{selectedSessions.map((s, i) => (<Badge key={i} variant="secondary" className="bg-white">{formatDateLabel(s.date)} ({formatTimeRange(s.slot)})</Badge>))}</div></div>
                                <Card className="border-2 border-dashed border-blue-200"><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Banknote className="h-5 w-5 text-blue-600" />بيانات الدفع لحجز القاعة</CardTitle><CardDescription className="text-right">يرجى تحويل مبلغ <Price value={totalPrice.toLocaleString()} /> إلى أحد الحسابات وإرفاق السند</CardDescription></CardHeader><CardContent className="space-y-6"><div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 text-right">الحسابات البنكية للمعهد</h4>{selectedHall?.bankAccounts && selectedHall.bankAccounts.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{selectedHall.bankAccounts.map((bank: any) => (<div key={bank.id} className="relative overflow-hidden group p-4 border rounded-xl bg-white shadow-sm border-gray-100" dir="rtl"><div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600"></div><div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0"><Landmark className="h-5 w-5" /></div><div className="text-right"><h5 className="font-bold text-gray-900 leading-tight">{bank.bankName}</h5><p className="text-xs text-gray-500 mt-1">{bank.accountName}</p></div></div><div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100/60"><div className="flex justify-between items-center text-sm"><span className="text-xs text-gray-500 font-medium">رقم الحساب</span><span className="font-mono font-semibold text-blue-900" dir="ltr">{bank.accountNumber}</span></div>{bank.iban && (<div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200"><span className="text-xs text-gray-500 font-medium">IBAN</span><span className="font-mono text-xs font-semibold text-gray-700" dir="ltr">{bank.iban}</span></div>)}</div></div>))}</div>) : (<div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg text-right">لا توجد حسابات مضافة لهذا المعهد حالياً.</div>)}
                                </div><div className="relative h-48 w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden" onClick={() => paymentInputRef.current?.click()}>{paymentPreview ? (<><Image src={paymentPreview} alt="Receipt" fill className="object-contain" /><div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><Button variant="secondary" size="sm">تغيير الصورة</Button></div></>) : (<div className="text-center p-6"><div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3"><Plus className="h-6 w-6 text-blue-600" /></div><p className="font-medium text-gray-700">إرفاق صورة سند الدفع</p></div>)}<input type="file" ref={paymentInputRef} className="hidden" accept="image/*" onChange={handlePaymentChange} /></div><div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 text-right"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><p>سيتم مراجعة طلب حجز القاعة وتأكيده من قبل إدارة المعهد قبل تفعيل الدورة بشكل نهائي.</p></div></CardContent></Card></div>)}
                        </CardContent></Card>
                    )}</div>)}

                    {courseData.deliveryType === 'online' && (<div className="space-y-6" dir="rtl">
                        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-right"><Globe className="h-5 w-5 text-blue-600" />منصة البث والرابط</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2 text-right"><Label className="text-right block">منصة البث</Label><Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule({ ...onlineSchedule, platform: v })} dir="rtl"><SelectTrigger className="text-right"><SelectValue placeholder="اختر المنصة" /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.value} value={p.value} className="text-right">{p.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2 text-right"><Label className="text-right block">رابط الاجتماع (Meeting Link)</Label><Input placeholder="https://zoom.us/j/..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule({ ...onlineSchedule, meetingLink: e.target.value })} className="text-right" dir="ltr" /></div></CardContent></Card>
                        <Card><CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2 text-right"><Calendar className="h-5 w-5 text-blue-600" />الجلسات ({onlineSessions.length})</CardTitle><Button type="button" size="sm" variant="outline" onClick={addOnlineSession} className="flex items-center gap-2"><Plus className="h-4 w-4" /> <span>إضافة جلسة</span></Button></div></CardHeader><CardContent className="space-y-4">{onlineSessions.map((session, idx) => (<div key={idx} className="border rounded-xl p-4 space-y-3 bg-blue-50/40 relative text-right"><div className="flex justify-between items-center"><span className="font-semibold text-sm text-blue-800">جلسة {idx + 1}</span>{onlineSessions.length > 1 && (<Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeOnlineSession(idx)}><X className="h-4 w-4" /></Button>)}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="space-y-1 text-right"><Label className="text-xs">التاريخ</Label><Input type="date" value={session.date} onChange={e => updateOnlineSession(idx, 'date', e.target.value)} className="text-right" /></div><div className="space-y-1 text-right"><Label className="text-xs">وقت البدء</Label><Input type="time" value={session.startTime} onChange={e => updateOnlineSession(idx, 'startTime', e.target.value)} className="text-right" /></div><div className="space-y-1 text-right"><Label className="text-xs">المدة (دقيقة)</Label><Select value={session.duration} onValueChange={v => updateOnlineSession(idx, 'duration', v)} dir="rtl"><SelectTrigger className="text-right"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="30" className="text-right">30 دقيقة</SelectItem><SelectItem value="45" className="text-right">45 دقيقة</SelectItem><SelectItem value="60" className="text-right">60 دقيقة</SelectItem><SelectItem value="90" className="text-right">90 دقيقة</SelectItem><SelectItem value="120" className="text-right">120 دقيقة</SelectItem><SelectItem value="180" className="text-right">180 دقيقة</SelectItem></SelectContent></Select></div></div><div className="space-y-1 text-right"><Label className="text-xs">عنوان الجلسة (اختياري)</Label><Input placeholder="مثال: المقدمة" value={session.topic} onChange={e => updateOnlineSession(idx, 'topic', e.target.value)} className="text-right" /></div></div>))}</CardContent></Card>
                    </div>)}

                    <div className="flex justify-between items-center pt-6 border-t mt-8" dir="rtl">
                        <Button variant="outline" onClick={() => setActiveTab("info")} className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            <span>السابق</span>
                        </Button>
                        <Button onClick={() => handleSubmit('ACTIVE')} disabled={!isLocationValid() || isSubmitting} className="flex items-center gap-2 px-8">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            <span>{courseData.deliveryType === 'in_person' ? 'إرسال للمراجعة' : 'نشر الدورة'}</span>
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
