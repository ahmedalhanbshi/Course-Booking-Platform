"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BookOpen, DollarSign, MapPin, Clock, Building2, TrendingUp, Plus, ArrowUpRight } from "lucide-react"

// Mock data - in real app, this would come from API
const mockInstitute = {
  name: "معهد المستقبل للتقنية",
  adminName: "محمد المدير"
}

const mockStats = {
  activeCourses: 12,
  roomBookingsToday: 8,
  totalStudents: 245,
  monthlyRevenue: 45000
}

const mockRecentBookings = [
  {
    id: "1",
    courseTitle: "دورة البرمجة الأساسية",
    trainer: "فاطمة علي",
    room: "قاعة 101",
    date: "2024-01-15",
    time: "10:00 - 12:00",
    status: "pending" as const
  },
  {
    id: "2",
    courseTitle: "دورة التصميم الجرافيكي",
    trainer: "محمد أحمد",
    room: "قاعة 203",
    date: "2024-01-15",
    time: "14:00 - 16:00",
    status: "approved" as const
  }
]

const mockUpcomingCourses = [
  {
    id: "1",
    title: "دورة تطوير التطبيقات",
    trainer: "سارة خالد",
    startDate: "2024-01-20",
    enrolledStudents: 25,
    maxStudents: 30
  },
  {
    id: "2",
    title: "دورة إدارة المشاريع",
    trainer: "علي حسن",
    startDate: "2024-01-25",
    enrolledStudents: 18,
    maxStudents: 25
  }
]

export default function InstituteDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl mix-blend-overlay" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
          <div className="space-y-3 text-center md:text-right max-w-2xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                مرحباً بك، {mockInstitute.adminName} 👋
              </h1>
              <p className="text-purple-100 text-sm md:text-base opacity-90">
                إدارة {mockInstitute.name} - لديك <span className="font-bold text-white">{mockStats.roomBookingsToday} حجوزات اليوم</span> و <span className="font-bold text-white">{mockStats.activeCourses} دورات نشطة</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-5 h-9" asChild>
                <Link href="/institute/courses/create">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة دورة
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="bg-white text-purple-700 hover:bg-purple-50 shadow-sm border-0 rounded-full px-5 h-9" asChild>
                <Link href="/institute/room-bookings">
                  <Calendar className="ml-2 h-4 w-4" />
                  جدول القاعات
                </Link>
              </Button>
            </div>
          </div>

          {/* Compact Stats */}
          <div className="hidden lg:flex gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">{mockStats.totalStudents}</div>
              <div className="text-[10px] font-medium text-purple-200 uppercase">طالب</div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[90px]">
              <div className="text-2xl font-bold mb-0.5">{mockStats.activeCourses}</div>
              <div className="text-[10px] font-medium text-purple-200 uppercase">دورة</div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-[120px]">
              <div className="text-2xl font-bold mb-0.5">{mockStats.monthlyRevenue.toLocaleString()}</div>
              <div className="text-[10px] font-medium text-purple-200 uppercase">ريال يمني</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">

        {/* Main Content */}
        <div className="space-y-6">

          {/* Recent Room Bookings */}
          <Card className="border-none shadow-md bg-white overflow-hidden ring-1 ring-gray-100 rounded-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Clock className="h-4 w-4 text-purple-600" />
                أحدث طلبات حجز القاعات
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link href="/institute/room-bookings">عرض الكل</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {mockRecentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-purple-50 text-purple-600 rounded-lg">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{booking.courseTitle}</p>
                          <p className="text-xs text-gray-500 mb-1">{booking.trainer}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium text-gray-700">{booking.room}</span>
                            <span>•</span>
                            {booking.date} • {booking.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant={booking.status === 'approved' ? 'default' : 'secondary'} className={booking.status === 'approved' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}>
                        {booking.status === 'approved' ? 'مقبول' : 'قيد المراجعة'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Courses */}
          <Card className="border-none shadow-md bg-white overflow-hidden ring-1 ring-gray-100 rounded-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <BookOpen className="h-4 w-4 text-purple-600" />
                الدورات القادمة
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link href="/institute/courses">إدارة الدورات</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {mockUpcomingCourses.map((course) => (
                  <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{course.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">المدرب: {course.trainer}</p>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {course.enrolledStudents}/{course.maxStudents} طالب
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Calendar className="h-3 w-3" />
                      يبدأ في: {course.startDate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}