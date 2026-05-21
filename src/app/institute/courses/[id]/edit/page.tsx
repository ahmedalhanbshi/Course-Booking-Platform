"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { instituteService } from "@/lib/institute-service"
import { PublicService, Tag } from "@/lib/public-service"
import { HallImage } from "@/components/halls/HallImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Send, Trash2, ArrowLeft, X, MapPin, Users, Building, Globe, Plus, CalendarDays, CheckCircle, AlertCircle, Banknote, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getFileUrl } from "@/lib/utils"

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

export default function EditInstituteCoursePage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [activeTab, setActiveTab] = useState("info")

    // Reference Data
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [trainers, setTrainers] = useState<{ id: string, name: string }[]>([])
    const [halls, setHalls] = useState<any[]>([])
    const [availableTags, setAvailableTags] = useState<Tag[]>([])

    // Add new category
    const [newCategoryInput, setNewCategoryInput] = useState("")
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)

    // Course Data
    const [courseData, setCourseData] = useState({
        title: "",
        categoryId: "",
        shortDescription: "",
        description: "",
        deliveryType: "",
        price: "",
        minStudents: "",
        maxStudents: "",
        isFree: false,
        hallId: "",
        objectives: [] as string[],
        prerequisites: [] as string[],
        tags: [] as string[],
        status: "",
        enrolledStudents: 0,
    })

    // Multi-select trainers
    const [selectedTrainerIds, setSelectedTrainerIds] = useState<string[]>([])

    // Image
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Schedule State
    const [selectedSessions, setSelectedSessions] = useState<{ date: string, slot: string }[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [calendarOffset, setCalendarOffset] = useState(0)
    const [unavailableMessage, setUnavailableMessage] = useState("")
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isSlotsLoading, setIsSlotsLoading] = useState(false)
    const [isHallDialogOpen, setIsHallDialogOpen] = useState(false)
    const [onlineSchedule, setOnlineSchedule] = useState({ platform: "", meetingLink: "" })

    type OnlineSession = { date: string; startTime: string; duration: string; topic: string }
    const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>([
        { date: "", startTime: "", duration: "60", topic: "" }
    ])

    const addOnlineSession = () => setOnlineSessions(prev => [...prev, { date: "", startTime: "", duration: "60", topic: "" }])
    const removeOnlineSession = (idx: number) => setOnlineSessions(prev => prev.filter((_, i) => i !== idx))
    const updateOnlineSession = (idx: number, field: keyof OnlineSession, value: any) =>
        setOnlineSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))

    // List helpers
    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")

    // ---- Calendar Logic ----
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const maxMonthsAhead = 5

    const formatDateLabel = (dateKey: string) => {
        const [year, month, day] = dateKey.split("-")
        return `${day}-${month}-${year}`
    }

    const monthDate = new Date(todayStart.getFullYear(), todayStart.getMonth() + calendarOffset, 1)
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const monthLabel = monthDate.toLocaleDateString("ar-SA", { month: "long", year: "numeric" })
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const calendarDays: Array<{ day: number; dateKey: string; isPast: boolean } | null> = []
    for (let i = 0; i < firstDay; i += 1) calendarDays.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const isPast = new Date(year, month, day) < todayStart
        calendarDays.push({ day, dateKey, isPast })
    }
    while (calendarDays.length % 7 !== 0) calendarDays.push(null)

    // Derived Halls
    const mappedHalls = halls.map(h => ({
        id: h.id,
        name: h.name,
        type: h.type || "قاعة تدريب",
        location: h.location || "مقر المعهد",
        capacity: h.capacity,
        hourlyRate: Number(h.pricePerHour),
        image: h.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
        features: h.facilities && h.facilities.length > 0 ? h.facilities : ["مجهزة بالكامل"],
        description: h.description || `${h.facilities?.join(' • ') || ''}`,
        owner: h.institute?.name || "المعهد",
    }))

    const selectedHall = mappedHalls.find(h => h.id === courseData.hallId)
    const totalPrice = selectedHall ? selectedHall.hourlyRate * selectedSessions.length : 0

    useEffect(() => {
        setSelectedDate(null)
        setSelectedSessions([])
        setUnavailableMessage("")
        setAvailableSlots([])
        setCalendarOffset(0)
    }, [courseData.hallId])

    // ---- Load Course Data ----
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [data, cats, trns, hls, tags] = await Promise.all([
                    instituteService.getCourseById(courseId),
                    instituteService.getCategories(),
                    instituteService.getTrainers(),
                    instituteService.getHalls(),
                    PublicService.getTags()
                ])
                setCategories(cats)
                setTrainers(trns)
                setHalls(hls)
                setAvailableTags(tags)

                setCourseData({
                    title: data.title || "",
                    categoryId: data.categoryId || "",
                    shortDescription: data.shortDescription || "",
                    description: data.description || "",
                    deliveryType: (data.deliveryType || "").toLowerCase(),
                    price: data.price?.toString() || "",
                    minStudents: data.minStudents?.toString() || "",
                    maxStudents: data.maxStudents?.toString() || "",
                    isFree: data.isFree || false,
                    hallId: data.hallId || "",
                    objectives: data.objectives || [],
                    prerequisites: data.prerequisites || [],
                    tags: data.tags || [],
                    status: data.status || "",
                    enrolledStudents: data.enrolledStudents ?? 0,
                })

                // Trainer(s)
                if (data.trainers?.length > 0) {
                    setSelectedTrainerIds(data.trainers.map((t: any) => t.id))
                } else if (data.trainer?.id) {
                    setSelectedTrainerIds([data.trainer.id])
                }

                if (data.image) setImagePreview(getFileUrl(data.image) ?? "")

                // Online sessions
                if (data.deliveryType === 'online' && data.sessions?.length > 0) {
                    const sessions = data.sessions.map((s: any) => {
                        const start = s.startTime ? new Date(s.startTime) : null
                        const end = s.endTime ? new Date(s.endTime) : null
                        const durationMins = start && end
                            ? Math.round((end.getTime() - start.getTime()) / 60000).toString()
                            : "60"
                        return {
                            date: s.date || (start ? start.toISOString().split('T')[0] : ""),
                            startTime: start ? start.toTimeString().substring(0, 5) : "",
                            duration: durationMins,
                            topic: s.topic || ""
                        }
                    })
                    if (sessions.length > 0) setOnlineSessions(sessions)
                    if (data.sessions[0]?.location) {
                        const loc = data.sessions[0].location
                        const matched = platforms.find(p => p.value === loc)
                        setOnlineSchedule({
                            platform: matched ? loc : (loc !== 'Online' ? 'other' : ''),
                            meetingLink: data.sessions[0]?.meetingLink || ""
                        })
                    }
                }

            } catch (err: any) {
                toast.error(err?.response?.data?.message || "فشل في تحميل بيانات الدورة")
                router.push('/institute/courses')
            } finally {
                setLoading(false)
            }
        }
        if (courseId) fetchData()
    }, [courseId, router])

    // ---- Add New Category ----
    const handleAddCategory = async () => {
        if (!newCategoryInput.trim()) return
        try {
            setIsCreatingCategory(true)
            const newCat = await instituteService.createCategory(newCategoryInput.trim())
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

    // ---- Image ----
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    // ---- Hall Availability ----
    const handleSelectDay = async (dateKey: string) => {
        setSelectedDate(dateKey)
        setUnavailableMessage("")
        setAvailableSlots([])
        if (!courseData.hallId) return
        setIsSlotsLoading(true)
        try {
            const data = await instituteService.getHallAvailability(courseData.hallId, dateKey)
            const [yearStr, monthStr, dayStr] = dateKey.split("-")
            const dateObj = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr))
            const dayOfWeekMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
            const dayName = dayOfWeekMap[dateObj.getDay()]
            const availabilitySlots = Array.isArray(data.availability)
                ? data.availability
                : (data.availability?.slots ?? [])
            const allowedPeriods = availabilitySlots.filter((a: any) => a.day === dayName) || []
            const hasAvailabilityDefined = availabilitySlots.length > 0
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
        } catch {
            toast.error("فشل جلب أوقات القاعة المتاحة")
        } finally {
            setIsSlotsLoading(false)
        }
    }

    const toggleSessionSlot = (date: string, slot: string) => {
        const exists = selectedSessions.some(s => s.date === date && s.slot === slot)
        if (exists) {
            setSelectedSessions(prev => prev.filter(s => !(s.date === date && s.slot === slot)))
        } else {
            setSelectedSessions(prev => [...prev, { date, slot }])
        }
    }

    // ---- Submit ----
    const handleSubmit = async (publishStatus?: 'DRAFT' | 'ACTIVE' | 'PENDING_MINIMUM') => {
        try {
            setIsSubmitting(true)

            let startDate: string = new Date().toISOString().split('T')[0]
            let endDate: string = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            let sessionsPayload: any[] = []
            let duration = "0"
            const isPublishingOrActive = publishStatus === 'ACTIVE' || isActive

            if (isPublishingOrActive) {
                if (!courseData.deliveryType) throw new Error("يجب اختيار طريقة التقديم")

                if (courseData.deliveryType === 'in_person') {
                    if (!courseData.hallId) throw new Error("يجب اختيار القاعة")
                    if (selectedSessions.length === 0) throw new Error("يجب اختيار جلسة واحدة على الأقل")
                    const sorted = [...selectedSessions].sort((a, b) => a.date.localeCompare(b.date))
                    startDate = sorted[0].date
                    endDate = sorted[sorted.length - 1].date
                    sessionsPayload = selectedSessions.map(s => ({
                        date: s.date,
                        startTime: s.slot.split(" - ")[0],
                        endTime: s.slot.split(" - ")[1],
                        location: selectedHall?.name || "القاعة المختارة",
                        topic: "جلسة حضورية"
                    }))
                    duration = selectedSessions.length.toString()

                } else if (courseData.deliveryType === 'online') {
                    const validSessions = onlineSessions.filter(s => s.date && s.startTime)
                    if (validSessions.length === 0) throw new Error("يجب إضافة جلسة واحدة على الأقل مع تحديد التاريخ والوقت")
                    const sortedDates = [...validSessions].sort((a, b) => a.date.localeCompare(b.date))
                    startDate = sortedDates[0].date
                    endDate = sortedDates[sortedDates.length - 1].date
                    sessionsPayload = validSessions.map(s => {
                        const start = new Date(`${s.date}T${s.startTime}`)
                        const end = new Date(start.getTime() + Number(s.duration || 60) * 60000)
                        return {
                            date: s.date,
                            startTime: s.startTime,
                            endTime: end.toTimeString().substring(0, 5),
                            location: onlineSchedule.platform || 'Online',
                            meetingLink: onlineSchedule.meetingLink || undefined,
                            topic: s.topic || 'جلسة أونلاين'
                        }
                    })
                    duration = (validSessions.reduce((sum, s) => sum + Number(s.duration || 60), 0) / 60).toString()
                }
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
            formData.append('isFree', courseData.isFree.toString())
            if (courseData.hallId) formData.append('hallId', courseData.hallId)
            formData.append('objectives', JSON.stringify(courseData.objectives))
            formData.append('prerequisites', JSON.stringify(courseData.prerequisites))
            formData.append('tags', JSON.stringify(courseData.tags))
            formData.append('startDate', startDate)
            formData.append('endDate', endDate)
            formData.append('duration', duration)
            formData.append('sessions', JSON.stringify(sessionsPayload))
            formData.append('trainerIds', JSON.stringify(selectedTrainerIds))
            if (publishStatus) {
                formData.append('status', publishStatus)
            } else if (isActive) {
                formData.append('status', 'ACTIVE')
            }
            if (imageFile) formData.append('image', imageFile)

            await instituteService.updateCourse(courseId, formData)
            toast.success(
                publishStatus === 'DRAFT' ? 'تم حفظ المسودة بنجاح' :
                publishStatus === 'PENDING_MINIMUM' ? 'تم نشر الدورة! ستُفعّل عند اكتمال الحد الأدنى' :
                publishStatus === 'ACTIVE' ? 'تم نشر الدورة بنجاح' :
                'تم حفظ التغييرات بنجاح'
            )
            router.push(`/institute/courses/${courseId}`)

        } catch (err: any) {
            toast.error(err.message || err?.response?.data?.message || 'حدث خطأ أثناء حفظ الدورة')
        } finally {
            setIsSubmitting(false)
        }
    }

    // ---- Delete ----
    const handleDelete = async () => {
        try {
            setIsSubmitting(true)
            await instituteService.deleteCourse(courseId)
            toast.success("تم حذف الدورة بنجاح")
            router.push('/institute/courses')
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "فشل في حذف الدورة")
        } finally {
            setIsSubmitting(false)
            setShowDeleteDialog(false)
        }
    }

    // ---- List Handlers ----
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

    const toggleTag = (tagName: string) => {
        setCourseData(prev => {
            const exists = prev.tags.includes(tagName)
            return { ...prev, tags: exists ? prev.tags.filter(t => t !== tagName) : [...prev.tags, tagName] }
        })
    }

    const toggleTrainer = (id: string) => {
        setSelectedTrainerIds(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    // ---- Schedule Tab Logic ----
    const isDraft = courseData.status === 'DRAFT' || courseData.status === 'draft'
    const isPendingMinimum = courseData.status === 'PENDING_MINIMUM' || courseData.status === 'pending_minimum'
    const isActive = courseData.status === 'ACTIVE' || courseData.status === 'active'
    const minimumReached = isPendingMinimum
        && Number(courseData.minStudents) > 0
        && Number(courseData.enrolledStudents ?? 0) >= Number(courseData.minStudents)
    const canSetupSchedule = isDraft || minimumReached

    const showOnlineSection = courseData.deliveryType === 'online'
    const showInPersonSection = courseData.deliveryType === 'in_person'

    // ---- Validation ----
    const isInfoValid = courseData.title && courseData.categoryId && courseData.description
        && courseData.price && courseData.minStudents && courseData.maxStudents
        && Number(courseData.minStudents) <= Number(courseData.maxStudents)

    const isLocationValid = () => {
        if (courseData.deliveryType === 'in_person') return !!courseData.hallId && selectedSessions.length > 0
        if (courseData.deliveryType === 'online') return onlineSessions.some(s => s.date && s.startTime)
        return true
    }

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="max-w-5xl mx-auto pb-12" dir="rtl">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600 group mb-2">
                        <Link href={`/institute/courses/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            العودة إلى التفاصيل
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">تعديل الدورة: {courseData.title}</h1>
                    <div className="flex gap-2 mt-2">
                        {isDraft && <Badge variant="secondary">مسودة — أكمل الحجز والمواعيد لنشر الدورة</Badge>}
                        {isPendingMinimum && !minimumReached && <Badge className="bg-purple-100 text-purple-800">بانتظار اكتمال العدد</Badge>}
                        {minimumReached && <Badge className="bg-green-100 text-green-800">اكتمل العدد — أكمل الإعداد لتفعيل الدورة</Badge>}
                        {isActive && <Badge className="bg-blue-100 text-blue-800">مفعّلة</Badge>}
                    </div>
                </div>

                {/* Delete Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isSubmitting}>
                            <X className="mr-2 h-4 w-4" />حذف الدورة
                        </Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl">
                        <DialogHeader className="text-right">
                            <h3 className="text-lg font-bold">تأكيد الحذف</h3>
                            <p className="text-sm text-gray-600">هل أنت متأكد من حذف هذه الدورة؟ هذا الإجراء لا يمكن التراجع عنه.</p>
                        </DialogHeader>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}حذف نهائي
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* PENDING_MINIMUM Banner */}
            {minimumReached && (
                <div className="flex items-start gap-3 rounded-xl border border-green-400/40 bg-green-50 px-4 py-3 text-sm mb-6">
                    <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-600" />
                    <div>
                        <p className="font-semibold text-green-800">🎉 اكتمل الحد الأدنى من الطلاب!</p>
                        <p className="text-green-700 text-xs mt-0.5">
                            الدورة جاهزة للتفعيل. انتقل إلى تبويب <strong>"الحجز والمواعيد"</strong> لإضافة
                            {courseData.deliveryType === 'online' ? ' الجلسات والرابط ثم اضغط "تفعيل الدورة".' : ' القاعة والمواعيد.'}
                        </p>
                        <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => setActiveTab('pricing')}>
                            الانتقال للإعداد ←
                        </Button>
                    </div>
                </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="w-full bg-white p-2 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-50/50">
                        <TabsTrigger value="info" className="data-[state=active]:bg-white h-10 gap-2">1. بيانات الدورة</TabsTrigger>
                        <TabsTrigger value="pricing" className="data-[state=active]:bg-white h-10 gap-2">
                            2. الحجز والمواعيد
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* ===== TAB 1: Info ===== */}
                <TabsContent value="info" className="space-y-6">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>المعلومات الأساسية</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label>عنوان الدورة *</Label>
                                    <Input value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} placeholder="مثال: تعلم React" />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label>الفئة *</Label>
                                    <Select
                                        value={courseData.categoryId}
                                        onValueChange={v => {
                                            if (v === '__add_new__') {
                                                setIsAddingCategory(true)
                                            } else {
                                                setCourseData({ ...courseData, categoryId: v })
                                                setIsAddingCategory(false)
                                            }
                                        }}
                                    >
                                        <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                            <SelectItem value="__add_new__" className="text-blue-600 font-medium border-t mt-1">+ إضافة تصنيف جديد</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {isAddingCategory && (
                                        <div className="flex gap-2 items-center mt-1">
                                            <Input
                                                value={newCategoryInput}
                                                onChange={e => setNewCategoryInput(e.target.value)}
                                                placeholder="اسم التصنيف الجديد..."
                                                className="h-8 text-sm"
                                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                                                autoFocus
                                            />
                                            <Button type="button" size="sm" onClick={handleAddCategory} disabled={isCreatingCategory}>
                                                {isCreatingCategory ? <Loader2 className="h-3 w-3 animate-spin" /> : 'إضافة'}
                                            </Button>
                                            <Button type="button" size="sm" variant="ghost" onClick={() => { setIsAddingCategory(false); setNewCategoryInput(''); }}>إلغاء</Button>
                                        </div>
                                    )}
                                </div>

                                {/* Short Description */}
                                <div className="space-y-2">
                                    <Label>وصف مختصر *</Label>
                                    <Textarea value={courseData.shortDescription} onChange={e => setCourseData({ ...courseData, shortDescription: e.target.value })} rows={2} />
                                </div>

                                {/* Image */}
                                <div className="space-y-4">
                                    <Label>صورة الدورة</Label>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="relative h-32 w-48 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Course Preview" fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <Plus className="h-8 w-8 mb-2" />
                                                    <span className="text-xs">إضافة صورة</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-sm text-gray-500">اختر صورة معبرة عن الدورة التدريبية. يفضل JPG أو PNG.</p>
                                            <div className="flex gap-2">
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>تغيير الصورة</Button>
                                                {imageFile && <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { setImageFile(null); setImagePreview(""); }}>إزالة</Button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Description */}
                                <div className="space-y-2">
                                    <Label>الوصف التفصيلي *</Label>
                                    <Textarea value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} rows={4} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trainers Multi-select */}
                        <Card>
                            <CardHeader><CardTitle>المدربون</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {trainers.map(t => {
                                        const isSelected = selectedTrainerIds.includes(t.id)
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => toggleTrainer(t.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                                            >
                                                {isSelected && <CheckCircle className="h-3.5 w-3.5" />}
                                                {t.name}
                                            </button>
                                        )
                                    })}
                                    {trainers.length === 0 && <p className="text-xs text-gray-400">لا يوجد مدربون متاحون</p>}
                                </div>
                                {selectedTrainerIds.length > 0 && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-xs text-gray-500 mb-1.5">المختار ({selectedTrainerIds.length}):</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedTrainerIds.map(id => {
                                                const t = trainers.find(tr => tr.id === id)
                                                return t ? <Badge key={id} variant="secondary" className="text-xs">{t.name}</Badge> : null
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card>
                            <CardHeader><CardTitle>العدد والتسعير</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>سعر الدورة (ر.ي) *</Label>
                                    <Input type="number" value={courseData.price} onChange={e => setCourseData({ ...courseData, price: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>أقل عدد مقاعد *</Label>
                                    <Input type="number" value={courseData.minStudents} onChange={e => setCourseData({ ...courseData, minStudents: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>أقصى عدد مقاعد *</Label>
                                    <Input type="number" value={courseData.maxStudents} onChange={e => setCourseData({ ...courseData, maxStudents: e.target.value })} />
                                </div>
                                {courseData.minStudents && courseData.maxStudents && Number(courseData.minStudents) > Number(courseData.maxStudents) && (
                                    <p className="text-sm text-red-500 md:col-span-3 mt-1">⚠️ الحد الأدنى يجب أن يكون أقل من أو يساوي الحد الأقصى</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Objectives / Prerequisites / Tags */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader><CardTitle className="text-base">الأهداف</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={currentObjective} onChange={e => setCurrentObjective(e.target.value)} placeholder="أضف هدف..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addObjective() } }} />
                                        <Button onClick={addObjective} size="icon"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="space-y-2">
                                        {courseData.objectives.map((o, i) => (
                                            <div key={i} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                                                <span>{o}</span>
                                                <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeObjective(i)} />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-base">المتطلبات السابقة</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={currentPrerequisite} onChange={e => setCurrentPrerequisite(e.target.value)} placeholder="أضف متطلب..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPrerequisite() } }} />
                                        <Button onClick={addPrerequisite} size="icon"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="space-y-2">
                                        {courseData.prerequisites.map((p, i) => (
                                            <div key={i} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                                                <span>{p}</span>
                                                <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removePrerequisite(i)} />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">الوسوم</CardTitle>
                                    <p className="text-xs text-gray-500 mt-1">انقر على الوسوم لتحديدها أو إلغاء تحديدها</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags.map(tag => {
                                            const isSelected = courseData.tags.includes(tag.name)
                                            return (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => toggleTag(tag.name)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-150 ${isSelected ? 'text-white border-transparent shadow-md scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                                    style={isSelected ? { backgroundColor: tag.color || '#6366F1', borderColor: tag.color || '#6366F1' } : {}}
                                                >
                                                    {isSelected && <CheckCircle className="h-3.5 w-3.5" />}
                                                    {tag.name}
                                                </button>
                                            )
                                        })}
                                        {availableTags.length === 0 && <p className="text-xs text-gray-400">جاري تحميل الوسوم...</p>}
                                    </div>
                                    {courseData.tags.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <p className="text-xs text-gray-500 mb-1.5">المختار ({courseData.tags.length}):</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {courseData.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => handleSubmit('DRAFT')}
                            disabled={isSubmitting || !isInfoValid}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            حفظ كمسودة
                        </Button>

                        <div className="flex items-center gap-3">
                            {Number(courseData.minStudents) > 1 && isDraft && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleSubmit('PENDING_MINIMUM')}
                                    disabled={isSubmitting || !isInfoValid}
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                                    نشر بانتظار الحد الأدنى
                                </Button>
                            )}
                            <Button onClick={() => handleSubmit()} disabled={isSubmitting || !isInfoValid}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                حفظ التغييرات
                            </Button>
                            <Button onClick={() => setActiveTab("pricing")} disabled={!isInfoValid} variant="outline">
                                التالي ←
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ===== TAB 2: Schedule ===== */}
                <TabsContent value="pricing" className="space-y-6">

                    {/* ─── حالة 1: دورة حضورية مفعّلة → قفل كامل ─── */}
                    {showInPersonSection && !canSetupSchedule && (
                        <Card className="border-amber-200 bg-amber-50/30">
                            <CardContent className="py-16 flex flex-col items-center justify-center text-center gap-4">
                                <div className="rounded-full bg-amber-100 p-5">
                                    <Lock className="h-10 w-10 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-amber-800">الدورة الحضورية مفعّلة</p>
                                    <p className="text-sm text-amber-600 mt-1 max-w-sm mx-auto">
                                        لا يمكن تعديل القاعة والمواعيد بعد تفعيل الدورة الحضورية حفاظاً على حجوزات الطلاب.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ─── حالة 2: دورة أونلاين → تظهر دائماً (مسودة أو مفعّلة) ─── */}
                    {showOnlineSection && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600" />منصة البث والرابط</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>منصة البث</Label>
                                            <Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule(p => ({ ...p, platform: v }))}>
                                                <SelectTrigger><SelectValue placeholder="اختر المنصة" /></SelectTrigger>
                                                <SelectContent>
                                                    {platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>رابط الاجتماع (اختياري)</Label>
                                            <Input placeholder="https://zoom.us/j/..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule(p => ({ ...p, meetingLink: e.target.value }))} dir="ltr" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" />الجلسات والمواعيد</CardTitle>
                                        <Button size="sm" variant="outline" onClick={addOnlineSession} className="gap-1 text-blue-600 border-blue-300 hover:bg-blue-50">
                                            <Plus className="h-4 w-4" />إضافة جلسة
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {onlineSessions.map((session, idx) => (
                                        <div key={idx} className="p-4 border rounded-lg space-y-3 bg-gray-50/60">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-sm text-gray-700">جلسة {idx + 1}</span>
                                                {onlineSessions.length > 1 && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeOnlineSession(idx)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">التاريخ *</Label>
                                                    <Input type="date" value={session.date} onChange={e => updateOnlineSession(idx, 'date', e.target.value)} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">وقت البدء *</Label>
                                                    <Input type="time" value={session.startTime} onChange={e => updateOnlineSession(idx, 'startTime', e.target.value)} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">المدة (دقيقة)</Label>
                                                    <Select value={session.duration?.toString() || '60'} onValueChange={v => updateOnlineSession(idx, 'duration', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {[30, 45, 60, 90, 120, 150, 180].map(d => (
                                                                <SelectItem key={d} value={d.toString()}>{d} دقيقة</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">عنوان الجلسة (اختياري)</Label>
                                                <Input placeholder="مثال: المقدمة والتعريف بالمنهج" value={session.topic} onChange={e => updateOnlineSession(idx, 'topic', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ─── حالة 3: مسودة أو اكتمل العدد → كل شيء قابل للتعديل ─── */}
                    {canSetupSchedule && (
                        <>
                            {/* Delivery Type Selector */}
                            <Card>
                                <CardHeader><CardTitle>طريقة التقديم</CardTitle></CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={courseData.deliveryType}
                                        onValueChange={v => setCourseData(prev => ({ ...prev, deliveryType: v }))}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 transition-colors ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="online" className="sr-only" />
                                            <Globe className="h-6 w-6 text-blue-600" />
                                            <span className="font-bold">أونلاين</span>
                                        </label>
                                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 transition-colors ${courseData.deliveryType === 'in_person' ? 'border-green-600 bg-green-50' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="in_person" className="sr-only" />
                                            <Building className="h-6 w-6 text-green-600" />
                                            <span className="font-bold">حضوري</span>
                                        </label>
                                        <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 transition-colors ${courseData.deliveryType === 'capacity_based' ? 'border-purple-600 bg-purple-50' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="capacity_based" className="sr-only" />
                                            <Users className="h-6 w-6 text-purple-600" />
                                            <span className="font-bold">حجز مرن</span>
                                        </label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* In-Person: Hall + Calendar */}
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

                                            {/* Hall Dialog */}
                                            <Dialog open={isHallDialogOpen} onOpenChange={setIsHallDialogOpen}>
                                                <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>اختيار القاعة</DialogTitle>
                                                        <DialogDescription>اختر قاعة من القائمة</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                                        {mappedHalls.map(hall => (
                                                            <div key={hall.id} className="border rounded-xl overflow-hidden hover:border-blue-500 transition-colors group flex flex-col bg-white">
                                                                <div className="relative h-40 bg-slate-100">
                                                                    <HallImage src={hall.image} alt={hall.name} className="object-cover" />
                                                                </div>
                                                                <div className="p-4 flex-1 flex flex-col">
                                                                    <h4 className="font-bold mb-1">{hall.name}</h4>
                                                                    <p className="text-xs text-gray-500 mb-3">{hall.owner}</p>
                                                                    <div className="flex justify-between items-center mb-4 text-sm text-gray-500 border-t pt-3 mt-auto">
                                                                        <span>السعة: {hall.capacity}</span>
                                                                        <span className="text-blue-600 font-medium">{hall.hourlyRate} ر.ي/ساعة</span>
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                                        onClick={() => {
                                                                            setCourseData(p => ({ ...p, hallId: hall.id }))
                                                                            setIsHallDialogOpen(false)
                                                                        }}
                                                                    >
                                                                        اختيار القاعة
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {mappedHalls.length === 0 && <div className="col-span-full py-12 text-center text-gray-500">لا توجد قاعات متاحة</div>}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>

                                    {selectedHall && (
                                        <Card>
                                            <CardHeader>
                                                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                                                    <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" />اختيار المواعيد — {monthLabel}</CardTitle>
                                                    <div className="flex gap-2 items-center">
                                                        {selectedSessions.length > 0 && <Badge className="bg-blue-100 text-blue-800">{selectedSessions.length} جلسة مختارة</Badge>}
                                                        <Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.max(0, p - 1))} disabled={calendarOffset === 0}>السابق</Button>
                                                        <Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => Math.min(maxMonthsAhead, p + 1))}>التالي</Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div>
                                                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                                                        {["أحد", "اثن", "ثلا", "أرب", "خم", "جم", "سبت"].map(d => <div key={d}>{d}</div>)}
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-2">
                                                        {calendarDays.map((d, i) => {
                                                            if (!d) return <div key={i} />
                                                            const isSelected = selectedDate === d.dateKey
                                                            const hasSessions = selectedSessions.some(s => s.date === d.dateKey)
                                                            return (
                                                                <button
                                                                    key={i}
                                                                    type="button"
                                                                    onClick={() => handleSelectDay(d.dateKey)}
                                                                    disabled={d.isPast}
                                                                    className={`h-10 rounded-lg text-sm transition-all ${isSelected ? 'bg-blue-600 text-white' : d.isPast ? 'bg-gray-100 text-gray-300' : hasSessions ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-white border hover:bg-gray-50'}`}
                                                                >
                                                                    {d.day}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {selectedDate && (
                                                    <div className="border-t pt-4">
                                                        <h4 className="font-semibold mb-3">الأوقات المتاحة ليوم {formatDateLabel(selectedDate)}</h4>
                                                        {isSlotsLoading ? (
                                                            <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
                                                        ) : availableSlots.length > 0 ? (
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {availableSlots.map(slot => {
                                                                    const isSel = selectedSessions.some(s => s.date === selectedDate && s.slot === slot)
                                                                    return (
                                                                        <button key={slot} type="button" onClick={() => toggleSessionSlot(selectedDate, slot)}
                                                                            className={`p-2 text-sm rounded border ${isSel ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>
                                                                            {slot}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500 text-center py-4">{unavailableMessage || "لا يوجد أوقات متاحة"}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {selectedSessions.length > 0 && (
                                                    <div className="bg-blue-50 p-4 rounded-lg">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="font-bold text-blue-800">تم اختيار {selectedSessions.length} جلسات</h4>
                                                            <span className="text-blue-900 font-bold">الإجمالي: {totalPrice.toLocaleString()} ر.ي</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedSessions.map((s, i) => (
                                                                <Badge key={i} variant="secondary" className="bg-white">{formatDateLabel(s.date)} ({s.slot})</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Online: Platform + Sessions — handled by Case 2 above to avoid duplication */}
                            {courseData.deliveryType === 'online' && false && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600" />منصة البث والرابط</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label>منصة البث</Label>
                                                    <Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule(p => ({ ...p, platform: v }))}>
                                                        <SelectTrigger><SelectValue placeholder="اختر المنصة" /></SelectTrigger>
                                                        <SelectContent>
                                                            {platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>رابط الاجتماع (اختياري)</Label>
                                                    <Input placeholder="https://zoom.us/j/..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule(p => ({ ...p, meetingLink: e.target.value }))} dir="ltr" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" />الجلسات والمواعيد</CardTitle>
                                                <Button size="sm" variant="outline" onClick={addOnlineSession} className="gap-1 text-blue-600 border-blue-300 hover:bg-blue-50">
                                                    <Plus className="h-4 w-4" />إضافة جلسة
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {onlineSessions.map((session, idx) => (
                                                <div key={idx} className="p-4 border rounded-lg space-y-3 bg-gray-50/60">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold text-sm text-gray-700">جلسة {idx + 1}</span>
                                                        {onlineSessions.length > 1 && (
                                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeOnlineSession(idx)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">التاريخ *</Label>
                                                            <Input type="date" value={session.date} onChange={e => updateOnlineSession(idx, 'date', e.target.value)} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">وقت البدء *</Label>
                                                            <Input type="time" value={session.startTime} onChange={e => updateOnlineSession(idx, 'startTime', e.target.value)} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">المدة (دقيقة)</Label>
                                                            <Select value={session.duration?.toString() || '60'} onValueChange={v => updateOnlineSession(idx, 'duration', v)}>
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    {[30, 45, 60, 90, 120, 150, 180].map(d => (
                                                                        <SelectItem key={d} value={d.toString()}>{d} دقيقة</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">عنوان الجلسة (اختياري)</Label>
                                                        <Input placeholder="مثال: المقدمة والتعريف بالمنهج" value={session.topic} onChange={e => updateOnlineSession(idx, 'topic', e.target.value)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex justify-between pt-6 border-t mt-8">
                        <Button variant="outline" onClick={() => setActiveTab("info")}>السابق</Button>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => handleSubmit()} disabled={isSubmitting} className="text-gray-600">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                حفظ التغييرات
                            </Button>
                            {(canSetupSchedule || showOnlineSection) && (
                                <Button onClick={() => handleSubmit('ACTIVE')} disabled={!isLocationValid() || isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    {isPendingMinimum ? 'تفعيل الدورة وإشعار الطلاب' : 'نشر الدورة'}
                                </Button>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
