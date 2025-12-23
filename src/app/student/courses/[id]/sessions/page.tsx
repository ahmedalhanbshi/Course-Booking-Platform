"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, Video, Users, FileText } from "lucide-react"
import { Session, Attendance, User, Course } from "@/types"
import { formatDate, formatTime } from "@/lib/utils"

// Mock user data
const mockUser: User = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: 'student' as const,
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
  trainerId: "1",
  trainer: {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: 'trainer' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock sessions data
const mockSessions: (Session & { attendance?: Attendance })[] = [
  {
    id: "1",
    courseId: "1",
    title: "مقدمة في React",
    description: "تعريف بـ React ومميزاته",
    startTime: new Date("2025-01-15T10:00:00"),
    endTime: new Date("2025-01-15T12:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "completed",
    attendance: {
      id: "1",
      sessionId: "1",
      studentId: "1",
      status: "present",
      markedAt: new Date("2025-01-15T10:05:00"),
    }
  },
  {
    id: "2",
    courseId: "1",
    title: "المكونات في React",
    description: "إنشاء واستخدام المكونات",
    startTime: new Date("2025-01-17T10:00:00"),
    endTime: new Date("2025-01-17T12:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "completed",
    attendance: {
      id: "2",
      sessionId: "2",
      studentId: "1",
      status: "present",
      markedAt: new Date("2025-01-17T10:02:00"),
    }
  },
  {
    id: "3",
    courseId: "1",
    title: "إدارة الحالة",
    description: "استخدام useState و useEffect",
    startTime: new Date("2025-01-20T10:00:00"),
    endTime: new Date("2025-01-20T12:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
  {
    id: "4",
    courseId: "1",
    title: "التوجيه في React",
    description: "استخدام React Router",
    startTime: new Date("2025-01-22T10:00:00"),
    endTime: new Date("2025-01-22T12:00:00"),
    type: "in_person",
    roomId: "1",
    status: "scheduled",
  },
  {
    id: "5",
    courseId: "1",
    title: "Hooks المتقدمة",
    description: "useContext و useReducer",
    startTime: new Date("2025-01-24T10:00:00"),
    endTime: new Date("2025-01-24T12:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
]

export default function CourseSessionsPage() {
  const params = useParams()
  const courseId = params.id as string

  const getStatusLabel = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'قادمة'
      case 'ongoing': return 'مباشرة'
      case 'completed': return 'منتهية'
      case 'cancelled': return 'ملغاة'
      default: return status
    }
  }

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600'
      case 'ongoing': return 'text-green-600'
      case 'completed': return 'text-gray-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getAttendanceStatusLabel = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return 'حاضر'
      case 'absent': return 'غائب'
      case 'excused': return 'معذور'
      default: return status
    }
  }

  const getAttendanceStatusColor = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return 'text-green-600'
      case 'absent': return 'text-red-600'
      case 'excused': return 'text-orange-.600'
      default: return 'text-gray-600'
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

  const canJoinSession = (session: Session) => {
    const now = new Date()
    const sessionStart = new Date(session.startTime)
    const sessionEnd = new Date(session.endTime)

    return session.status === 'ongoing' ||
      (session.status === 'scheduled' &&
        now >= sessionStart &&
        now <= sessionEnd)
  }

  const upcomingSessions = mockSessions.filter(s => s.status === 'scheduled' || s.status === 'ongoing')
  const pastSessions = mockSessions.filter(s => s.status === 'completed' || s.status === 'cancelled')

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/student/courses/${courseId}`}>
              ← العودة للدورة
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/student/courses/${courseId}/materials`}>
              <FileText className="me-2 h-4 w-4" />
              المواد
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          الدروس والحضور
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>



      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>الدروس القادمة</CardTitle>
            <CardDescription>الدروس التي لم تبدأ بعد</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{session.title}</h3>
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusLabel(session.status)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{session.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(session.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.type === 'online' ? (
                            <Video className="h-4 w-4 text-gray-500" />
                          ) : (
                            <MapPin className="h-4 w-4 text-gray-500" />
                          )}
                          <span>{session.type === 'online' ? 'أونلاين' : 'حضوري'}</span>
                        </div>
                      </div>
                    </div>

                    {canJoinSession(session) && session.type === 'online' && (
                      <Button asChild>
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Play className="me-2 h-4 w-4" />
                          انضم للدرس
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع الدروس</CardTitle>
          <CardDescription>سجل حضورك في جميع دروس الدورة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدرس</TableHead>
                <TableHead>التاريخ والوقت</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-gray-500">{session.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(session.startTime)}</div>
                      <div className="text-gray-500">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {session.type === 'online' ? 'أونلاين' : 'حضوري'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusLabel(session.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}