"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { instituteService } from "@/lib/institute-service"
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
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00"
]
const weekDaysShort = ["أحد", "اثن", "ثلا", "أرب", "خم", "جم", "سبت"]

export default function CreateInstituteCoursePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("info")

    // Reference Data State
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [halls, setHalls] = useState<any[]>([])
    const [trainers, setTrainers] = useState<{ id: string, name: string }[]>([])
    const [newCategoryInput, setNewCategoryInput] = useState("")
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const [selectedTrainerIds, setSelectedTrainerIds] = useState<string[]>([])
    const [trainerDropdownOpen, setTrainerDropdownOpen] = useState(false)

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
    const [onlineSchedule, setOnlineSchedule] = useState({ platform: "", meetingLink: "" })

    type OnlineSession = { date: string; startTime: string; duration: string; topic: string }
    const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>([
        { date: "", startTime: "", duration: "60", topic: "" }
    ])

    const addOnlineSession = () => setOnlineSessions(prev => [...prev, { date: "", startTime: "", duration: "60", topic: "" }])
    const removeOnlineSession = (idx: number) => setOnlineSessions(prev => prev.filter((_, i) => i !== idx))
    const updateOnlineSession = (idx: number, field: keyof OnlineSession, value: string) =>
        setOnlineSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))

    const [currentObjective, setCurrentObjective] = useState("")
    const [currentPrerequisite, setCurrentPrerequisite] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAddCategory = async () => {
        if (!newCategoryInput.trim()) return
        try {
            setIsCreatingCategory(true)
            const newCat = await instituteService.createCategory(newCategoryInput.trim())
            setCategories(prev => [...prev.filter(c => c.id !== newCat.id), newCat].sort((a, b) => a.name.localeCompare(b.name)))
            setCourseData(prev => ({ ...prev, categoryId: newCat.id }))
            setNewCategoryInput("")
            setIsAddingCategory(false)
            toast.success("تم إضافة التصنيف بنجاح")
        } catch (err: any) {
            toast.error("فشل في إضافة التصنيف")
        } finally { setIsCreatingCategory(false) }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [cats, hls, trs] = await Promise.all([
                    instituteService.getCategories(),
                    instituteService.getHalls(),
                    instituteService.getTrainers()
                ])
                setCategories(cats); setHalls(hls); setTrainers(trs)
            } catch (err) {
                toast.error("فشل في تحميل البيانات")
            } finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const mappedHalls = halls.map(h => ({
        id: h.id, name: h.name, type: h.type || "قاعة تدريب", location: h.location || "مقر المعهد",
        capacity: h.capacity, hourlyRate: Number(h.pricePerHour),
        image: h.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
        features: h.facilities?.length > 0 ? h.facilities : ["مجهزة بالكامل"], owner: h.institute?.name || "المعهد"
    }))

    const selectedHall = mappedHalls.find(h => h.id === courseData.hallId)
    const totalPrice = selectedHall ? selectedHall.hourlyRate * selectedSessions.length : 0;

    useEffect(() => { setSelectedDate(null); setSelectedSessions([]); setAvailableSlots([]); setCalendarOffset(0) }, [courseData.hallId])

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
        if (!courseData.hallId) return
        setIsSlotsLoading(true)
        try {
            const data = await instituteService.getHallAvailability(courseData.hallId, dateKey)
            const dateObj = new Date(dateKey)
            const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][dateObj.getDay()]
            const allowedPeriods = data.availability?.filter((a: any) => a.day === dayName) || []
            const hasAv = data.availability?.length > 0
            const booked = data.bookedSessions || []
            const open = timeSlots.filter(slot => {
                const [s, e] = slot.split(" - ")
                if (hasAv && !allowedPeriods.some((p: any) => s >= p.startTime.substring(0, 5) && e <= p.endTime.substring(0, 5))) return false
                const slotS = new Date(`${dateKey}T${s}:00`), slotE = new Date(`${dateKey}T${e}:00`)
                return !booked.some((b: any) => slotS < new Date(b.endTime) && slotE > new Date(b.startTime))
            })
            setAvailableSlots(open)
            if (open.length === 0) setUnavailableMessage("لا يوجد أوقات متاحة")
        } catch { toast.error("فشل جلب الأوقات") } finally { setIsSlotsLoading(false) }
    }

    const toggleSessionSlot = (date: string, slot: string) => {
        const ex = selectedSessions.some(s => s.date === date && s.slot === slot)
        setSelectedSessions(prev => ex ? prev.filter(s => !(s.date === date && s.slot === slot)) : [...prev, { date, slot }])
    }

    const handleSubmit = async (status: 'DRAFT' | 'ACTIVE') => {
        try {
            setIsSubmitting(true)
            let start: string, end: string, sessions: any[] = []

            if (status === 'DRAFT') {
                start = new Date().toISOString().split('T')[0]; end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            } else if (courseData.deliveryType === 'in_person') {
                if (selectedSessions.length === 0) throw new Error("اختر جلسة")
                const sorted = [...selectedSessions].sort((a, b) => a.date.localeCompare(b.date))
                start = sorted[0].date; end = sorted[sorted.length - 1].date
                sessions = selectedSessions.map(s => ({ date: s.date, startTime: s.slot.split(" - ")[0], endTime: s.slot.split(" - ")[1], location: selectedHall?.name || "القاعة", topic: "جلسة حضورية" }))
            } else if (courseData.deliveryType === 'online') {
                const valid = onlineSessions.filter(s => s.date && s.startTime)
                if (valid.length === 0) throw new Error("أضف جلسة")
                const sorted = [...valid].sort((a, b) => a.date.localeCompare(b.date))
                start = sorted[0].date; end = sorted[sorted.length - 1].date
                sessions = valid.map(s => {
                    const st = new Date(`${s.date}T${s.startTime}`), et = new Date(st.getTime() + Number(s.duration) * 60000)
                    return { date: s.date, startTime: s.startTime, endTime: et.toTimeString().substring(0, 5), location: onlineSchedule.platform || 'Online', meetingLink: onlineSchedule.meetingLink, topic: s.topic || 'أونلاين' }
                })
            } else {
                start = new Date().toISOString().split('T')[0]; end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }

            const formData = new FormData()
            Object.entries(courseData).forEach(([k, v]) => { if (k === 'objectives' || k === 'prerequisites' || k === 'tags') formData.append(k, JSON.stringify(v)); else formData.append(k, String(v)) })
            formData.append('trainerIds', JSON.stringify(selectedTrainerIds))
            formData.append('status', status); formData.append('startDate', start); formData.append('endDate', end); formData.append('sessions', JSON.stringify(sessions))
            formData.append('duration', (courseData.deliveryType === 'in_person' ? selectedSessions.length : (onlineSessions.reduce((sum, s) => sum + Number(s.duration), 0) / 60)).toString())
            if (imageFile) formData.append('image', imageFile)

            await instituteService.createCourse(formData)
            toast.success("تم إنشاء الدورة")
            router.push('/institute/courses')
        } catch (err: any) { toast.error(err.message || 'خطأ') } finally { setIsSubmitting(false) }
    }

    const addObjective = () => { if (currentObjective.trim()) { setCourseData(p => ({ ...p, objectives: [...p.objectives, currentObjective.trim()] })); setCurrentObjective("") } }
    const addPrerequisite = () => { if (currentPrerequisite.trim()) { setCourseData(p => ({ ...p, prerequisites: [...p.prerequisites, currentPrerequisite.trim()] })); setCurrentPrerequisite("") } }
    const addTag = () => { if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) { setCourseData(p => ({ ...p, tags: [...p.tags, currentTag.trim()] })); setCurrentTag("") } }

    const isInfoValid = courseData.title && courseData.categoryId && courseData.price && courseData.minStudents && courseData.maxStudents && !!imageFile
    const isLocValid = () => courseData.deliveryType === 'in_person' ? (!!courseData.hallId && selectedSessions.length > 0) : (courseData.deliveryType === 'online' ? onlineSessions.some(s => s.date && s.startTime) : true)

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="max-w-5xl mx-auto pb-12" dir="rtl">
            <h1 className="text-3xl font-bold mb-8">إنشاء دورة تدريبية (معهد)</h1>
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
                                <span className="font-bold text-gray-500 group-data-[state=active]:text-blue-700 transition-colors">الحجز والمواعيد</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="info" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>المعلومات الأساسية</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start mb-6 pb-6 border-b">
                                <div className="w-full md:w-72 space-y-4">
                                    <Label className="font-bold">صورة الدورة *</Label>
                                    <div className="relative h-48 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <Plus className="h-10 w-10 text-gray-400" />}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                </div>
                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-2"><Label className="font-bold">عنوان الدورة *</Label><Input value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} /></div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">الفئة *</Label>
                                        <Select value={courseData.categoryId} onValueChange={v => v === '__add_new__' ? setIsAddingCategory(true) : setCourseData({ ...courseData, categoryId: v })}>
                                            <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                                            <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}<SelectItem value="__add_new__">+ إضافة تصنيف</SelectItem></SelectContent>
                                        </Select>
                                        {isAddingCategory && <div className="flex gap-2 mt-1"><Input value={newCategoryInput} onChange={e => setNewCategoryInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCategory()} /><Button onClick={handleAddCategory}>إضافة</Button></div>}
                                    </div>
                                    <div className="space-y-2"><Label className="font-bold">وصف مختصر *</Label><Textarea value={courseData.shortDescription} onChange={e => setCourseData({ ...courseData, shortDescription: e.target.value })} rows={2} /></div>
                                </div>
                            </div>

                            <div className="space-y-2"><Label className="font-bold">الوصف التفصيلي *</Label><Textarea value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} rows={4} /></div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2"><Label className="font-bold">سعر الدورة *</Label><Input type="number" value={courseData.price} onChange={e => setCourseData({ ...courseData, price: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="font-bold">أقل عدد *</Label><Input type="number" value={courseData.minStudents} onChange={e => setCourseData({ ...courseData, minStudents: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="font-bold">أقصى عدد *</Label><Input type="number" value={courseData.maxStudents} onChange={e => setCourseData({ ...courseData, maxStudents: e.target.value })} /></div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold">المدربون *</Label>
                                <div className="relative">
                                    <button type="button" onClick={() => setTrainerDropdownOpen(!trainerDropdownOpen)} className="w-full border rounded-md px-3 py-2 text-right bg-white">{selectedTrainerIds.length === 0 ? "اختر مدرباً..." : `تم اختيار ${selectedTrainerIds.length} مدربين`}</button>
                                    {trainerDropdownOpen && <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">{trainers.map(t => <label key={t.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={selectedTrainerIds.includes(t.id)} onChange={() => setSelectedTrainerIds(p => p.includes(t.id) ? p.filter(id => id !== t.id) : [...p, t.id])} /> {t.name}</label>)}</div>}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">{selectedTrainerIds.map(id => <Badge key={id} variant="secondary">{trainers.find(t => t.id === id)?.name} <X className="h-3 w-3 inline cursor-pointer" onClick={() => setSelectedTrainerIds(p => p.filter(i => i !== id))} /></Badge>)}</div>
                            </div>
                        </CardContent>
                    </Card>



                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card><CardHeader><CardTitle className="text-base">الأهداف</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2"><Input value={currentObjective} onChange={e => setCurrentObjective(e.target.value)} /><Button size="icon" onClick={addObjective}><Plus className="h-4 w-4" /></Button></div><div className="space-y-1">{courseData.objectives.map((o, i) => (<div key={i} className="flex justify-between bg-gray-50 p-2 rounded text-sm"><span>{o}</span><X className="h-4 w-4 text-red-500 cursor-pointer" onClick={() => setCourseData(p => ({ ...p, objectives: p.objectives.filter((_, idx) => idx !== i) }))} /></div>))}</div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">المتطلبات</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2"><Input value={currentPrerequisite} onChange={e => setCurrentPrerequisite(e.target.value)} /><Button size="icon" onClick={addPrerequisite}><Plus className="h-4 w-4" /></Button></div><div className="space-y-1">{courseData.prerequisites.map((o, i) => (<div key={i} className="flex justify-between bg-gray-50 p-2 rounded text-sm"><span>{o}</span><X className="h-4 w-4 text-red-500 cursor-pointer" onClick={() => setCourseData(p => ({ ...p, prerequisites: p.prerequisites.filter((_, idx) => idx !== i) }))} /></div>))}</div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">الوسوم</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2"><Input value={currentTag} onChange={e => setCurrentTag(e.target.value)} /><Button size="icon" onClick={addTag}><Plus className="h-4 w-4" /></Button></div><div className="flex flex-wrap gap-2">{courseData.tags.map(t => (<Badge key={t} variant="secondary">{t} <X className="h-3 w-3 inline cursor-pointer" onClick={() => setCourseData(p => ({ ...p, tags: p.tags.filter(i => i !== t) }))} /></Badge>))}</div></CardContent></Card>
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
                    <Card><CardHeader><CardTitle className="text-right flex items-center gap-2 border-b pb-4"><Globe className="h-5 w-5 text-blue-500" />طريقة التقديم</CardTitle></CardHeader><CardContent><RadioGroup value={courseData.deliveryType} onValueChange={v => setCourseData({ ...courseData, deliveryType: v })} className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
                        <label className={`border rounded p-4 flex flex-col items-center cursor-pointer ${courseData.deliveryType === 'online' ? 'bg-blue-50 border-blue-500' : ''}`}><RadioGroupItem value="online" className="sr-only" /><Globe className="h-6 w-6 text-blue-500" />أونلاين</label>
                        <label className={`border rounded p-4 flex flex-col items-center cursor-pointer ${courseData.deliveryType === 'in_person' ? 'bg-green-50 border-green-500' : ''}`}><RadioGroupItem value="in_person" className="sr-only" /><Building className="h-6 w-6 text-green-500" />حضوري</label>
                        <label className={`border rounded p-4 flex flex-col items-center cursor-pointer ${courseData.deliveryType === 'capacity_based' ? 'bg-purple-50 border-purple-500' : ''}`}><RadioGroupItem value="capacity_based" className="sr-only" /><Users className="h-6 w-6 text-purple-500" />حجز مرن</label>
                    </RadioGroup>
                    
                    {courseData.deliveryType === 'capacity_based' && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300" dir="rtl">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                <Info className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="text-right">
                                <h4 className="font-bold text-purple-900 mb-1">ما هو الحجز المرن؟</h4>
                                <p className="text-sm text-purple-800/80 leading-relaxed">
                                    خيار الحجز المرن يمنحكم ميزة التواجد في قاعات المعهد الحقيقية مع دفع تكاليف الساعات التي تختارونها فقط. لا حاجة لحجز القاعة لفترة طويلة، بل تختارون الأيام والساعات بدقة وتدفعون مقابل الاستخدام الفعلي، مما يقلل المخاطر المالية ويمنحكم مرونة قصوى.
                                </p>
                            </div>
                        </div>
                    )}
                    </CardContent></Card>

                    {courseData.deliveryType === 'in_person' && (<div className="space-y-6">
                        <Card><CardHeader><CardTitle className="text-right flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600" />اختر القاعة</CardTitle></CardHeader><CardContent>
                            {!selectedHall ? <Button variant="outline" className="w-full h-12 border-dashed" onClick={() => setIsHallDialogOpen(true)}>اختر قاعة...</Button> : (
                                <div className="border p-4 rounded-xl flex items-center gap-4 bg-gray-50" onClick={() => setIsHallDialogOpen(true)}>
                                    <div className="w-24 h-16 relative"><HallImage src={selectedHall.image} alt="Hall" className="object-cover rounded" /></div>
                                    <div className="flex-1 text-right"><h4 className="font-bold">{selectedHall.name}</h4><p className="text-xs text-gray-500">معهد: {selectedHall.owner}</p></div>
                                    <Button variant="ghost" size="sm" className="bg-white border">تغيير</Button>
                                </div>
                            )}
                            <Dialog open={isHallDialogOpen} onOpenChange={setIsHallDialogOpen}><DialogContent className="max-w-3xl h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start" dir="rtl">
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
                                </div>
                            </DialogContent></Dialog>
                        </CardContent></Card>
                        {selectedHall && (<Card><CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2 text-right"><Calendar className="h-5 w-5 text-blue-600" />المواعيد - {monthLabel}</CardTitle><div className="flex gap-1" dir="rtl"><Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => p - 1)} disabled={calendarOffset === 0}>←</Button><Button variant="ghost" size="sm" onClick={() => setCalendarOffset(p => p + 1)}>→</Button></div></div></CardHeader><CardContent className="space-y-4">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs">{weekDaysShort.map(d => <div key={d}>{d}</div>)}{calendarDays.map((d, i) => d ? <button key={i} onClick={() => handleSelectDay(d.dateKey)} disabled={d.isPast} className={`h-8 rounded text-xs ${selectedDate === d.dateKey ? 'bg-blue-600 text-white' : d.isPast ? 'bg-gray-50 text-gray-300' : selectedSessions.some(s => s.date === d.dateKey) ? 'bg-blue-100 text-blue-700' : 'bg-white border'}`}>{d.day}</button> : <div key={i} />)}</div>
                            {selectedDate && <div className="border-t pt-2" dir="rtl">{isSlotsLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : <div className="grid grid-cols-3 gap-1">{availableSlots.map(s => <button key={s} onClick={() => toggleSessionSlot(selectedDate, s)} className={`p-1.5 text-xs rounded border ${selectedSessions.some(ss => ss.date === selectedDate && ss.slot === s) ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>{formatTimeRange(s)}</button>)}</div>}{!isSlotsLoading && availableSlots.length === 0 && <p className="text-xs text-center text-gray-400 py-2">{unavailableMessage}</p>}</div>}
                            {selectedSessions.length > 0 && <div className="bg-blue-50 p-3 rounded font-bold flex justify-between" dir="rtl"><span>{selectedSessions.length} جلسات</span><Price value={totalPrice} /></div>}
                        </CardContent></Card>)}
                    </div>)}

                    {courseData.deliveryType === 'online' && (<div className="space-y-6" dir="rtl">
                        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-right"><Globe className="h-5 w-5 text-blue-600" />منصة البث والرابط</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2 text-right"><Label className="block">منصة البث</Label><Select value={onlineSchedule.platform} onValueChange={v => setOnlineSchedule({ ...onlineSchedule, platform: v })} dir="rtl"><SelectTrigger className="text-right"><SelectValue placeholder="المنصة" /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.value} value={p.value} className="text-right">{p.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2 text-right"><Label className="block">رابط الاجتماع (Meeting Link)</Label><Input placeholder="الرابط..." value={onlineSchedule.meetingLink} onChange={e => setOnlineSchedule({ ...onlineSchedule, meetingLink: e.target.value })} className="text-right" dir="ltr" /></div></CardContent></Card>

                        <Card><CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2 text-right"><Calendar className="h-5 w-5 text-blue-600" />الجلسات ({onlineSessions.length})</CardTitle><Button type="button" size="sm" variant="outline" onClick={addOnlineSession} className="flex items-center gap-2"><Plus className="h-4 w-4" /> <span>إضافة جلسة</span></Button></div></CardHeader><CardContent className="space-y-4">{onlineSessions.map((s, i) => (<div key={i} className="border rounded-xl p-4 space-y-3 bg-blue-50/40 relative text-right"><div className="flex justify-between items-center"><span className="font-bold text-sm">جلسة {i + 1}</span>{onlineSessions.length > 1 && <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeOnlineSession(i)}><X className="h-4 w-4"/></Button>}</div><div className="grid grid-cols-3 gap-3"><div className="space-y-1"><Label className="text-xs">التاريخ</Label><Input type="date" value={s.date} onChange={e => updateOnlineSession(i, 'date', e.target.value)} className="text-right" /></div><div className="space-y-1"><Label className="text-xs">البدء</Label><Input type="time" value={s.startTime} onChange={e => updateOnlineSession(i, 'startTime', e.target.value)} className="text-right" /></div><div className="space-y-1"><Label className="text-xs">المدة</Label><Select value={s.duration} onValueChange={v => updateOnlineSession(i, 'duration', v)} dir="rtl"><SelectTrigger className="text-right"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="30" className="text-right">30 د</SelectItem><SelectItem value="60" className="text-right">60 د</SelectItem><SelectItem value="90" className="text-right">90 د</SelectItem></SelectContent></Select></div></div></div>))}</CardContent></Card>
                    </div>)}

                    <div className="flex justify-between items-center pt-6 border-t mt-8" dir="rtl">
                        <Button variant="outline" onClick={() => setActiveTab("info")} className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            <span>السابق</span>
                        </Button>
                        <Button onClick={() => handleSubmit('ACTIVE')} disabled={!isLocValid() || isSubmitting} className="flex items-center gap-2 px-8">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            <span>نشر الدورة</span>
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
