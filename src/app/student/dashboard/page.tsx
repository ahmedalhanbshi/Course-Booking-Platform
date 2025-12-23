"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award, Calendar, Play, TrendingUp, Users, Bell, ChevronLeft, Search, ArrowUpRight } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { User } from "@/types"

// Mock data for student dashboard
const mockUser: User = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: 'student' as const,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

const currentCourses = [
  {
    id: "1",
    title: "تعلم React من الصفر",
    trainer: "أحمد محمد",
    progress: 75,
    nextSession: "2025-01-20T14:00:00",
    totalSessions: 20,
    completedSessions: 15,
    image: "https://placehold.co/600x400/2563eb/ffffff?text=React+Course",
    category: "تطوير الويب",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "2",
    title: "تصميم واجهات المستخدم",
    trainer: "فاطمة علي",
    progress: 45,
    nextSession: "2025-01-22T10:00:00",
    totalSessions: 15,
    completedSessions: 7,
    image: "https://placehold.co/600x400/16a34a/ffffff?text=UI+Design",
    category: "تصميم",
    color: "from-emerald-500 to-teal-400"
  }
]

const upcomingSessions = [
  {
    id: "1",
    courseTitle: "تعلم React من الصفر",
    title: "Hooks في React",
    startTime: new Date("2025-01-20T14:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "2",
    courseTitle: "تصميم واجهات المستخدم",
    title: "مبادئ التصميم الأساسية",
    startTime: new Date("2025-01-22T10:00:00"),
    type: "in_person",
    location: "قاعة المحاضرات الأولى"
  }
]

const recentNotifications = [
  {
    id: "1",
    title: "تم رفع مادة جديدة",
    message: "تم رفع محاضرة 'المكونات في React' في دورة تعلم React",
    time: "منذ ساعتين",
    type: "material"
  },
  {
    id: "2",
    title: "تذكير بالدرس",
    message: "درس 'Hooks في React' سيبدأ غداً",
    time: "منذ 4 ساعات",
    type: "reminder"
  }
]

export default function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* Compact Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl mix-blend-overlay" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
          <div className="space-y-3 text-center md:text-right max-w-2xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                مرحباً بك، {mockUser.name} 👋
              </h1>
              <p className="text-blue-100 text-sm md:text-base opacity-90">
                لديك <span className="font-bold text-white">{upcomingSessions.length} دروس قادمة</span> و <span className="font-bold text-white">{currentCourses.length} دورات نشطة</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-5 h-9" asChild>
                <Link href="/student/my-courses">
                  <BookOpen className="ml-2 h-4 w-4" />
                  دوراتي
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm border-0 rounded-full px-5 h-9" asChild>
                <Link href="/student/courses">
                  <Search className="ml-2 h-4 w-4" />
                  تصفح الدورات
                </Link>
              </Button>
            </div>
          </div>

          {/* Compact Stats */}
          <div className="hidden lg:flex gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">{currentCourses.length}</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase">دورات نشطة</div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">2</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase">دورات مكتملة</div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">3</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase">شهادات</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Right Column: Courses & Progress */}
        <div className="lg:col-span-2 space-y-6">

          {/* Current Courses List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                دوراتي الحالية
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 h-8" asChild>
                <Link href="/student/my-courses">
                  عرض الكل <ChevronLeft className="mr-1 h-3 w-3" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {currentCourses.map((course) => (
                <div key={course.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Course Visual */}
                    <div className={`w-full md:w-48 relative overflow-hidden bg-gradient-to-br ${course.color} p-4 flex flex-col justify-between text-white`}>
                      <div className="relative z-10">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm text-[10px] px-2 py-0.5 h-5">
                          {course.category}
                        </Badge>
                      </div>
                      <div className="relative z-10 mt-2">
                        <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
                      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-black/5 blur-xl" />
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {course.title}
                          </h3>
                          <Badge variant={course.progress > 50 ? "default" : "secondary"} className="font-sans shrink-0 text-[10px] h-5">
                            {course.progress}%
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className="font-medium">المدرب:</span> {course.trainer}
                        </p>

                        <div className="space-y-1.5 mb-2">
                          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                            <span>التقدم العام</span>
                            <span>{course.completedSessions} من {course.totalSessions} درس</span>
                          </div>
                          <Progress value={course.progress} className="h-2 bg-gray-100" />
                        </div>
                      </div>

                      <div className="flex items-center justify-end mt-2 pt-3 border-t border-gray-50">
                        <Button size="sm" className="rounded-full px-5 h-8 text-xs bg-gray-900 hover:bg-indigo-600 text-white transition-colors shadow-none hover:shadow-md" asChild>
                          <Link href={`/student/courses/${course.id}`}>
                            <Play className="ml-1.5 h-3 w-3 fill-current" />
                            متابعة التعلم
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Column: Sidebar */}
        <div className="space-y-6">

          {/* Upcoming Sessions */}
          <Card className="border-none shadow-md bg-white overflow-hidden ring-1 ring-gray-100 rounded-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3 px-4">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4 text-indigo-600" />
                الدروس القادمة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => {
                    const date = new Date(session.startTime);
                    const dayName = date.toLocaleDateString('ar-EG', { weekday: 'long' });
                    const dayNumber = date.getDate();
                    const monthName = date.toLocaleDateString('ar-EG', { month: 'short' });

                    return (
                      <div key={session.id} className="group p-3 hover:bg-indigo-50/30 transition-colors flex gap-3 items-center">
                        <div className="flex-shrink-0 w-12 h-14 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center text-center overflow-hidden group-hover:border-indigo-200 group-hover:shadow-sm transition-all">
                          <span className="text-[9px] uppercase font-bold bg-gray-50 w-full py-0.5 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {monthName}
                          </span>
                          <span className="text-lg font-bold text-gray-900 leading-none mt-0.5">
                            {dayNumber}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                              {dayName}
                            </span>
                            {session.type === 'online' && (
                              <Badge variant="outline" className="text-[9px] h-4 px-1 border-blue-100 text-blue-600 bg-blue-50">
                                أونلاين
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-gray-900 truncate group-hover:text-indigo-600 transition-colors mb-0.5">
                            {session.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 truncate mb-1">
                            {session.courseTitle}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatTime(session.startTime)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 px-4">
                    <p className="text-gray-500 text-xs">لا توجد دروس قادمة قريباً</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-gray-50/50 border-t border-gray-100">
                <Button variant="outline" size="sm" className="w-full text-xs font-medium hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all h-8" asChild>
                  <Link href="/student/schedule">
                    عرض الجدول الكامل
                    <ArrowUpRight className="mr-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-none shadow-md bg-white overflow-hidden ring-1 ring-gray-100 rounded-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3 px-4">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Bell className="h-4 w-4 text-orange-500" />
                آخر الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="p-3 hover:bg-orange-50/30 transition-colors flex gap-3 items-start group">
                    <div className={`w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 shadow-sm transition-transform group-hover:scale-125 ${notification.type === 'material' ? 'bg-blue-500 shadow-blue-200' : 'bg-orange-500 shadow-orange-200'
                      }`} />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">{notification.title}</h4>
                      <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-[9px] text-gray-400 mt-1 block font-medium">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50/50 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-gray-900 hover:bg-white h-8" asChild>
                  <Link href="/student/notifications">
                    عرض كل الإشعارات
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}