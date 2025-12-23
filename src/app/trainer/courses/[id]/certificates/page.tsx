"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Award, Download, CheckCircle, Users, ArrowLeft, FileText, Calendar, Trophy } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Enrollment, User, Course } from "@/types"
import { useState } from "react"

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

// Mock completed enrollments (eligible for certificates)
const mockCompletedEnrollments: (Enrollment & {
  student: { id: string; name: string; email: string }
  attendanceRate: number
  finalGrade: number
  certificateIssued: boolean
  certificateId?: string
})[] = [
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
      },
      attendanceRate: 95,
      finalGrade: 92,
      certificateIssued: false,
    },
    {
      id: "7",
      studentId: "8",
      courseId: "1",
      enrolledAt: new Date("2025-01-10"),
      status: 'completed',
      progress: 100,
      student: {
        id: "8",
        name: "أحمد سالم",
        email: "ahmed.salem@example.com",
      },
      attendanceRate: 88,
      finalGrade: 87,
      certificateIssued: true,
      certificateId: "CERT-2025-001",
    },
    {
      id: "8",
      studentId: "9",
      courseId: "1",
      enrolledAt: new Date("2025-01-12"),
      status: 'completed',
      progress: 100,
      student: {
        id: "9",
        name: "نورة محمد",
        email: "noura.mohamed@example.com",
      },
      attendanceRate: 100,
      finalGrade: 95,
      certificateIssued: false,
    },
    {
      id: "9",
      studentId: "10",
      courseId: "1",
      enrolledAt: new Date("2025-01-05"),
      status: 'completed',
      progress: 100,
      student: {
        id: "10",
        name: "محمد عبدالله",
        email: "mohamed.abdullah@example.com",
      },
      attendanceRate: 92,
      finalGrade: 89,
      certificateIssued: true,
      certificateId: "CERT-2025-002",
    },
  ]

export default function TrainerCertificatesPage() {
  const params = useParams()
  const courseId = params.id as string

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [issuedCertificates, setIssuedCertificates] = useState<Array<{ studentId: string, certificateId: string }>>([])
  const [isIssuing, setIsIssuing] = useState(false)

  const eligibleStudents = mockCompletedEnrollments.filter(e => !e.certificateIssued)
  const issuedCertificatesList = mockCompletedEnrollments.filter(e => e.certificateIssued)

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === eligibleStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(eligibleStudents.map(e => e.studentId))
    }
  }

  const handleIssueCertificates = async () => {
    setIsIssuing(true)

    // Simulate certificate generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newCertificates = selectedStudents.map(studentId => ({
      studentId,
      certificateId: `CERT-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    }))

    setIssuedCertificates(newCertificates)
    setIsIssuing(false)
    setShowIssueDialog(false)
    setSelectedStudents([])
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 80) return 'text-blue-600'
    if (rate >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/trainer/courses/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للدورة
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إصدار الشهادات
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مكتملين الدورة</p>
                <p className="text-2xl font-bold">{mockCompletedEnrollments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">شهادات مصدرة</p>
                <p className="text-2xl font-bold">{issuedCertificatesList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">في انتظار الإصدار</p>
                <p className="text-2xl font-bold">{eligibleStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">متوسط الدرجة</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockCompletedEnrollments.reduce((sum, e) => sum + e.finalGrade, 0) / mockCompletedEnrollments.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Certificates Section */}
      {eligibleStudents.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إصدار شهادات جديدة</CardTitle>
            <CardDescription>
              اختر الطلاب المستوفين للشروط لإصدار شهاداتهم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Checkbox
                checked={selectedStudents.length === eligibleStudents.length && eligibleStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="font-medium">تحديد الكل ({eligibleStudents.length} طالب)</span>
            </div>

            <div className="space-y-3 mb-6">
              {eligibleStudents.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedStudents.includes(enrollment.studentId)}
                      onCheckedChange={() => handleSelectStudent(enrollment.studentId)}
                    />
                    <div>
                      <h3 className="font-medium">{enrollment.student.name}</h3>
                      <p className="text-sm text-gray-600">{enrollment.student.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className={getAttendanceColor(enrollment.attendanceRate)}>
                          حضور: {enrollment.attendanceRate}%
                        </span>
                        <span className={getGradeColor(enrollment.finalGrade)}>
                          الدرجة: {enrollment.finalGrade}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    مؤهل للشهادة
                  </Badge>
                </div>
              ))}
            </div>

            <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
              <DialogTrigger asChild>
                <Button
                  disabled={selectedStudents.length === 0}
                  onClick={() => setShowIssueDialog(true)}
                >
                  <Award className="mr-2 h-4 w-4" />
                  إصدار الشهادات ({selectedStudents.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تأكيد إصدار الشهادات</DialogTitle>
                  <DialogDescription>
                    هل أنت متأكد من رغبتك في إصدار شهادات للطلاب المحددين؟
                    سيتم إرسال إشعار لكل طالب مع رابط تحميل الشهادة.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">تفاصيل الإصدار:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• عدد الشهادات: {selectedStudents.length}</li>
                      <li>• اسم الدورة: {mockCourse.title}</li>
                      <li>• تاريخ الإصدار: {formatDate(new Date())}</li>
                      <li>• المدرب: {mockCourse.trainer.name}</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowIssueDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleIssueCertificates} disabled={isIssuing}>
                      {isIssuing ? 'جاري الإصدار...' : 'تأكيد الإصدار'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Recently Issued Certificates */}
      {issuedCertificates.length > 0 && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              تم إصدار الشهادات بنجاح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issuedCertificates.map((cert) => {
                const student = mockCompletedEnrollments.find(e => e.studentId === cert.studentId)
                return (
                  <div key={cert.studentId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="font-medium">{student?.student.name}</span>
                      <span className="text-sm text-gray-600 mr-2">- رقم الشهادة: {cert.certificateId}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      تحميل
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع الشهادات المصدرة</CardTitle>
          <CardDescription>
            سجل بجميع الشهادات التي تم إصدارها لهذه الدورة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockCompletedEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                لا توجد شهادات
              </h3>
              <p className="text-gray-500">
                لم يتم إصدار أي شهادات لهذه الدورة بعد
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>معدل الحضور</TableHead>
                  <TableHead>الدرجة النهائية</TableHead>
                  <TableHead>حالة الشهادة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCompletedEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enrollment.student.name}</div>
                        <div className="text-sm text-gray-500">{enrollment.student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(enrollment.enrolledAt)}
                    </TableCell>
                    <TableCell>
                      <span className={getAttendanceColor(enrollment.attendanceRate)}>
                        {enrollment.attendanceRate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={getGradeColor(enrollment.finalGrade)}>
                        {enrollment.finalGrade}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {enrollment.certificateIssued ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">مصدرة</span>
                          <Badge variant="outline" className="text-xs">
                            {enrollment.certificateId}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary">في انتظار الإصدار</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {enrollment.certificateIssued ? (
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          تحميل
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSelectStudent(enrollment.studentId)}
                        >
                          <Award className="mr-2 h-4 w-4" />
                          إصدار
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}