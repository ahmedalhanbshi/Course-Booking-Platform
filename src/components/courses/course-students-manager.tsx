"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Mail, MessageSquare, Eye, CheckCircle, XCircle, Clock, ArrowLeft, Send, UserCheck, Phone, Calendar, BookOpen, Award, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Enrollment, User, Course } from "@/types"
import { useState } from "react"

// ... (Rest of imports and mock data are fine, just ensuring the import line is updated)

interface CourseStudentsManagerProps {
  courseId: string
  backLink: string
  backText: string
}

// Mock user data
const mockUser: User = {
  id: "2",
  name: "فاطمة علي",
  email: "fatima@example.com",
  role: 'trainer' as const,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock course data
const mockCourse: Course = {
  id: "1",
  title: "تعلم React من الصفر",
  description: "دورة شاملة في تعلم React.js",
  price: 29900,
  duration: 40,
  startDate: new Date("2025-02-01"),
  endDate: new Date("2025-03-15"),
  maxStudents: 50,
  enrolledStudents: 23,
  rating: 4.8,
  reviewCount: 156,
  status: 'active',
  category: "تطوير الويب",
  deliveryType: 'online',
  trainerId: "2",
  trainer: {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    role: 'trainer' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock enrolled students
const mockEnrollments: (Enrollment & { student: { id: string; name: string; email: string; phone?: string } })[] = [
  {
    id: "1",
    studentId: "3",
    courseId: "1",
    enrolledAt: new Date("2025-01-15"),
    status: 'active',
    progress: 75,
    student: {
      id: "3",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+966501234567",
    }
  },
  {
    id: "2",
    studentId: "4",
    courseId: "1",
    enrolledAt: new Date("2025-01-16"),
    status: 'active',
    progress: 60,
    student: {
      id: "4",
      name: "فاطمة أحمد",
      email: "fatima.ahmed@example.com",
      phone: "+966507654321",
    }
  },
  {
    id: "3",
    studentId: "5",
    courseId: "1",
    enrolledAt: new Date("2025-01-17"),
    status: 'active',
    progress: 0,
    student: {
      id: "5",
      name: "محمد علي",
      email: "mohamed.ali@example.com",
      phone: "+966509876543",
    }
  },
  {
    id: "4",
    studentId: "6",
    courseId: "1",
    enrolledAt: new Date("2025-01-18"),
    status: 'completed',
    progress: 100,
    student: {
      id: "6",
      name: "سارة حسن",
      email: "sara.hassan@example.com",
      phone: "+966502468135",
    }
  },
  {
    id: "5",
    studentId: "7",
    courseId: "1",
    enrolledAt: new Date("2025-01-14"),
    status: 'cancelled',
    progress: 20,
    student: {
      id: "7",
      name: "خالد عمر",
      email: "khaled.omar@example.com",
      phone: "+966508642975",
    }
  },
]
export default function CourseStudentsManager({ courseId, backLink, backText }: CourseStudentsManagerProps) {
  const [enrollments] = useState(mockEnrollments.filter(e => e.status !== 'completed'))
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "announcement",
  })
  
  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<(typeof mockEnrollments)[0] | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")

  // Student Details Dialog State
  const [viewStudent, setViewStudent] = useState<(typeof mockEnrollments)[0] | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const activeEnrollments = enrollments.filter(e => e.status === 'active')
  const completedEnrollments = enrollments.filter(e => e.status === 'completed')

  const getStatusLabel = (status: Enrollment['status']) => {
    switch (status) {
      case 'active': return 'مستمر'
      case 'cancelled': return 'ملغى'
      default: return status
    }
  }

  const getStatusColor = (status: Enrollment['status']) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'completed': return 'text-blue-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  
  const handleDeleteClick = (enrollment: typeof mockEnrollments[0]) => {
    setStudentToDelete(enrollment)
    setCancellationReason("")
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    // In a real app, you would call an API to unenroll the student here
    console.log("Unenrolling student:", studentToDelete?.studentId, "Reason:", cancellationReason)
    setIsDeleteDialogOpen(false)
    setStudentToDelete(null)
    setCancellationReason("")
  }

  const handleSendNotification = () => {
    if (!notificationData.title || !notificationData.message) return

    // In real app, this would send notifications to selected students
    console.log('Sending notification to students:', selectedStudents, notificationData)

    setShowNotificationDialog(false)
    setSelectedStudents([])
    setNotificationData({ title: "", message: "", type: "announcement" })
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === activeEnrollments.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(activeEnrollments.map(e => e.studentId))
    }
  }

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleViewStudent = (enrollment: typeof mockEnrollments[0]) => {
    setViewStudent(enrollment)
    setShowDetailsDialog(true)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backText}
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إدارة المسجّلين
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>
      
       {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">إلغاء تسجيل طالب</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في إلغاء تسجيل الطالب {studentToDelete?.student.name} من هذه الدورة؟
              <br />
              هذا الإجراء سيقوم بإزالة الطالب من قائمة المسجلين في هذه الدورة فقط.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
              <Label htmlFor="cancellation-reason" className="text-sm font-medium">
                  سبب إلغاء التسجيل <span className="text-red-500">*</span>
              </Label>
              <Textarea
                  id="cancellation-reason"
                  placeholder="يرجى كتابة سبب استبعاد الطالب من الدورة..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                  {cancellationReason.length < 5 ? (
                      <span className="text-red-500">يجب كتابة 5 أحرف على الأقل</span>
                  ) : (
                      <span className="text-green-600">السبب مقبول</span>
                  )}
              </p>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={cancellationReason.trim().length < 5}
            >
              نعم، إلغاء التسجيل
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المسجّلين</p>
                <p className="text-2xl font-bold">{enrollments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">طلاب نشطين</p>
                <p className="text-2xl font-bold">{activeEnrollments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
          <DialogTrigger asChild>
            <Button
              disabled={selectedStudents.length === 0}
              onClick={() => setShowNotificationDialog(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              إرسال إشعار ({selectedStudents.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إرسال إشعار للطلاب</DialogTitle>
              <DialogDescription>
                أرسل إشعاراً للطلاب المحددين ({selectedStudents.length} طالب)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-title">عنوان الإشعار</Label>
                <Input
                  id="notification-title"
                  placeholder="مثال: تذكير بموعد الدرس"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-message">نص الإشعار</Label>
                <Textarea
                  id="notification-message"
                  placeholder="اكتب رسالة الإشعار..."
                  value={notificationData.message}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>نوع الإشعار</Label>
                <Select
                  value={notificationData.type}
                  onValueChange={(value) => setNotificationData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">إعلان عام</SelectItem>
                    <SelectItem value="reminder">تذكير</SelectItem>
                    <SelectItem value="update">تحديث</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSendNotification}>
                  <Send className="mr-2 h-4 w-4" />
                  إرسال الإشعار
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          تصدير قائمة الطلاب
        </Button>
      </div>

      {/* Student Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الطالب</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{viewStudent.student.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Mail className="h-4 w-4" />
                      <span>{viewStudent.student.email}</span>
                    </div>
                    {viewStudent.student.phone && (
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Phone className="h-4 w-4" />
                        <span>{viewStudent.student.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(viewStudent.status)}>
                  {getStatusLabel(viewStudent.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">تاريخ التسجيل</span>
                  </div>
                  <p className="text-gray-900">{formatDate(viewStudent.enrolledAt)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">التقدم في الدورة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${viewStudent.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{viewStudent.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">ملاحظات وإجراءات سريعة</h4>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setShowDetailsDialog(false)
                    setSelectedStudents([viewStudent.studentId])
                    setShowNotificationDialog(true)
                  }}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    إرسال رسالة
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <UserCheck className="mr-2 h-4 w-4" />
                    تحديث الحالة
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلاب المسجّلين</CardTitle>
          <CardDescription>
            جميع الطلاب المسجّلين في الدورة مع حالة التسجيل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === activeEnrollments.length && activeEnrollments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                    aria-label="تحديد جميع الطلاب"
                  />
                </TableHead>
                <TableHead>الطالب</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>حالة التسجيل</TableHead>
                <TableHead>الشهادة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    {enrollment.status === 'active' && (
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(enrollment.studentId)}
                        onChange={() => handleSelectStudent(enrollment.studentId)}
                        className="rounded"
                        aria-label={`تحديد الطالب ${enrollment.student.name}`}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enrollment.student.name}</div>
                      <div className="text-sm text-gray-500">{enrollment.student.email}</div>
                      {enrollment.student.phone && (
                        <div className="text-sm text-gray-500">{enrollment.student.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(enrollment.status)}>
                      {getStatusLabel(enrollment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                          console.log("Open certificate modal for student", enrollment.student.id)
                      }}
                    >
                        <Award className="h-4 w-4 mr-2" />
                        إضافة شهادة
                    </Button>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewStudent(enrollment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {enrollment.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectStudent(enrollment.studentId)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleDeleteClick(enrollment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {enrollments.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                لا يوجد طلاب مسجّلين
              </h3>
              <p className="text-gray-500">
                لم يسجل أي طالب في هذه الدورة بعد
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ملخص التسجيل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">

              <div className="flex justify-between">
                <span className="text-gray-600">نشطين:</span>
                <span className="font-medium text-green-600">
                  {activeEnrollments.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إحصائيات التسجيل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي التسجيلات:</span>
                <span className="font-medium">{enrollments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">معدل التسجيل الأسبوعي:</span>
                <span className="font-medium">3.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">أعلى تقدم:</span>
                <span className="font-medium">
                  {Math.max(...enrollments.map(e => e.progress))}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
