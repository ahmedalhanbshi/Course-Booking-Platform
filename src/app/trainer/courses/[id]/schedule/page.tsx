"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video, Plus, Edit, Trash2, ArrowLeft, Users } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { Session } from "@/types"
import { useState } from "react"

// Mock user data
const mockUser = {
  id: "2",
  name: "فاطمة علي",
  email: "fatima@example.com",
  role: 'trainer' as const,
}

// Mock course data
const mockCourse = {
  id: "1",
  title: "تعلم React من الصفر",
  trainer: {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    role: 'trainer' as const,
  },
}

// Mock sessions data
const mockSessions: Session[] = [
  {
    id: "1",
    courseId: "1",
    title: "مقدمة في React",
    description: "تعريف بـ React ومميزاته",
    startTime: new Date("2025-02-01T10:00:00"),
    endTime: new Date("2025-02-01T12:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
  {
    id: "2",
    courseId: "1",
    title: "المكونات في React",
    description: "إنشاء واستخدام المكونات",
    startTime: new Date("2025-02-03T10:00:00"),
    endTime: new Date("2025-02-03T12:00:00"),
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
  {
    id: "3",
    courseId: "1",
    title: "إدارة الحالة",
    description: "استخدام useState و useEffect",
    startTime: new Date("2025-02-05T10:00:00"),
    endTime: new Date("2025-02-05T12:00:00"),
    type: "in_person",
    roomId: "1",
    status: "scheduled",
  },
]

// Mock rooms data
const mockRooms = [
  { id: "1", name: "قاعة المحاضرات الأولى", capacity: 50, facilities: ["شاشة عرض", "ميكروفون"] },
  { id: "2", name: "قاعة المحاضرات الثانية", capacity: 30, facilities: ["شاشة عرض"] },
  { id: "3", name: "قاعة الحاسوب الأولى", capacity: 25, facilities: ["حواسيب", "شاشة عرض"] },
]

export default function TrainerCourseSchedulePage() {
  const params = useParams()
  const courseId = params.id as string

  const [sessions, setSessions] = useState(mockSessions)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endTime: "",
    type: "" as Session['type'],
    roomId: "",
    meetingLink: "",
  })

  const handleAddSession = () => {
    if (!newSession.title || !newSession.startDate || !newSession.startTime || !newSession.endTime || !newSession.type) return

    const startTime = new Date(`${newSession.startDate}T${newSession.startTime}`)
    const endTime = new Date(`${newSession.startDate}T${newSession.endTime}`)

    const session: Session = {
      id: `session_${sessions.length + 1}`,
      courseId,
      title: newSession.title,
      description: newSession.description,
      startTime,
      endTime,
      type: newSession.type,
      roomId: newSession.type === 'in_person' ? newSession.roomId : undefined,
      meetingLink: newSession.type === 'online' ? newSession.meetingLink : undefined,
      status: "scheduled",
    }

    setSessions([...sessions, session])
    resetForm()
    setShowAddDialog(false)
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setNewSession({
      title: session.title,
      description: session.description || "",
      startDate: session.startTime.toISOString().split('T')[0],
      startTime: session.startTime.toTimeString().slice(0, 5),
      endTime: session.endTime.toTimeString().slice(0, 5),
      type: session.type,
      roomId: session.roomId || "",
      meetingLink: session.meetingLink || "",
    })
  }

  const handleUpdateSession = () => {
    if (!editingSession) return

    const startTime = new Date(`${newSession.startDate}T${newSession.startTime}`)
    const endTime = new Date(`${newSession.startDate}T${newSession.endTime}`)

    setSessions(sessions.map(s =>
      s.id === editingSession.id
        ? {
          ...s,
          title: newSession.title,
          description: newSession.description,
          startTime,
          endTime,
          type: newSession.type,
          roomId: newSession.type === 'in_person' ? newSession.roomId : undefined,
          meetingLink: newSession.type === 'online' ? newSession.meetingLink : undefined,
        }
        : s
    ))

    resetForm()
    setEditingSession(null)
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const handleRequestRoomBooking = (session: Session) => {
    // In real app, this would create a room booking request
    console.log('Requesting room booking for session:', session.id)
    alert('تم إرسال طلب حجز القاعة')
  }

  const resetForm = () => {
    setNewSession({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endTime: "",
      type: "" as Session['type'],
      roomId: "",
      meetingLink: "",
    })
  }

  const isFormValid = () => {
    return newSession.title &&
      newSession.startDate &&
      newSession.startTime &&
      newSession.endTime &&
      newSession.type &&
      (newSession.type === 'online' ? newSession.meetingLink : newSession.roomId)
  }

  const getRoomName = (roomId: string) => {
    const room = mockRooms.find(r => r.id === roomId)
    return room ? room.name : 'غير محدد'
  }

  const getStatusLabel = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'مجدولة'
      case 'ongoing': return 'جارية'
      case 'completed': return 'مكتملة'
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

  // Group sessions by week
  const sessionsByWeek = sessions.reduce((acc, session) => {
    const weekStart = new Date(session.startTime)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]

    if (!acc[weekKey]) {
      acc[weekKey] = []
    }
    acc[weekKey].push(session)
    return acc
  }, {} as Record<string, Session[]>)

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
          جدول الدورة والدروس
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الدروس</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">دروس مجدولة</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'scheduled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">دروس أونلاين</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.type === 'online').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">دروس حضورية</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.type === 'in_person').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Session Button */}
      <div className="mb-6">
        <Dialog open={showAddDialog || !!editingSession} onOpenChange={(open) => {
          if (!open) resetForm()
          setShowAddDialog(open)
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSession(null)}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة درس جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? 'تعديل الدرس' : 'إضافة درس جديد'}
              </DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الدرس التدريبي
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الدرس</Label>
                <Input
                  id="title"
                  placeholder="مثال: مقدمة في React"
                  value={newSession.title}
                  onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  placeholder="وصف الدرس (اختياري)"
                  value={newSession.description}
                  onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ الدرس</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newSession.startDate}
                    onChange={(e) => setNewSession(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">وقت البداية</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">وقت النهاية</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>نوع الدرس</Label>
                <Select
                  value={newSession.type}
                  onValueChange={(value: Session['type']) => setNewSession(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الدرس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">أونلاين</SelectItem>
                    <SelectItem value="in_person">حضوري</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newSession.type === 'online' && (
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">رابط الاجتماع</Label>
                  <Input
                    id="meetingLink"
                    placeholder="https://meet.google.com/..."
                    value={newSession.meetingLink}
                    onChange={(e) => setNewSession(prev => ({ ...prev, meetingLink: e.target.value }))}
                  />
                </div>
              )}

              {newSession.type === 'in_person' && (
                <div className="space-y-2">
                  <Label>القاعة</Label>
                  <Select
                    value={newSession.roomId}
                    onValueChange={(value) => setNewSession(prev => ({ ...prev, roomId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القاعة" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} (سعة: {room.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
                <Button
                  onClick={editingSession ? handleUpdateSession : handleAddSession}
                  disabled={!isFormValid()}
                >
                  {editingSession ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      <div className="space-y-6">
        {Object.keys(sessionsByWeek).length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  لا توجد دروس
                </h3>
                <p className="text-gray-500 mb-4">
                  ابدأ بإضافة الدروس التدريبية للدورة
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة أول درس
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.entries(sessionsByWeek).map(([weekKey, weekSessions]) => (
            <Card key={weekKey}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  أسبوع {formatDate(weekKey)}
                </CardTitle>
                <CardDescription>
                  {weekSessions.length} دروس في هذا الأسبوع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weekSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{session.title}</h3>
                            <Badge className={getStatusColor(session.status)}>
                              {getStatusLabel(session.status)}
                            </Badge>
                            <Badge variant="outline">
                              {session.type === 'online' ? 'أونلاين' : 'حضوري'}
                            </Badge>
                          </div>
                          {session.description && (
                            <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                          )}
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
                              <span>
                                {session.type === 'online'
                                  ? 'أونلاين'
                                  : getRoomName(session.roomId || '')
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          {session.type === 'in_person' && !session.roomId && (
                            <Button
                              size="sm"
                              onClick={() => handleRequestRoomBooking(session)}
                            >
                              طلب حجز قاعة
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}