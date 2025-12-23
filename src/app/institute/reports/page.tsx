"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, DollarSign, BookOpen, Calendar } from "lucide-react"
import { useState } from "react"

// Mock data
const mockReports = {
  summary: {
    totalCourses: 12,
    totalStudents: 245,
    totalRevenue: 125000,
    averageRating: 4.6
  },
  courses: [
    {
      id: "1",
      title: "دورة البرمجة الأساسية",
      trainer: "فاطمة علي",
      enrolledStudents: 25,
      completedStudents: 20,
      revenue: 12500,
      rating: 4.5,
      startDate: "2024-01-01",
      endDate: "2024-02-01"
    },
    {
      id: "2",
      title: "دورة تطوير التطبيقات",
      trainer: "محمد أحمد",
      enrolledStudents: 20,
      completedStudents: 18,
      revenue: 16000,
      rating: 4.8,
      startDate: "2024-01-15",
      endDate: "2024-03-15"
    },
    {
      id: "3",
      title: "دورة إدارة المشاريع",
      trainer: "سارة خالد",
      enrolledStudents: 15,
      completedStudents: 12,
      revenue: 9000,
      rating: 4.2,
      startDate: "2024-02-01",
      endDate: "2024-03-01"
    }
  ],
  enrollments: [
    { month: "يناير", count: 45 },
    { month: "فبراير", count: 52 },
    { month: "مارس", count: 38 },
    { month: "أبريل", count: 67 },
    { month: "مايو", count: 43 }
  ],
  payments: [
    {
      id: "1",
      studentName: "علي أحمد",
      courseTitle: "دورة البرمجة الأساسية",
      amount: 500,
      date: "2024-01-10",
      status: "paid"
    },
    {
      id: "2",
      studentName: "فاطمة محمد",
      courseTitle: "دورة تطوير التطبيقات",
      amount: 800,
      date: "2024-01-15",
      status: "paid"
    },
    {
      id: "3",
      studentName: "أحمد علي",
      courseTitle: "دورة إدارة المشاريع",
      amount: 600,
      date: "2024-01-20",
      status: "refunded"
    }
  ]
}

export default function InstituteReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("courses")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير والمدفوعات</h1>
          <p className="text-gray-600 mt-2">عرض التقارير المالية والتسجيلات</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="quarter">ربع سنة</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدورات</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReports.summary.totalCourses}</div>
            <p className="text-xs text-muted-foreground">+2 من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReports.summary.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+15 من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReports.summary.totalRevenue.toLocaleString()} ريال يمني</div>
            <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReports.summary.averageRating}</div>
            <p className="text-xs text-muted-foreground">⭐ من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedReport === "courses" ? "default" : "outline"}
          onClick={() => setSelectedReport("courses")}
        >
          تقارير الدورات
        </Button>
        <Button
          variant={selectedReport === "enrollments" ? "default" : "outline"}
          onClick={() => setSelectedReport("enrollments")}
        >
          التسجيلات
        </Button>
        <Button
          variant={selectedReport === "payments" ? "default" : "outline"}
          onClick={() => setSelectedReport("payments")}
        >
          المدفوعات
        </Button>
      </div>

      {/* Courses Report */}
      {selectedReport === "courses" && (
        <Card>
          <CardHeader>
            <CardTitle>تقرير الدورات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الدورة</TableHead>
                  <TableHead>المدرب</TableHead>
                  <TableHead>الطلاب المسجلين</TableHead>
                  <TableHead>الطلاب المكتملين</TableHead>
                  <TableHead>الإيرادات</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>فترة الدورة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.trainer}</TableCell>
                    <TableCell>{course.enrolledStudents}</TableCell>
                    <TableCell>{course.completedStudents}</TableCell>
                    <TableCell>{course.revenue.toLocaleString()} ريال يمني</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>⭐ {course.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{course.startDate}</div>
                        <div className="text-gray-500">إلى {course.endDate}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Enrollments Report */}
      {selectedReport === "enrollments" && (
        <Card>
          <CardHeader>
            <CardTitle>تقرير التسجيلات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReports.enrollments.map((enrollment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{enrollment.month}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-bold">{enrollment.count}</span>
                    <span className="text-sm text-gray-500">طالب</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Report */}
      {selectedReport === "payments" && (
        <Card>
          <CardHeader>
            <CardTitle>تقرير المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>الدورة</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.studentName}</TableCell>
                    <TableCell>{payment.courseTitle}</TableCell>
                    <TableCell>{payment.amount} ريال يمني</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                        {payment.status === 'paid' ? 'مدفوع' : 'مسترد'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}