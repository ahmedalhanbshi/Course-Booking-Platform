"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Calendar, MapPin, Plus, Settings, MessageSquare, TrendingUp, Clock, CheckCircle, ArrowUpRight } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

// Mock user data
const mockUser = {
  id: "2",
  name: "فاطمة علي",
  email: "fatima@example.com",
  role: 'trainer' as const,
}

// Mock trainer stats
const trainerStats = {
  activeCourses: 3,
  totalStudents: 87,
  totalSessions: 45,
  upcomingSessions: 8,
  pendingRoomBookings: 2,
}

// Mock upcoming sessions
const upcomingSessions = [
  {
    id: "1",
    courseTitle: "تصميم واجهات المستخدم",
    title: "مبادئ التصميم الأساسية",
    startTime: new Date("2025-01-20T10:00:00"),
    endTime: new Date("2025-01-20T12:00:00"),
    type: "in_person",
    room: "قاعة المحاضرات الأولى",
    enrolledStudents: 25,
  },
  {
    id: "2",
    courseTitle: "تعلم React من الصفر",
    title: "المكونات في React",
    startTime: new Date("2025-01-22T14:00:00"),
    endTime: new Date("2025-01-22T16:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    enrolledStudents: 32,
  },
  {
    id: "3",
    courseTitle: "إدارة المشاريع الرقمية",
    title: "منهجية Agile",
    startTime: new Date("2025-01-25T09:00:00"),
    endTime: new Date("2025-01-25T11:00:00"),
    type: "in_person",
    room: "قاعة التدريب الرئيسية",
    enrolledStudents: 18,
  },
]

// Mock pending room bookings
const pendingRoomBookings = [
  {
    id: "1",
    courseTitle: "تصميم واجهات المستخدم",
    sessionTitle: "أدوات التصميم المتقدمة",
    requestedDate: new Date("2025-02-01"),
    duration: 2,
    requestedRoom: "قاعة المحاضرات الثانية",
    status: "pending",
  },
  {
    id: "2",
    courseTitle: "تعلم Python للمبتدئين",
    sessionTitle: "المشاريع العملية",
    requestedDate: new Date("2025-02-05"),
    duration: 3,
    requestedRoom: "قاعة الحاسوب الأولى",
    status: "pending",
  },
]

// Mock recent activities
const recentActivities = [
  {
    id: "1",
    type: "enrollment",
    message: "طالب جديد انضم إلى دورة 'تصميم واجهات المستخدم'",
    time: "منذ ساعتين",
  },
  {
    id: "3",
    type: "session",
    message: "انتهت درس 'Hooks في React' بنجاح",
    time: "منذ يوم واحد",
  },
]

export default function TrainerDashboard() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="h-4 w-4 text-blue-500" />
      case 'session': return <CheckCircle className="h-4 w-4 text-indigo-500" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg border border-blue-800/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl mix-blend-overlay" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
          <div className="space-y-3 text-center md:text-right max-w-2xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                مرحباً بك، {mockUser.name} 👋
              </h1>
              <p className="text-blue-100 text-sm md:text-base opacity-90">
                لديك <span className="font-bold text-white">{trainerStats.upcomingSessions} دروس قادمة</span> و <span className="font-bold text-white">{trainerStats.activeCourses} دورات نشطة</span> تحتاج لمتابعتك.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button variant="secondary" size="sm" className="bg-white text-blue-900 hover:bg-blue-50 shadow-sm border-0 rounded-full px-5 h-9" asChild>
                <Link href="/trainer/schedule">
                  <Calendar className="ml-2 h-4 w-4" />
                  جدولي
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-800/50 text-white hover:bg-blue-800 border-blue-700/50 rounded-full px-5 h-9 backdrop-blur-sm" asChild>
                <Link href="/trainer/courses/create">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء دورة
                </Link>
              </Button>
            </div>
          </div>

          {/* Compact Stats */}
          <div className="hidden lg:flex gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">{trainerStats.totalStudents}</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase">طالب</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">{trainerStats.activeCourses}</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase">دورات</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Content - Expanded to Full Width */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card className="border-none shadow-md overflow-hidden ring-1 ring-gray-100 dark:ring-border rounded-xl">
            <CardHeader className="bg-gray-50/50 dark:bg-muted/20 border-b border-gray-100 dark:border-border py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                الدروس القادمة
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link href="/trainer/schedule">عرض الجدول</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-muted/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800">
                          <span className="text-xs font-bold">{formatDate(session.startTime).split(' ')[0]}</span>
                          <span className="text-lg font-bold leading-none">{formatDate(session.startTime).split(' ')[1]}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-gray-100">{session.title}</h3>
                          <p className="text-xs text-gray-500 mb-1">{session.courseTitle}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {session.enrolledStudents} طالب
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant={session.type === 'online' ? 'secondary' : 'outline'}>
                        {session.type === 'online' ? 'أونلاين' : 'حضوري'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Room Bookings */}
          {pendingRoomBookings.length > 0 && (
            <Card className="border-none shadow-md overflow-hidden ring-1 ring-gray-100 dark:ring-border rounded-xl">
              <CardHeader className="bg-gray-50/50 dark:bg-muted/20 border-b border-gray-100 dark:border-border py-3 px-4">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800 dark:text-amber-400">
                  <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  طلبات حجز القاعات المعلقة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-amber-50/50">
                   {/* Changed from list to grid for better space usage now that we have width */}
                  {pendingRoomBookings.map((booking) => (
                    <div key={booking.id} className="p-4 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-muted/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{booking.sessionTitle}</h3>
                          <p className="text-xs text-gray-500 mb-2">{booking.courseTitle}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(booking.requestedDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.requestedRoom}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">معلق</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
                  <Button variant="link" size="sm" className="text-blue-600 dark:text-blue-400 h-auto p-0" asChild>
                    <Link href="/trainer/room-bookings">
                      إدارة جميع الطلبات
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}