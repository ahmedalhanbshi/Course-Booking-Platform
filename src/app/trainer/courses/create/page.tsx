"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Save, Send, Trash2, ArrowLeft, Upload, X, MapPin, Users, Building, Globe, HelpCircle, FileText, Plus, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const mockUser = {
  id: "2",
  name: "فاطمة علي",
  email: "fatima@example.com",
  role: 'trainer' as const,
}

const categories = [
  "تطوير الويب",
  "التصميم",
  "إدارة الأعمال",
  "تطوير البرمجيات",
  "التسويق",
  "قواعد البيانات",
  "الذكاء الاصطناعي",
  "الأمن السيبراني"
]

const platforms = [
  { value: "zoom", label: "Zoom" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "meet", label: "Google Meet" },
  { value: "webex", label: "Webex" },
  { value: "other", label: "أخرى" }
]

// Mock data for halls (Shared with Halls Page)
const mockHalls = [
  {
    id: "1",
    name: "القاعة الرئيسية (أ)",
    capacity: 50,
    location: "الدور الأول - الجناح الشرقي"
  },
  {
    id: "2",
    name: "معمل الحاسب (1)",
    capacity: 25,
    location: "الدور الثاني - الجناح الغربي"
  },
  {
    id: "3",
    name: "قاعة الاجتماعات (ب)",
    capacity: 15,
    location: "الدور الأرضي - قرب الإدارة"
  },
  {
    id: "4",
    name: "القاعة التدريبية (ج)",
    capacity: 30,
    location: "الدور الأول - الجناح الشرقي"
  }
]

interface Lesson {
  id: string;
  title: string;
  date: string;
  time: string;
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    shortDescription: "",
    description: "",
    deliveryType: "", // in_person, online, hybrid, capacity_based (risk-free)
    price: "",
    maxStudents: "",
    startDate: "",
    endDate: "",
    instituteId: "",
    prerequisites: "",
    objectives: [] as string[],
    tags: [] as string[],
    hallId: "", 
    onlinePlatform: "",
    meetingLink: "",
    startTime: "",
    endTime: ""
  })

  // Curriculum State
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [newLesson, setNewLesson] = useState({ title: "", date: "", time: "" })
  const [files, setFiles] = useState<string[]>([]) // Mock files

  const [currentObjective, setCurrentObjective] = useState("")
  const [currentTag, setCurrentTag] = useState("")

  // --- Session Scheduler State ---
  const [scheduleType, setScheduleType] = useState<'unified' | 'custom'>('unified')
  const [sessions, setSessions] = useState<{ id: string, date: string, startTime: string, endTime: string, duration: number }[]>([])

  const [unifiedSettings, setUnifiedSettings] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    selectedDays: [] as number[] // 0 = Sunday, 1 = Monday, etc.
  })

  const [customSession, setCustomSession] = useState({
    date: "",
    startTime: "",
    endTime: ""
  })

  // Weekdays for selection
  const weekDays = [
    { id: 0, label: "الأحد" },
    { id: 1, label: "الاثنين" },
    { id: 2, label: "الثلاثاء" },
    { id: 3, label: "الأربعاء" },
    { id: 4, label: "الخميس" },
    { id: 5, label: "الجمعة" },
    { id: 6, label: "السبت" },
  ]

  // --- Scheduler Logic ---

  // derived statistics
  const totalHours = sessions.reduce((acc, curr) => acc + curr.duration, 0)

  // Auto-calculate Course Start/End Dates
  const updateCourseDates = (currentSessions: typeof sessions) => {
    if (currentSessions.length === 0) return

    // sort sessions by date
    const sorted = [...currentSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    const newStartDate = sorted[0].date
    const newEndDate = sorted[sorted.length - 1].date

    setCourseData(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate,
    }))
  }

  const toggleDay = (dayId: number) => {
    setUnifiedSettings(prev => {
      const exists = prev.selectedDays.includes(dayId)
      if (exists) return { ...prev, selectedDays: prev.selectedDays.filter(d => d !== dayId) }
      return { ...prev, selectedDays: [...prev.selectedDays, dayId] }
    })
  }

  const generateUnifiedSessions = () => {
    if (!unifiedSettings.startDate || !unifiedSettings.endDate || !unifiedSettings.startTime || !unifiedSettings.endTime || unifiedSettings.selectedDays.length === 0) {
      toast.error("يرجى تعبئة جميع حقول الجدول الموحد")
      return
    }

    const start = new Date(unifiedSettings.startDate)
    const end = new Date(unifiedSettings.endDate)
    const newSessions = []
    
    // Calculate duration per session (approx in hours)
    const sTime = new Date(`2000-01-01T${unifiedSettings.startTime}`)
    const eTime = new Date(`2000-01-01T${unifiedSettings.endTime}`)
    const duration = (eTime.getTime() - sTime.getTime()) / (1000 * 60 * 60)

    if (duration <= 0) {
        toast.error("وقت النهاية يجب أن يكون بعد وقت البداية")
        return
    }

    // Loop through dates
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        if (unifiedSettings.selectedDays.includes(dt.getDay())) {
            newSessions.push({
                id: Math.random().toString(36).substr(2, 9),
                date: dt.toISOString().split('T')[0], // YYYY-MM-DD
                startTime: unifiedSettings.startTime,
                endTime: unifiedSettings.endTime,
                duration: Number(duration.toFixed(1))
            })
        }
    }

    if (newSessions.length === 0) {
        toast.warning("لم يتم العثور على أيام مطابقة في الفترة المحددة")
        return
    }

    const updatedSessions = [...sessions, ...newSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setSessions(updatedSessions)
    updateCourseDates(updatedSessions)
    toast.success(`تم إضافة ${newSessions.length} جلسة بنجاح`)
  }

  const addCustomSession = () => {
    if (!customSession.date || !customSession.startTime || !customSession.endTime) {
         toast.error("يرجى تعبئة بيانات الجلسة")
         return
    }

    const sTime = new Date(`2000-01-01T${customSession.startTime}`)
    const eTime = new Date(`2000-01-01T${customSession.endTime}`)
    const duration = (eTime.getTime() - sTime.getTime()) / (1000 * 60 * 60)

     if (duration <= 0) {
        toast.error("وقت النهاية يجب أن يكون بعد وقت البداية")
        return
    }

    const newS = {
        id: Math.random().toString(36).substr(2, 9),
        date: customSession.date,
        startTime: customSession.startTime,
        endTime: customSession.endTime,
        duration: Number(duration.toFixed(1))
    }

    const updatedSessions = [...sessions, newS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setSessions(updatedSessions)
    updateCourseDates(updatedSessions)
    setCustomSession({ date: "", startTime: "", endTime: "" })
    toast.success("تم إضافة الجلسة")
  }

  const removeSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id)
    setSessions(updated)
    updateCourseDates(updated)
  }
  

  const handleSubmit = async (action: 'draft' | 'submit') => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)

    if (action === 'submit') {
      // Logic: If physical hall selected, status = 'pending_approval'
      if (courseData.deliveryType === 'in_person' || courseData.deliveryType === 'hybrid') {
          toast.success("تم إرسال الدورة وطلب حجز القاعة للمراجعة المبدئية")
      } else if (courseData.deliveryType === 'capacity_based') {
          toast.success("تم نشر الدورة بنظام الحجز المبكر (تحديد القاعة لاحقاً)")
      } else {
          toast.success("تم إنشاء الدورة بنجاح")
      }
      
      // Redirect to courses list
      router.push('/trainer/courses')
    } else {
      // Show success message and stay on page
      toast.success('تم حفظ الدورة كمسودة')
    }
  }

  const handleDelete = () => {
    // In real app, this would delete the course
    console.log('Deleting course...')
    setShowDeleteDialog(false)
    router.push('/trainer/courses')
  }

  const addObjective = () => {
    if (currentObjective.trim()) {
      setCourseData(prev => ({
        ...prev,
        objectives: [...prev.objectives, currentObjective.trim()]
      }))
      setCurrentObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddLesson = () => {
      if (newLesson.title && newLesson.date && newLesson.time) {
          setLessons([...lessons, { ...newLesson, id: Math.random().toString() }])
          setNewLesson({ title: "", date: "", time: "" })
          toast.success("تم إضافة الدرس للجدول")
      } else {
          toast.error("يرجى تعبئة جميع حقول الدرس")
      }
  }

  const handleFileUpload = () => {
      // Mock upload
      setFiles([...files, `Course_Material_${files.length + 1}.pdf`])
      toast.success("تم رفع الملف بنجاح")
  }

  const isInfoValid = () => {
      return courseData.title && courseData.category && courseData.shortDescription && courseData.description
  }

  const isPricingValid = () => {
      return courseData.price
  }

  const isCurriculumValid = () => {
      return true
  }

  const isLocationValid = () => {
      if (!courseData.deliveryType) return false
      if (courseData.deliveryType === 'in_person' && !courseData.hallId) return false
      return true
  }

  const selectedHall = mockHalls.find(h => h.id === courseData.hallId)

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/trainer/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للدورات
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إنشاء دورة تدريبية جديدة
        </h1>
        <p className="text-gray-600">
          اتبع الخطوات التالية لإنشاء ونشر دورتك التدريبية
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        {/* Step Indicator (Tabs List) */}
        <div className="w-full bg-white p-2 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-50/50">
                <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</div>
                    بيانات الدورة
                </TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 gap-2" disabled={!isInfoValid()}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</div>
                    التسعير والمواعيد
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 gap-2" disabled={!isInfoValid() || !isPricingValid()}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">3</div>
                    المنهج والمرفقات
                </TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 gap-2" disabled={!isInfoValid() || !isPricingValid() || !isCurriculumValid()}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">4</div>
                    المكان والنشر
                </TabsTrigger>
            </TabsList>
        </div>

        {/* Tab 1: Course Info */}
        <TabsContent value="info" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <div className="space-y-6">
                
                {/* 1. Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                        <CardDescription>تفاصيل الدورة والعنوان</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="title">عنوان الدورة *</Label>
                        <Input
                            id="title"
                            placeholder="مثال: تعلم React من الصفر"
                            value={courseData.title}
                            onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                        />
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="category">الفئة *</Label>
                        <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                            <SelectValue placeholder="اختر فئة الدورة" />
                            </SelectTrigger>
                            <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                {category}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="shortDescription">وصف الترويجي (قصير) *</Label>
                        <Textarea
                            id="shortDescription"
                            placeholder="وصف يظهر في بطاقة الدورة..."
                            value={courseData.shortDescription}
                            onChange={(e) => setCourseData(prev => ({ ...prev, shortDescription: e.target.value }))}
                            rows={2}
                        />
                        </div>
                        
                        <div className="space-y-2">
                        <Label htmlFor="description">الوصف التفصيلي *</Label>
                        <Textarea
                            id="description"
                            placeholder="ماذا سيتعلم الطالب؟ المتطلبات..."
                            value={courseData.description}
                            onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                        />
                        </div>
                    </CardContent>
                </Card>



                {/* 3. Media & Attributes (MOVED DOWN) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Objectives */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">أهداف الدورة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                            <Input
                                placeholder="أضف هدف..."
                                value={currentObjective}
                                onChange={(e) => setCurrentObjective(e.target.value)}
                                className="h-8 text-sm"
                            />
                            <Button type="button" size="sm" onClick={addObjective}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {courseData.objectives.map((obj, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                    <span>{obj}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(i)} className="h-6 w-6 p-0"><X className="h-3 w-3" /></Button>
                                </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">الكلمات المفتاحية</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input placeholder="أضف كلمة..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} className="h-8 text-sm"/>
                                <Button type="button" size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {courseData.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)}/>
                                </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            <div className="flex justify-end pt-6">
                <Button onClick={() => setActiveTab("pricing")} disabled={!isInfoValid()}>
                    التالي: التسعير والمواعيد
                </Button>
            </div>
        </TabsContent>

        {/* Tab 2: Pricing & Schedule (NEW STEP) */}
        <TabsContent value="pricing" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
             <Card>
                <CardHeader><CardTitle>التسعير والتواريخ</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">السعر (ريال يمني) *</Label>
                            <Input id="price" type="number" value={courseData.price} onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxStudents">المقاعد (اختياري)</Label>
                            <Input id="maxStudents" type="number" value={courseData.maxStudents} onChange={(e) => setCourseData(prev => ({ ...prev, maxStudents: e.target.value }))} />
                        </div>
                    </div>
                    
                    {/* Session Scheduler Section */}
                    <div className="border-t pt-6 mt-4">
                        <Label className="text-base font-semibold block mb-4">جدول المواعيد والجلسات</Label>
                        
                        {/* Toggle Type */}
                        <div className="bg-gray-100/50 p-1 rounded-lg flex mb-6 w-fit">
                            <button 
                                type="button"
                                onClick={() => setScheduleType('unified')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${scheduleType === 'unified' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                وقت موحد (تكرار)
                            </button>
                            <button 
                                type="button"
                                onClick={() => setScheduleType('custom')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${scheduleType === 'custom' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                وقت مخصص
                            </button>
                        </div>

                        {/* Scheduler Inputs */}
                        <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-5 mb-6">
                            {scheduleType === 'unified' ? (
                                <div className="space-y-6">
                                    {/* Date Range - RTL: Start Right, End Left */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">من تاريخ (Start Date)</Label>
                                            <Input type="date" value={unifiedSettings.startDate} onChange={e => setUnifiedSettings({...unifiedSettings, startDate: e.target.value})} className="bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">إلى تاريخ (End Date)</Label>
                                            <Input type="date" value={unifiedSettings.endDate} onChange={e => setUnifiedSettings({...unifiedSettings, endDate: e.target.value})} className="bg-white" />
                                        </div>
                                    </div>

                                    {/* Days Selector */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-700">الأيام (Days)</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {weekDays.map(day => (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => toggleDay(day.id)}
                                                    className={`
                                                        px-4 py-2 rounded-lg text-sm font-medium transition-all border
                                                        ${unifiedSettings.selectedDays.includes(day.id) 
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                                                    `}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Range - RTL: Start Right, End Left */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">من الساعة (Start Time)</Label>
                                            <Input type="time" value={unifiedSettings.startTime} onChange={e => setUnifiedSettings({...unifiedSettings, startTime: e.target.value})} className="bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">إلى الساعة (End Time)</Label>
                                            <Input type="time" value={unifiedSettings.endTime} onChange={e => setUnifiedSettings({...unifiedSettings, endTime: e.target.value})} className="bg-white" />
                                        </div>
                                    </div>

                                    <Button type="button" onClick={generateUnifiedSessions} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11 text-base">
                                        <Plus className="w-5 h-5 mr-2" />
                                        إضافة الجلسات للجدول
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">التاريخ</Label>
                                        <Input type="date" value={customSession.date} onChange={e => setCustomSession({...customSession, date: e.target.value})} className="bg-white" />
                                    </div>
                                    
                                    {/* Time Range - RTL: Start Right, End Left */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">وقت البدء (Start)</Label>
                                            <Input type="time" value={customSession.startTime} onChange={e => setCustomSession({...customSession, startTime: e.target.value})} className="bg-white" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">وقت النهاية (End)</Label>
                                            <Input type="time" value={customSession.endTime} onChange={e => setCustomSession({...customSession, endTime: e.target.value})} className="bg-white" />
                                        </div>
                                    </div>
                                    
                                    <Button type="button" onClick={addCustomSession} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11 text-base">
                                        <Plus className="w-5 h-5 mr-2" />
                                        إضافة جلسة
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Sessions List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 px-1 border-b pb-2">
                                <span className="font-semibold text-gray-700">الجلسات المجدولة ({sessions.length})</span>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">المدة الإجمالية: {totalHours.toFixed(1)} ساعة</span>
                            </div>
                            
                            {sessions.length > 0 ? (
                                <div className="border rounded-xl divide-y bg-white max-h-[400px] overflow-y-auto shadow-sm">
                                    {sessions.map((session, idx) => (
                                        <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-100">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                                            {new Date(session.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-2 bg-gray-50 px-2 py-1 rounded w-fit">
                                                        <Clock className="w-3 h-3" />
                                                        <span dir="ltr">{session.startTime} - {session.endTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
                                                onClick={() => removeSession(session.id)}
                                                title="حذف الجلسة"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Calendar className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900">لا توجد جلسات مضافة</h3>
                                    <p className="text-xs text-gray-500 mt-1">ابدأ بإضافة مواعيد الدورة باستخدام النموذج أعلاه</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Read-Only Auto Data (Hidden or Displayed) */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t bg-gray-50/50 p-4 rounded-lg mt-4" style={{ display: sessions.length > 0 ? 'grid' : 'none' }}>
                        <div>
                            <span className="text-xs text-gray-400 block mb-1">تاريخ البداية (تلقائي)</span>
                            <div className="font-bold text-sm text-gray-800 bg-white px-3 py-2 rounded border inline-block min-w-[120px]">
                                {courseData.startDate || "-"}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 block mb-1">تاريخ النهاية (تلقائي)</span>
                            <div className="font-bold text-sm text-gray-800 bg-white px-3 py-2 rounded border inline-block min-w-[120px]">
                                {courseData.endDate || "-"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setActiveTab("info")}>السابق</Button>
                <Button onClick={() => setActiveTab("curriculum")} disabled={!isInfoValid() || !isPricingValid()}>
                    التالي: المنهج والمرفقات
                </Button>
            </div>
        </TabsContent>

        {/* Tab 3: Curriculum & Materials */}
        <TabsContent value="curriculum" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lesson Scheduler */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            جدولة الدروس
                        </CardTitle>
                        <CardDescription>قم بإضافة جدول المحاضرات المتوقع</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                            <div className="space-y-2">
                                <Label>عنوان الدرس</Label>
                                <Input 
                                    placeholder="مثال: مقدمة في React" 
                                    value={newLesson.title}
                                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>التاريخ</Label>
                                    <Input type="date" value={newLesson.date} onChange={(e) => setNewLesson({...newLesson, date: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>الوقت</Label>
                                    <Input type="time" value={newLesson.time} onChange={(e) => setNewLesson({...newLesson, time: e.target.value})} />
                                </div>
                            </div>
                            <Button onClick={handleAddLesson} className="w-full" variant="secondary">
                                <Plus className="w-4 h-4 mr-2" />
                                إضافة للجدول
                            </Button>
                        </div>

                        {/* Lessons List */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">الدروس المضافة ({lessons.length})</h4>
                            {lessons.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                                    لا يوجد دروس مضافة بعد
                                </div>
                            )}
                            {lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{lesson.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{lesson.date}</span>
                                                <span>•</span>
                                                <span>{lesson.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setLessons(lessons.filter(l => l.id !== lesson.id))}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Course Materials */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-orange-600" />
                            المواد التعليمية (المرفقات)
                        </CardTitle>
                        <CardDescription>ارفع ملفات PDF، عروض تقديمية، أو مصادر إضافية</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer" onClick={handleFileUpload}>
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                            <p className="font-medium text-gray-900">اضغط لرفع الملفات</p>
                            <p className="text-sm text-gray-500 mt-1">PDF, PPTX, DOCS (Max 10MB)</p>
                        </div>

                         <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">الملفات المرفقة ({files.length})</h4>
                            {files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm truncate max-w-[200px]">{file}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, i) => i !== idx))}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

             <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setActiveTab("pricing")}>السابق</Button>
                <Button onClick={() => setActiveTab("location")}>التالي: المكان والنشر</Button>
            </div>
        </TabsContent>

        {/* Tab 3: Location & Publish */}
        <TabsContent value="location" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
            <Card>
                <CardHeader>
                    <CardTitle>طريقة التقديم والمكان</CardTitle>
                    <CardDescription>حدد كيفية تقديم الدورة ومكان الانعقاد</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                         <Label className="text-base">اختر طريقة التقديم المفضلة</Label>
                         <RadioGroup
                            value={courseData.deliveryType}
                            onValueChange={(value) => setCourseData(prev => ({ ...prev, deliveryType: value }))}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {/* Option 1: Online */}
                            <label className={`
                                relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 cursor-pointer hover:bg-gray-50 transition-all
                                ${courseData.deliveryType === 'online' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}
                            `}>
                                <RadioGroupItem value="online" className="sr-only" />
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold block">أونلاين (عن بعد)</span>
                                    <span className="text-xs text-gray-500">تقديم الدورة عبر الإنترنت بالكامل</span>
                                </div>
                                {courseData.deliveryType === 'online' && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-600" />}
                            </label>

                            {/* Option 2: In-Person (Book Hall) */}
                            <label className={`
                                relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 cursor-pointer hover:bg-gray-50 transition-all
                                ${courseData.deliveryType === 'in_person' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}
                            `}>
                                <RadioGroupItem value="in_person" className="sr-only" />
                                <div className="p-3 bg-green-100 rounded-full text-green-600">
                                    <Building className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold block">حضوري (حجز قاعة)</span>
                                    <span className="text-xs text-gray-500">يتطلب حجز قاعة الآن</span>
                                </div>
                                {courseData.deliveryType === 'in_person' && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-600" />}
                            </label>

                            {/* Option 3: Capacity Based (Risk Free) */}
                            <label className={`
                                relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 cursor-pointer hover:bg-gray-50 transition-all
                                ${courseData.deliveryType === 'capacity_based' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200'}
                            `}>
                                <RadioGroupItem value="capacity_based" className="sr-only" />
                                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold block">تحديد القاعة عند القبول</span>
                                    <span className="text-xs text-gray-500">نشر الدورة أولاً وتحديد القاعة عند اكتمال العدد</span>
                                </div>
                                {courseData.deliveryType === 'capacity_based' && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-purple-600" />}
                            </label>
                         </RadioGroup>
                    </div>

                    {/* Conditional Logic Content */}
                    <div className="pt-4 border-t">
                         {courseData.deliveryType === 'capacity_based' && (
                             <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                                 <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                                 <div>
                                     <h4 className="font-bold text-purple-900">وضع الحجز المرن (Risk-Free)</h4>
                                     <p className="text-purple-700 text-sm mt-1">
                                         عند اختيار هذا الوضع، سيتم نشر الدورة للطلاب للتسجيل المبدئي بدون حجز قاعة فعلية.
                                         يمكنك حجز القاعة وتحديد الموعد النهائي لاحقاً من لوحة التحكم عندما يكتمل العدد المطلوب.
                                     </p>
                                 </div>
                             </div>
                         )}

                         {courseData.deliveryType === 'in_person' && (
                             <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="hall" className="mb-2 block">اختيار القاعة *</Label>
                                <Select value={courseData.hallId} onValueChange={(value) => setCourseData(prev => ({ ...prev, hallId: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر القاعة المناسبة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockHalls.map(hall => (
                                            <SelectItem key={hall.id} value={hall.id}>
                                            {hall.name} (السعة: {hall.capacity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedHall && (
                                     <div className="bg-gray-50 p-3 rounded-md flex items-center gap-3 text-sm border">
                                         <MapPin className="h-4 w-4 text-gray-500" />
                                         <span>{selectedHall.location}</span>
                                     </div>
                                )}
                             </div>
                         )}

                         {!courseData.deliveryType && (
                             <div className="text-center text-gray-500 py-8 italic">
                                 يرجى اختيار طريقة التقديم للمتابعة
                             </div>
                         )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t mt-8">
                <Button variant="outline" onClick={() => setActiveTab("curriculum")}>السابق</Button>
                
                <div className="flex gap-3">
                     <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogTrigger asChild>
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>تأكيد الحذف</DialogTitle>
                            <DialogDescription>
                            هل أنت متأكد من حذف هذه الدورة؟
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
                            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => handleSubmit('draft')}
                        disabled={isSubmitting}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        حفظ كمسودة
                    </Button>

                    <Button
                        type="button"
                        onClick={() => handleSubmit('submit')}
                        disabled={!isLocationValid() || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 w-40"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'جاري النشر...' : 'نشر الدورة'}
                    </Button>
                </div>
            </div>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}