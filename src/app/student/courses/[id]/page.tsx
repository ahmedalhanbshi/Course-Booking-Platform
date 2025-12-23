"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  PlayCircle, 
  CheckCircle, 
  Award,
  User, 
  MessageSquare, 
  ArrowRight,
  Download,
  Video,
  AlertCircle,
  MapPin,
  Play,
  Link as LinkIcon,
  File,
  Ban,
  Lock,
  RefreshCcw
} from "lucide-react"

// Mock Data for the single course view
const mockCourseData = {
  id: "1",
  title: "تعلم React من الصفر",
  category: "تطوير الويب",
  description: "دورة شاملة في تعلم React.js مع مشاريع عملية. ستتعلم أساسيات React، إدارة الحالة، التوجيه، والعديد من المفاهيم المتقدمة.",
  progress: 75,
  nextSession: {
    title: "إدارة الحالة المتقدمة (Redux)",
    date: "2025-01-20",
    time: "10:00 AM",
    type: "online",
    link: "https://zoom.us/j/123456789"
  },
  instructor: {
    name: "أحمد محمد",
    role: "Senior Frontend Developer",
    avatar: "/images/avatar-1.png"
  },
  stats: {
    attendance: 90,
    assignments: 85,
    quizzes: 92
  },
  announcements: [
    {
      id: 1,
      title: "تغيير موعد المحاضرة القادمة",
      date: "2025-01-18",
      content: "تم تأجيل محاضرة الغد إلى يوم الاثنين القادم لأسباب تقنية."
    },
    {
      id: 2,
      title: "مشروع منتصف الدورة",
      date: "2025-01-15",
      content: "يرجى تسليم المشروع قبل نهاية الأسبوع الحالي."
    }
  ],
  materialsBySection: [
    {
      section: "الأسبوع الأول: المقدمة",
      materials: [
        { title: "شرح المحاضرة الأولى - PDF", type: "pdf", size: "2.4 MB" },
        { title: "فيديو شرح المكونات", type: "video", size: "15:30" },
        { title: "مشروع تطبيق TODO - GitHub", type: "link", size: "External" }
      ]
    },
    {
      section: "الأسبوع الثاني: إدارة الحالة",
      materials: [
        { title: "شرح useState و useEffect - PDF", type: "pdf", size: "3.1 MB" },
        { title: "فيديو عملي: إدارة الحالة", type: "video", size: "45:20" }
      ]
    }
  ],
  sessions: [
    {
      id: "1",
      title: "مقدمة في React",
      date: "2025-01-15",
      time: "10:00 AM - 12:00 PM",
      duration: "2h 30m",
      unit: "الوحدة الأولى: البداية",
      instructor: { name: "أحمد محمد" },
      type: "online",
      meetingLink: "https://zoom.us",
      status: "completed"
    },
    {
      id: "2",
      title: "المكونات في React",
      date: "2025-01-17",
      time: "10:00 AM - 12:00 PM",
      duration: "2h 00m",
      unit: "الوحدة الثانية: المكونات",
      instructor: { name: "أحمد محمد" },
      type: "online",
      meetingLink: "https://zoom.us",
      status: "completed"
    },
    {
      id: "3",
      title: "إدارة الحالة",
      date: "2025-01-20",
      time: "10:00 AM - 12:00 PM",
      duration: "1h 45m",
      unit: "الوحدة الثالثة: الحالة",
      instructor: { name: "أحمد محمد" },
      type: "online",
      meetingLink: "https://zoom.us",
      status: "scheduled"
    },
    {
      id: "4",
      title: "التوجيه في React",
      date: "2025-01-22",
      time: "10:00 AM - 12:00 PM",
      duration: "2h 15m",
      unit: "الوحدة الرابعة: التوجيه",
      instructor: { name: "أحمد محمد" },
      type: "in_person",
      status: "scheduled"
    }
  ]
}

export default function StudentCourseDashboard() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()

  // SIMULATED ENROLLMENT CHECK
  // In a real application, you would check the user's enrollment status from the backend/context.
  // SIMULATED STATES
  // In a real application, you would check the user's enrollment status from the backend/context.
  const isEnrolled = true // Set to false to test redirect
  const role = "student" // Hardcoded for this view
  const searchParams = useSearchParams()
 
  // Check if "completed" is passed in query, OR use a mock toggle if needed. 
  // For now, let's default to FALSE unless ?status=completed is present.
  const isCompleted = searchParams.get('status') === 'completed'
  const isCancelled = searchParams.get('status') === 'cancelled'

  if (!isEnrolled) {
    router.push(`/courses/${courseId}`)
    return null
  }


  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-secondary-foreground">
                  {mockCourseData.category}
                </Badge>
                <Badge variant="outline" className="text-secondary-foreground">
                  {mockCourseData.category}
                </Badge>
                <Badge className={
                    isCompleted ? "bg-emerald-600 hover:bg-emerald-700" : 
                    isCancelled ? "bg-red-600 hover:bg-red-700" :
                    "bg-green-600 hover:bg-green-700"
                }>
                  {isCompleted ? "مكتمل" : isCancelled ? "ملغاة" : "قيد التقدم"}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {mockCourseData.title}
              </h1>
              
              <p className="text-gray-600 max-w-2xl leading-relaxed">
                {mockCourseData.description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-bold text-gray-700">A</span>
                  </div>
                  <span>المدرب: {mockCourseData.instructor.name}</span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <Card className="w-full md:w-80 shadow-lg border-primary/10">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>نسبة الإنجاز</span>
                    <span className={
                        isCompleted ? "text-emerald-600 font-bold" : 
                        isCancelled ? "text-gray-400" :
                        "text-primary"
                    }>
                        {isCompleted ? 100 : mockCourseData.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={isCompleted ? 100 : mockCourseData.progress} 
                    className={
                        isCompleted ? "[&>div]:bg-emerald-600 h-2" : 
                        isCancelled ? "h-2 opacity-50 grayscale" :
                        "h-2"
                    } 
                  />
                </div>
                
                {/* Remove Continue Learning Button as requested */}
                
                <p className="text-xs text-center text-muted-foreground pt-2">
                  {isCompleted ? "أكملت جميع دروس الدورة" : "أكملت 12 من أصل 16 درس"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Right Column (Main) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next Session Alert */}
            {/* Next Session Alert OR Completion/Cancellation Banner */}
            {isCompleted ? (
                // Completion Banner
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <CardContent className="p-8 flex items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-full shadow-sm text-amber-500 border border-amber-100">
                                <Award className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-amber-900 mb-2">مبروك! لقد أتممت الدورة بنجاح</h3>
                                <p className="text-amber-700">يمكنك الآن تحميل شهادة إتمام الدورة ومشاركتها مع أصدقائك.</p>
                            </div>
                         </div>
                         
                         <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold gap-2 shadow-lg shadow-amber-200">
                            <Link href="/student/certificates">
                                <Download className="w-5 h-5" />
                                تحميل الشهادة
                            </Link>
                         </Button>
                    </CardContent>
                </Card>
            ) : isCancelled ? (
                // Cancelled Banner
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-8 flex items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-full shadow-sm text-red-500 border border-red-100">
                                <Ban className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-red-900 mb-2">عذراً، تم إلغاء اشتراكك في هذه الدورة</h3>
                                <p className="text-red-700">لم يعد بإمكانك الوصول لمحتوى الدورة. يرجى تجديد الاشتراك للمتابعة.</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            ) : (
                // Upcoming Session Banner
                <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <Video className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-blue-900 mb-2">المحاضرة القادمة: {mockCourseData.nextSession.title}</h3>
                        <div className="flex flex-wrap gap-6 text-sm text-blue-700">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {mockCourseData.nextSession.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {mockCourseData.nextSession.time}
                        </span>
                        </div>
                    </div>
                    </div>
                    
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold gap-2 px-6 h-10 shadow-sm text-sm border-2 border-transparent hover:border-blue-100 transition-all">
                    <Play className="w-4 h-4 fill-current" />
                    انضمام للدرس
                    </Button>
                </CardContent>
                </Card>
            )}

            <Tabs defaultValue="materials" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-gray-100/80 rounded-full gap-1">
                <TabsTrigger 
                  value="materials" 
                  className="rounded-full py-2.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
                >
                  المواد
                </TabsTrigger>
                <TabsTrigger 
                  value="schedule" 
                  className="rounded-full py-2.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
                >
                  الجدول الدراسي
                </TabsTrigger>
                <TabsTrigger 
                  value="announcements" 
                  className="rounded-full py-2.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
                >
                  الإعلانات
                </TabsTrigger>
              </TabsList>


              <TabsContent value="materials" className="mt-8 space-y-8 relative">
                 {isCancelled && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">المحتوى مقفل</h3>
                        <p className="text-gray-500 text-sm">يجب إعادة الاشتراك للوصول للمواد</p>
                    </div>
                 )}
                 
                {/* Materials List */}
                <div className={isCancelled ? "opacity-40 pointer-events-none select-none filter blur-sm transition-all" : ""}>
                {mockCourseData.materialsBySection.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                     <div className="flex items-center gap-2 pr-1">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-lg text-gray-800">{section.section}</h3>
                        <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-full">{section.materials.length} مادة</span>
                        <Button size="sm" className="mr-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4">
                           <Download className="w-4 h-4" />
                           تحميل الكل
                        </Button>
                     </div>
                      {section.materials.map((material, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-3 transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                          dir="rtl"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {material.type === 'pdf' ? <FileText className="h-5 w-5 text-red-500" /> : 
                               material.type === 'video' ? <Play className="h-5 w-5 text-blue-500" /> :
                               material.type === 'link' ? <LinkIcon className="h-5 w-5 text-green-500" /> :
                               <File className="h-5 w-5 text-gray-500" />}
                            </div>
                            <div className="text-right">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {material.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {material.type === 'pdf' ? 'PDF' : 
                                     material.type === 'video' ? 'فيديو' :
                                     material.type === 'link' ? 'رابط' : material.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-muted-foreground" dir="ltr">{material.size}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            {material.type === 'link' ? (
                              <>
                                <LinkIcon className="h-4 w-4" />
                                زيارة
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                {material.type === 'video' ? 'مشاهدة' : 'تحميل'}
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                  </div>
                ))}
                </div>
              </TabsContent>

             <TabsContent value="schedule" className="mt-6 relative">
                  {isCancelled && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">الجدول مقفل</h3>
                        <p className="text-gray-500 text-sm">يجب إعادة الاشتراك</p>
                    </div>
                 )}
                 <div className={isCancelled ? "opacity-40 pointer-events-none select-none filter blur-sm transition-all" : ""}>
                  <Card>

                    <CardHeader>
                      <CardTitle>جدول الدروس</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                     {mockCourseData.sessions.map((session) => (
                       <div 
                         key={session.id} 
                         className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 mb-4" 
                         dir="rtl"
                       >
                         {/* Right Section: Content */}
                         <div className="flex-1 space-y-3">
                           {/* Unit & Title */}
                           <div>
                             <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
                               <Award className="w-3 h-3" />
                               {session.unit || 'الوحدة العامة'}
                             </p>
                             <h3 className="font-bold text-xl text-gray-900 leading-tight">
                               {session.title}
                             </h3>
                           </div>
                           
                           {/* Metadata Row */}
                           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                             {/* Instructor */}
                             <div className="flex items-center gap-1.5">
                               <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                 <span className="text-[10px]">👤</span>
                               </div>
                               <span className="font-medium text-gray-600">{session.instructor?.name || 'المدرب'}</span>
                             </div>

                             {/* Date */}
                             <div className="flex items-center gap-1.5">
                               <Calendar className="w-4 h-4 text-gray-400" />
                               <span>{session.date}</span>
                             </div>

                             {/* Time */}
                             <div className="flex items-center gap-1.5">
                               <Clock className="w-4 h-4 text-gray-400" />
                               <span dir="ltr">{session.time}</span>
                             </div>


                             
                             {/* Type */}
                             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                               {session.type === 'online' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-gray-500" />}
                               <span className={`text-xs ${session.type === 'online' ? "text-blue-600" : "text-gray-600"}`}>
                                 {session.type === 'online' ? 'أونلاين' : 'حضوري'}
                               </span>
                             </div>
                           </div>
                         </div>

                         {/* Left Section: Status & Actions */}
                         <div className="flex flex-col items-end gap-3 self-start mr-4">
                            <Badge variant="outline" className={
                              session.status === 'completed' 
                                ? "px-3 py-1 font-medium text-gray-500 border-gray-200 bg-gray-100 rounded-full" 
                                : "px-3 py-1 font-medium text-green-700 border-green-200 bg-green-50 rounded-full"
                            }>
                              {session.status === 'completed' ? 'مكتمل' : 'قادم'}
                            </Badge>

                            {session.type === 'online' && session.status === 'scheduled' && !isCompleted && (
                               <Button size="sm" className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 text-xs font-medium shadow-sm hover:shadow-md transition-all" asChild>
                                 <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                   <PlayCircle className="w-3.5 h-3.5" />
                                   دخول
                                 </a>
                               </Button>
                            )}
                         </div>
                       </div>
                     ))}
                 </CardContent>
                 </Card>
                </div>
              </TabsContent>

              <TabsContent value="announcements" className="mt-6 space-y-4 relative">
                 {isCancelled && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">الإعلانات مقفلة</h3>
                        <p className="text-gray-500 text-sm">يجب إعادة الاشتراك</p>
                    </div>
                 )}
                <div className={isCancelled ? "opacity-40 pointer-events-none select-none filter blur-sm transition-all text-right" : "text-right"}>
                {mockCourseData.announcements.map((announcement) => (
                  <div 
                    key={announcement.id}
                    className="bg-white p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all mb-4"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2 text-gray-900">
                          <AlertCircle className="w-5 h-5 text-primary" />
                          {announcement.title}
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">{announcement.date}</span>
                      </div>

                    <p className="text-gray-600 leading-relaxed text-right">
                      {announcement.content}
                    </p>
                  </div>
                ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Left Column (Sidebar) */}
          <div className="space-y-6">
            {/* Quick Actions */}


            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">عن المدرب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden border">
                    <Image 
                      src={mockCourseData.instructor.avatar} 
                      alt={mockCourseData.instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{mockCourseData.instructor.name}</p>
                    <p className="text-xs text-muted-foreground">{mockCourseData.instructor.role}</p>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                {/* Replaced Message Button with Contact Info */}
                <div className="space-y-3 text-sm">
                   <div className="flex items-center gap-3 text-gray-600">
                     <div className="p-1.5 bg-gray-100 rounded-md">
                        {/* Using MessageSquare icon as a general contact icon or similar */}
                        <MessageSquare className="w-4 h-4" />
                     </div>
                     <span className="font-medium" dir="ltr">+966 50 123 4567</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-600">
                     <div className="p-1.5 bg-gray-100 rounded-md">
                        <FileText className="w-4 h-4" /> {/* Fallback icon, usually Mail but using standard Lucide imports */}
                     </div>
                     <span className="font-medium">instructor@example.com</span>
                   </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
