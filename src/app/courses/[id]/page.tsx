"use client"

import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Users,
  PlayCircle,
  FileText,
  Award,
  CheckCircle, // Changed from CheckCircle2
  Edit,
  Settings,
  CreditCard,
  Upload,
  Check,
  Phone,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Mock data database
const coursesDatabase: Record<string, any> = {
  "1": {
    id: "1",
    title: "تعلم React من الصفر",
    description: "دورة شاملة لتعلم مكتبة React وبناء تطبيقات ويب حديثة وتفاعلية. ستتعلم في هذه الدورة كل ما تحتاجه لتصبح مطور واجهات أمامية محترف.",
    longDescription: `
      تعتبر React واحدة من أكثر مكتبات JavaScript شعبية لبناء واجهات المستخدم. في هذه الدورة، سنبدأ من الأساسيات وننتقل تدريجياً إلى المفاهيم المتقدمة.
      
      ماذا ستتعلم:
      - أساسيات React و JSX
      - التعامل مع State و Props
      - استخدام Hooks (useState, useEffect, etc.)
      - إدارة الحالة باستخدام Context API و Redux
      - التعامل مع النماذج والتحقق من البيانات
      - الاتصال بالخوادم واستجلاب البيانات
      - بناء مشروع كامل من الصفر
    `,
    price: 29900,
    originalPrice: 45000,
    reviewCount: 156,
    studentsCount: 1250,
    duration: "40 ساعة",
    lessonsCount: 85,
    level: "مبتدئ - متوسط",
    lastUpdated: "2025-02-15",
    language: "العربية",
    image: "/images/course-web.png", 
    category: "تطوير الويب",
    instructor: {
      id: "101",
      name: "أحمد محمد",
      role: "Senior Frontend Developer",
      avatar: "/images/avatar-1.png",
      students: 5000,
      courses: 12
    },
    curriculum: [
      {
        title: "مقدمة في React",
        lessons: [
          { title: "ما هي React ولماذا نستخدمها؟", duration: "10:00" },
          { title: "إعداد بيئة التطوير", duration: "15:00" }
        ]
      },
      {
        title: "الأساسيات",
        lessons: [
          { title: "فهم JSX", duration: "18:00" },
          { title: "التعامل مع Props", duration: "20:00" }
        ]
      }
    ],
    features: ["شهادة إتمام معتمدة", "وصول مدى الحياة", "ملفات ومشاريع عملية", "دعم مباشر من المدرب"]
  }
}

const defaultCourse = coursesDatabase["1"]

// Enrollment Steps
const steps = [
    { number: 1, title: 'تسجيل مبدئي', statusKey: 'preliminary' },
    { number: 2, title: 'موافقة المدرب', statusKey: 'pending_approval' }, // UI term for flow
    { number: 3, title: 'تأكيد ودفع', statusKey: 'pending_payment' },
    { number: 4, title: 'تم التسجيل', statusKey: 'active' },
]

export default function CourseDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams() // Added searchParams
  const { user } = useAuth()
  
  const courseId = typeof params.id === 'string' ? params.id : '1'

  // Expanded Mock Data
  const courseData = {
    id: '1',
    title: 'تعلم React من الصفر حتى الاحتراف 2024',
    subtitle: 'دورة شاملة لتعلم مكتبة React وبناء تطبيقات ويب حديثة وتفاعلية. ستتعلم في هذه الدورة كل ما تحتاجه لتصبح مطور واجهات أمامية محترف.',
    description: `
      تعتبر React واحدة من أكثر مكتبات JavaScript شعبية لبناء واجهات المستخدم. في هذه الدورة، سنبدأ من الأساسيات وننتقل تدريجياً إلى المفاهيم المتقدمة.
      
      ستتعلم كيفية التفكير بطريقة React، وكيفية بناء مكونات قابلة لإعادة الاستخدام، وكيفية إدارة الحالة بفعالية. سنقوم ببناء عدة مشاريع عملية خلال الدورة لترسيخ المفاهيم.
    `,
    image: '/images/course-web.png', 
    rating: 4.8,
    reviewsCount: 1240,
    studentsCount: 3500,
    lastUpdated: 'ديسمبر 2024',
    language: 'العربية',
    level: 'مبتدئ - متوسط',
    price: 29900,
    instructor: {
      id: 'inst1',
      name: 'أحمد محمد',
      title: 'Senior Frontend Developer',
      bio: 'مطور برمجيات بخبرة تزيد عن 10 سنوات في تطوير تطبيقات الويب. عملت مع شركات عالمية وساهمت في العديد من المشاريع مفتوحة المصدر. شغوف بالتعليم ونقل الخبرة.',
      image: '/images/avatar-1.png', 
      rating: 4.9,
      coursesCount: 5,
      studentsCount: 15000,
      reviewsCount: 1200
    },
    objectives: [
      'فهم أساسيات React و JSX وكيفية عملها تحت الغطاء',
      'التعامل مع State و Props بثقة لبناء تطبيقات ديناميكية',
      'احتراف استخدام React Hooks (useState, useEffect, useContext, etc.)',
      'إدارة الحالة المتقدمة باستخدام Redux Toolkit و Context API',
      'التعامل مع النماذج (Forms) والتحقق من صحة البيانات',
      'بناء تطبيقات متعددة الصفحات باستخدام React Router',
      'التعامل مع واجهات برمجة التطبيقات (APIs) وجلب البيانات',
      'أفضل الممارسات (Best Practices) لكتابة كود نظيف وقابل للصيانة'
    ],
    prerequisites: [
      'معرفة أساسية بـ HTML و CSS',
      'معرفة جيدة بـ JavaScript (ES6+ features like Arrow Functions, Destructuring, etc.)',
      'جهاز كمبيوتر واتصال بالإنترنت'
    ],
    curriculum: [
      {
        title: 'مقدمة في React',
        duration: '45 دقيقة',
        lessons: [
          { title: 'ما هي React ولماذا نستخدمها؟', type: 'video', duration: '10:00' },
          { title: 'إعداد بيئة التطوير', type: 'video', duration: '15:00' },
          { title: 'أول تطبيق React', type: 'video', duration: '20:00' }
        ]
      },
      {
        title: 'الأساسيات: Components & JSX',
        duration: '1 ساعة و 30 دقيقة',
        lessons: [
          { title: 'فهم Components', type: 'video', duration: '20:00' },
          { title: 'كتابة JSX', type: 'video', duration: '25:00' },
          { title: 'تمرين عملي', type: 'assignment', duration: '45:00' }
        ]
      },
       {
        title: 'إدارة الحالة (State Management)',
        duration: '2 ساعة',
        lessons: [
          { title: 'مفهوم State', type: 'video', duration: '30:00' },
          { title: 'استخدام useState Hook', type: 'video', duration: '40:00' },
          { title: 'مشروع صغير: عداد', type: 'project', duration: '50:00' }
        ]
      }
    ]
  }

  // --- Enrollment Logic ---
  const [enrollmentStatus, setEnrollmentStatus] = useState<'none' | 'preliminary' | 'pending_payment' | 'active' | 'cancelled' | 'completed'>('none')
  const [formData, setFormData] = useState({
      name: user?.name || 'عبدالله محمد',
      email: user?.email || 'student@example.com',
      phone: '0500000000'
  })
  const [isRegDialogOpen, setIsRegDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  // Initialization mock logic
  useEffect(() => {
    // Mock logic: Simulating enrollment for specific courses or via URL param for testing
    // Course 1 is the default enrolled mock
    // Course 4 is what the user was testing with
    if (courseId === '1' || courseId === '3' || courseId === '4' || searchParams.get('enrolled') === 'true') {
         setEnrollmentStatus('active')
    }
  }, [courseId, searchParams])


  const steps = [
        { status: 'preliminary', label: 'تسجيل مبدئي' },
        { status: 'approval', label: 'انتظار موافقة المدرب' },
        { status: 'pending_payment', label: 'تأكيد الدفع' },
        { status: 'active', label: 'تم التسجيل' },
  ]

  const handlePreliminaryRegister = () => {
    // API Call Mock
    setTimeout(() => {
        setEnrollmentStatus('preliminary')
        setIsRegDialogOpen(false)
        toast.success("تم إرسال طلب التسجيل المبدئي بنجاح", { description: "سيقوم المدرب بمراجعة طلبك قريباً" })
    }, 1000)
  }

  const DEBUG_simulateTrainerApproval = () => {
      toast.info("محاكاة: المدرب وافق على الطلب")
      setEnrollmentStatus('pending_payment')
  }

  const handlePayment = () => {
      // API Call Mock
      setTimeout(() => {
        setEnrollmentStatus('active')
        setIsPaymentDialogOpen(false)
        toast.success("تم تأكيد التسجيل بنجاح!", { description: "يمكنك الآن البدء في مشاهدة محتوى الدورة" })
      }, 1500)
  }
  
  const getCurrentStepIndex = () => {
      if (enrollmentStatus === 'none') return -1
      if (enrollmentStatus === 'preliminary') return 1 // Step 2: Waiting for approval
      if (enrollmentStatus === 'pending_payment') return 2 // Step 3: Pending Payment
      if (enrollmentStatus === 'active') return 3 // Step 4: Active
      return 0
  }
  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-12 font-sans">
      {/* 1. Hero Section (Header) */}
      <div className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Content (Course Info) */}
                <div className="lg:w-2/3 space-y-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-slate-400 gap-2 mb-4">
                        <span className="cursor-pointer hover:text-white transition">الرئيسية</span> <span className="text-slate-600">/</span>
                        <span className="cursor-pointer hover:text-white transition">البرمجة</span> <span className="text-slate-600">/</span>
                        <span className="text-white font-medium">{courseData.title}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">{courseData.title}</h1>
                    <p className="text-lg text-slate-300 line-clamp-2">{courseData.subtitle}</p>
                    
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full font-bold text-xs">الأكثر مبيعاً</div>
                        
                        <div className="flex items-center gap-1 text-slate-300">
                             <Users className="w-4 h-4" /> <span>{courseData.studentsCount} طالب</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm pt-4 border-t border-slate-800/50 mt-4 text-slate-300">
                        <div className="flex items-center gap-2">
                             <img src={courseData.instructor.image} className="w-8 h-8 rounded-full border border-slate-600" alt={courseData.instructor.name} />
                             <span className="text-slate-400">تم الإنشاء بواسطة:</span>
                             <a href="#" className="text-blue-400 hover:text-blue-300 transition font-medium">{courseData.instructor.name}</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            
            {/* Left Column (Content) - 8 Cols */}
            <div className="lg:col-span-8 order-2 lg:order-1 space-y-10">
                
                {/* Objectives (What you'll learn) */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        ماذا ستتعلم في هذه الدورة؟
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        {courseData.objectives.map((obj, i) => (
                            <div key={i} className="flex gap-3 items-start p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                                <Check className="w-4 h-4 text-gray-800 dark:text-gray-200 shrink-0 mt-1" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{obj}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Content (Curriculum) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        محتوى الدورة
                    </h2>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2 px-1">
                        <span>{courseData.curriculum.length} أقسام • {courseData.curriculum.reduce((acc, curr) => acc + curr.lessons.length, 0)} درس • إجمالي 5 ساعات</span>
                        <button className="text-blue-600 font-medium hover:underline">توسيع الكل</button>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800 shadow-sm bg-white dark:bg-slate-900">
                        {courseData.curriculum.map((section, idx) => (
                             <details key={idx} className="group" open={idx === 0}>
                                <summary className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-900 transition select-none">
                                    <div className="flex items-center gap-3 font-medium text-gray-900 dark:text-gray-100">
                                        <div className="w-4 h-4 flex items-center justify-center transition-transform group-open:rotate-180">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m6 9 6 6 6-6"/></svg>
                                        </div>
                                        <span>{section.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{section.lessons.length} دروس • {section.duration}</span>
                                </summary>
                                <div className="bg-white dark:bg-slate-900 p-0 border-t border-gray-100 dark:border-slate-800">
                                    {section.lessons.map((lesson, lIdx) => (
                                        <div key={lIdx} className="flex items-center justify-between p-3 pl-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition group/lesson cursor-pointer">
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                {lesson.type === 'video' ? <PlayCircle className="w-4 h-4 text-gray-400 group-hover/lesson:text-blue-600" /> : <FileText className="w-4 h-4 text-gray-400 group-hover/lesson:text-blue-600" />}
                                                <span className="group-hover/lesson:text-blue-600 transition">{lesson.title}</span>
                                                {/* <span className="text-[10px] text-blue-600 border border-blue-200 bg-blue-50 px-1 rounded hidden group-hover/lesson:inline-block">معاينة</span> */}
                                            </div>
                                            <span className="text-xs text-gray-400">{lesson.duration}</span>
                                        </div>
                                    ))}
                                </div>
                             </details>
                        ))}
                    </div>
                </div>

                 {/* Requirements */}
                 <div className="space-y-4">
                    <h2 className="text-xl font-bold">المتطلبات</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 marker:text-blue-500">
                        {courseData.prerequisites.map((req, i) => (
                            <li key={i} className="pl-2">{req}</li>
                        ))}
                    </ul>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">الوصف</h2>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                        {courseData.description}
                    </div>
                </div>

                {/* Instructor */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold">المدرب</h2>
                    <div>
                        <div className="flex items-start gap-4 mb-4">
                            <img src={courseData.instructor.image} alt={courseData.instructor.name} className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-sm" />
                            <div>
                                <h3 className="text-lg font-bold text-blue-600 underline cursor-pointer hover:text-blue-800">{courseData.instructor.name}</h3>
                                <p className="text-gray-500 text-sm mb-3 font-medium">{courseData.instructor.title}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                                    <div className="flex items-center gap-1"><User className="w-4 h-4 text-gray-400" /> {courseData.instructor.studentsCount} طالب</div>
                                    <div className="flex items-center gap-1"><PlayCircle className="w-4 h-4 text-gray-400" /> {courseData.instructor.coursesCount} دورات</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{courseData.instructor.bio}</p>
                    </div>
                </div>
            </div>

            {/* Right Column (Sticky Sidebar) - 4 Cols */}
            <div className="lg:col-span-4 order-1 lg:order-2 relative">
                <div className="sticky top-24 space-y-6">
                    {/* The Buy Card */}
                    <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800 rounded-xl">
                         {/* Video Placeholder */}
                        <div className="relative h-56 bg-slate-900 group cursor-pointer flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />
                             <img src="/images/course-web.png" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700" alt="Preview"/>
                             <div className="relative z-10 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                                <PlayCircle className="w-8 h-8 text-black ml-1 fill-black/10" />
                             </div>
                             <div className="absolute bottom-4 text-white font-bold text-sm bg-black/50 px-3 py-1 rounded backdrop-blur-sm">معاينة هذه الدورة</div>
                        </div>
                        
                        <CardContent className="p-6 space-y-6">
                            <div className="text-center md:text-start border-b border-gray-100 pb-4">
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{courseData.price.toLocaleString()} <span className="text-lg font-normal text-gray-500">ريال</span></div>
                                <div className="text-sm text-gray-400 line-through">45,000 ريال</div>
                            </div>

                             {/* Enrollment Logic / Progress Tracker */}
                            {enrollmentStatus !== 'none' && enrollmentStatus !== 'cancelled' ? (
                                <div className="space-y-5 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    {/* 4-Step Progress Stepper */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between relative">
                                            {/* Connecting Line */}
                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
                                            
                                            {steps.map((step, idx) => {
                                                const isCompleted = idx < currentStepIndex
                                                const isCurrent = idx === currentStepIndex
                                                
                                                return (
                                                    <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2",
                                                            isCompleted ? "bg-green-600 border-green-600 text-white" :
                                                            isCurrent ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-50" :
                                                            "bg-white border-gray-300 text-gray-400"
                                                        )}>
                                                            {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                                                        </div>
                                                        <span className={cn(
                                                            "text-[10px] whitespace-nowrap font-medium",
                                                            isCurrent ? "text-blue-600" : 
                                                            isCompleted ? "text-green-600" : "text-gray-400"
                                                        )}>
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Status Text & Actions */}
                                    <div className="space-y-4">
                                        
                                        {enrollmentStatus === 'preliminary' && (
                                            <div className="text-center py-6 bg-blue-50 rounded-xl border border-blue-100">
                                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Clock className="w-6 h-6 animate-pulse" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-1">طلبك قيد المراجعة</h3>
                                                <p className="text-sm text-gray-600">بانتظار موافقة المدرب على طلب انضمامك</p>
                                                
                                                {/* Debug Button kept for flow testing */}
                                                <button onClick={DEBUG_simulateTrainerApproval} className="text-xs text-blue-400 underline mt-4 hover:text-blue-600">
                                                    (Test: قبول الطلب)
                                                </button>
                                            </div>
                                        )}

                                     {enrollmentStatus === 'pending_payment' && (
                                       <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 h-12 text-base font-bold">
                                                    إتمام الدفع واستلام الدورة
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>إتمام عملية الدفع</DialogTitle>
                                                    <DialogDescription>اختر وسيلة الدفع المناسبة.</DialogDescription>
                                                </DialogHeader>
                                                <Tabs defaultValue="card" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="card">دفع إلكتروني</TabsTrigger>
                                                        <TabsTrigger value="receipt">إرفاق صورة السند</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="card">
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="card-number">رقم البطاقة</Label>
                                                                <Input id="card-number" placeholder="0000 0000 0000 0000" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                                                                    <Input id="expiry" placeholder="MM/YY" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="cvv">CVV</Label>
                                                                    <Input id="cvv" placeholder="123" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="name">الاسم على البطاقة</Label>
                                                                <Input id="name" placeholder="الاسم بالكامل" />
                                                            </div>
                                                            <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700">ادفع الآن</Button>
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="receipt">
                                                        <div className="space-y-4 py-4">
                                                            <div className="bg-muted p-4 rounded text-sm border"><p className="font-mono">حساب الراجحي: SA00000000</p></div>
                                                            <Label>رفع الإيصال</Label>
                                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                                                                <Upload className="w-8 h-8 mb-2" />
                                                                <span className="text-xs">اضغط لرفع الصورة</span>
                                                                <Input type="file" className="hidden" />
                                                            </div>
                                                            <Button onClick={handlePayment} className="w-full">تأكيد الطلب</Button>
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </DialogContent>
                                       </Dialog>
                                    )}

                                    {enrollmentStatus === 'active' && (
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-4">
                                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-emerald-900">أنت مسجل في هذه الدورة</h3>
                                                <p className="text-emerald-700 text-sm mt-1">يمكنك الوصول لجميع محتويات الدورة الآن</p>
                                            </div>
                                            <Button asChild className="w-full h-11 text-base font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200">
                                                <Link href={`/student/courses/${courseId}`}>
                                                    الذهاب لمحتوى الدورة
                                                </Link>
                                            </Button>
                                        </div>
                                    )}

                                </div>
                                </div>

                            ) : (
                                <Dialog open={isRegDialogOpen} onOpenChange={setIsRegDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="w-full font-bold text-lg h-12 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:scale-[1.02]">
                                            سجل الآن
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>التسجيل المبدئي في الدورة</DialogTitle>
                                            <DialogDescription>
                                                الخطوة الأولى: يرجى تأكيد بياناتك لإرسال طلب الانضمام للمدرب.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">الاسم الكامل</Label>
                                                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                                <Input id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">رقم الهاتف</Label>
                                                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handlePreliminaryRegister} className="w-full">تأكيد التسجيل المبدئي</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                            
                            <div className="space-y-3 pt-2 text-sm text-gray-600 dark:text-gray-400">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100">هذه الدورة تتضمن:</h4>
                                <div className="flex items-center gap-3"><PlayCircle className="w-4 h-4 text-gray-400" /> 40 ساعة فيديو حسب الطلب</div>
                                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-gray-400" /> 3 مقالات</div>
                                <div className="flex items-center gap-3"><Upload className="w-4 h-4 text-gray-400" /> 5 مصادر قابلة للتحميل</div>
                                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gray-400" /> الوصول على الهاتف والتلفاز</div>
                                <div className="flex items-center gap-3"><Award className="w-4 h-4 text-gray-400" /> شهادة إتمام</div>
                            </div>
                            

                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}
