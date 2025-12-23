"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Users, Calendar, Clock, Save, ArrowLeft, UserCheck } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { Session, Attendance, Enrollment, User, Course } from "@/types"
import { useState } from "react"

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

// Mock sessions
const mockSessions: Session[] = [
  {
    id: "1",
    courseId: "1",
    title: "مقدمة في React",
    description: "تعريف بـ React ومميزاته",
    startTime: new Date("2025-01-15T10:00:00"),
    endTime: new Date("2025-01-15T12:00:00"),
    type: "online",
    status: "completed",
  },
  {
    id: "2",
    courseId: "1",
    title: "المكونات في React",
    description: "إنشاء واستخدام المكونات",
    startTime: new Date("2025-01-17T10:00:00"),
    endTime: new Date("2025-01-17T12:00:00"),
    type: "online",
    status: "completed",
  },
  {
    id: "3",
    courseId: "1",
    title: "إدارة الحالة",
    description: "استخدام useState و useEffect",
    startTime: new Date("2025-01-20T10:00:00"),
    endTime: new Date("2025-01-20T12:00:00"),
    type: "in_person",
    status: "scheduled",
  },
]

// Mock enrolled students
const mockEnrollments: (Enrollment & { student: { id: string; name: string; email: string } })[] = [
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
    }
  },
  {
    id: "3",
    studentId: "5",
    courseId: "1",
    enrolledAt: new Date("2025-01-17"),
    status: 'active',
    progress: 45,
    student: {
      id: "5",
      name: "محمد علي",
      email: "mohamed.ali@example.com",
    }
  },
  {
    id: "4",
    studentId: "6",
    courseId: "1",
    enrolledAt: new Date("2025-01-18"),
    status: 'active',
    progress: 80,
    student: {
      id: "6",
      name: "سارة حسن",
      email: "sara.hassan@example.com",
    }
  },
]

export default function TrainerAttendancePage() {
  const params = useParams()
  const courseId = params.id as string

  const [selectedSessionId, setSelectedSessionId] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Attendance['status']>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const selectedSession = mockSessions.find(s => s.id === selectedSessionId)
  const activeEnrollments = mockEnrollments.filter(e => e.status === 'active')

  const handleAttendanceChange = (studentId: string, status: Attendance['status']) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleMarkAllPresent = () => {
    const newRecords: Record<string, Attendance['status']> = {}
    activeEnrollments.forEach(enrollment => {
      newRecords[enrollment.studentId] = 'present'
    })
    setAttendanceRecords(newRecords)
  }

  const handleSaveAttendance = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSaving(false)
    setSaveSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const getAttendanceStatusLabel = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return 'حاضر'
      case 'absent': return 'غائب'
      case 'excused': return 'معذور'
      default: return 'لم يتم تسجيل'
    }
  }

  const getAttendanceStatusColor = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return 'text-green-600'
      case 'absent': return 'text-red-600'
      case 'excused': return 'text-orange-600'
      default: return 'text-gray-400'
    }
  }

  const getAttendanceIcon = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />
      case 'absent': return <XCircle className="h-4 w-4" />
      case 'excused': return <AlertCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getAttendanceStats = () => {
    const records = Object.values(attendanceRecords)
    return {
      present: records.filter(r => r === 'present').length,
      absent: records.filter(r => r === 'absent').length,
      excused: records.filter(r => r === 'excused').length,
      total: activeEnrollments.length,
    }
  }

  const stats = getAttendanceStats()

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
          تسجيل الحضور
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>

      {/* Session Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>اختيار الدرس</CardTitle>
          <CardDescription>
            اختر الدرس الذي تريد تسجيل حضورها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="اختر درس" />
            </SelectTrigger>
            <SelectContent>
              {mockSessions.map(session => (
                <SelectItem key={session.id} value={session.id}>
                  <div className="flex items-center gap-2">
                    <span>{session.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(session.startTime)}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSession && (
        <>
          {/* Session Info */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedSession.title}</h3>
                  <p className="text-gray-600">{selectedSession.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedSession.startTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                    </div>
                    <Badge variant="outline">
                      {selectedSession.type === 'online' ? 'أونلاين' : 'حضوري'}
                    </Badge>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-600">عدد الطلاب النشطين</div>
                  <div className="text-2xl font-bold text-primary">{activeEnrollments.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">حاضر</p>
                    <p className="text-2xl font-bold">{stats.present}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">غائب</p>
                    <p className="text-2xl font-bold">{stats.absent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">معذور</p>
                    <p className="text-2xl font-bold">{stats.excused}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-4 mb-6">
            <Button onClick={handleMarkAllPresent} variant="outline">
              <UserCheck className="mr-2 h-4 w-4" />
              تحديد الكل حاضر
            </Button>

            <Button
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="flex-1 md:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'جاري الحفظ...' : 'حفظ الحضور'}
            </Button>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>تم حفظ تسجيل الحضور بنجاح</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>تسجيل حضور الطلاب</CardTitle>
              <CardDescription>
                حدد حالة حضور كل طالب في الدرس
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الطالب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enrollment.student.name}</div>
                          <div className="text-sm text-gray-500">{enrollment.student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {attendanceRecords[enrollment.studentId] ? (
                            <>
                              <span className={getAttendanceStatusColor(attendanceRecords[enrollment.studentId])}>
                                {getAttendanceStatusLabel(attendanceRecords[enrollment.studentId])}
                              </span>
                              {getAttendanceIcon(attendanceRecords[enrollment.studentId])}
                            </>
                          ) : (
                            <span className="text-gray-400">لم يتم تسجيل</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={attendanceRecords[enrollment.studentId] === 'present' ? 'default' : 'outline'}
                            onClick={() => handleAttendanceChange(enrollment.studentId, 'present')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceRecords[enrollment.studentId] === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleAttendanceChange(enrollment.studentId, 'absent')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceRecords[enrollment.studentId] === 'excused' ? 'secondary' : 'outline'}
                            onClick={() => handleAttendanceChange(enrollment.studentId, 'excused')}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedSessionId && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                اختر درس لتسجيل الحضور
              </h3>
              <p className="text-gray-500">
                حدد الدرس من القائمة أعلاه لبدء تسجيل حضور الطلاب
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}