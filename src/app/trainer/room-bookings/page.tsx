"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Clock, X, CheckCircle, AlertCircle, Filter } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { RoomBooking, User } from "@/types"

// Mock room bookings data
const mockRoomBookings: RoomBooking[] = [
  {
    id: "1",
    roomId: "1",
    sessionId: "3",
    startTime: new Date("2025-02-05T10:00:00"),
    endTime: new Date("2025-02-05T12:00:00"),
    status: "pending",
    requestedById: "2",
    notes: "درس مهم تتطلب معدات عرض متقدمة",
    createdAt: new Date("2025-02-01"),
  },
  {
    id: "2",
    roomId: "2",
    sessionId: "5",
    startTime: new Date("2025-02-10T14:00:00"),
    endTime: new Date("2025-02-10T16:00:00"),
    status: "approved",
    requestedById: "2",
    approvedById: "3",
    notes: "تم تخصيص القاعة المطلوبة",
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "3",
    roomId: "3",
    sessionId: "8",
    startTime: new Date("2025-02-15T09:00:00"),
    endTime: new Date("2025-02-15T11:00:00"),
    status: "rejected",
    requestedById: "2",
    approvedById: "3",
    notes: "القاعة محجوزة لفعالية أخرى",
    createdAt: new Date("2025-02-03"),
  },
  {
    id: "4",
    roomId: "1",
    sessionId: "6",
    startTime: new Date("2025-02-20T10:00:00"),
    endTime: new Date("2025-02-20T12:00:00"),
    status: "pending",
    requestedById: "2",
    notes: "مطلوب معدات صوتية إضافية",
    createdAt: new Date("2025-02-04"),
  },
]

// Mock sessions to course mapping
const mockSessionCourses = {
  "3": { title: "تعلم React من الصفر" },
  "5": { title: "تصميم واجهات المستخدم" },
  "8": { title: "إدارة المشاريع الرقمية" },
  "6": { title: "تعلم React من الصفر" },
}

const mockRooms = {
  "1": { name: "قاعة المحاضرات الأولى", capacity: 50 },
  "2": { name: "قاعة المحاضرات الثانية", capacity: 30 },
  "3": { name: "قاعة الحاسوب الأولى", capacity: 25 },
}

export default function TrainerRoomBookingsPage() {
  const [bookings, setBookings] = useState(mockRoomBookings)
  const [filter, setFilter] = useState<string>("all")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null)

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true
    return booking.status === filter
  })

  const getStatusLabel = (status: RoomBooking['status']) => {
    switch (status) {
      case 'pending': return 'قيد المعالجة'
      case 'approved': return 'مقبول'
      case 'rejected': return 'مرفوض'
      case 'cancelled': return 'ملغى'
      default: return status
    }
  }

  const getStatusColor = (status: RoomBooking['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600'
      case 'approved': return 'text-green-600'
      case 'rejected': return 'text-red-600'
      case 'cancelled': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: RoomBooking['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return null
    }
  }

  const handleCancelBooking = (booking: RoomBooking) => {
    setSelectedBooking(booking)
    setShowCancelDialog(true)
  }

  const confirmCancellation = () => {
    if (!selectedBooking) return

    setBookings(bookings.map(booking =>
      booking.id === selectedBooking.id
        ? { ...booking, status: 'cancelled' as const }
        : booking
    ))

    setShowCancelDialog(false)
    setSelectedBooking(null)
  }

  const getCourseTitle = (sessionId: string | undefined) => {
    if (!sessionId) return 'دورة غير معروفة'
    return mockSessionCourses[sessionId as keyof typeof mockSessionCourses]?.title || 'دورة غير معروفة'
  }

  const getRoomName = (roomId: string) => {
    return mockRooms[roomId as keyof typeof mockRooms]?.name || 'قاعة غير معروفة'
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const approvedBookings = bookings.filter(b => b.status === 'approved')
  const rejectedBookings = bookings.filter(b => b.status === 'rejected')

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          طلبات حجز القاعات
        </h1>
        <p className="text-gray-600">
          إدارة طلبات حجز القاعات لدروس الدورات التدريبية
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
                <p className="text-2xl font-bold">{pendingBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مقبولة</p>
                <p className="text-2xl font-bold">{approvedBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <X className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مرفوضة</p>
                <p className="text-2xl font-bold">{rejectedBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium">تصفية الطلبات:</span>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">قيد المعالجة</SelectItem>
                <SelectItem value="approved">مقبولة</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
                <SelectItem value="cancelled">ملغاة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة طلبات الحجز</CardTitle>
          <CardDescription>
            جميع طلبات حجز القاعات المرتبطة بدوراتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                لا توجد طلبات حجز
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "لم تقم بطلب حجز أي قاعة بعد"
                  : `لا توجد طلبات ${getStatusLabel(filter as RoomBooking['status'])}`
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الدورة</TableHead>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>القاعة المطلوبة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>ملاحظات المعهد</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getCourseTitle(booking.sessionId)}</div>
                        <div className="text-sm text-gray-500">
                          درس #{booking.sessionId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(booking.startTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{getRoomName(booking.roomId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {booking.notes ? (
                          <p className="text-sm text-gray-600 truncate" title={booking.notes}>
                            {booking.notes}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.status === 'pending' && (
                        <Dialog open={showCancelDialog && selectedBooking?.id === booking.id} onOpenChange={setShowCancelDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              إلغاء الطلب
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>تأكيد إلغاء الطلب</DialogTitle>
                              <DialogDescription>
                                هل أنت متأكد من رغبتك في إلغاء طلب حجز القاعة لدرس &ldquo;{getCourseTitle(booking.sessionId)}&rdquo;؟
                                هذا الإجراء لا يمكن التراجع عنه.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                                إلغاء
                              </Button>
                              <Button variant="destructive" onClick={confirmCancellation}>
                                تأكيد الإلغاء
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>معلومات مهمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">كيفية طلب حجز قاعة</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• أضف درس حضوري في جدول الدورة</li>
                <li>• اختر القاعة المناسبة من القائمة</li>
                <li>• احفظ الدرس وسيتم إرسال طلب الحجز تلقائياً</li>
                <li>• انتظر موافقة المعهد على الطلب</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">سياسة الحجز</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• يجب طلب الحجز قبل أسبوع على الأقل</li>
                <li>• يمكن إلغاء الطلب قبل 24 ساعة من الموعد</li>
                <li>• في حالة الرفض سيتم إشعارك بالأسباب</li>
                <li>• يمكن طلب قاعة بديلة في حالة الرفض</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}