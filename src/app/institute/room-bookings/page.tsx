"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, MapPin, Calendar, User } from "lucide-react"
import { RoomBooking } from "@/types"
import { formatDate, formatTime } from "@/lib/utils"

// Mock data
const mockBookings: RoomBooking[] = [
  {
    id: "1",
    roomId: "1",
    sessionId: "session1",
    startTime: new Date("2024-01-15T10:00:00"),
    endTime: new Date("2024-01-15T12:00:00"),
    status: "pending",
    requestedById: "trainer1",
    notes: "حاجة لشاشة عرض كبيرة",
    createdAt: new Date()
  },
  {
    id: "2",
    roomId: "2",
    sessionId: "session2",
    startTime: new Date("2024-01-15T14:00:00"),
    endTime: new Date("2024-01-15T16:00:00"),
    status: "approved",
    requestedById: "trainer2",
    approvedById: "admin1",
    notes: "تم تخصيص القاعة 203",
    createdAt: new Date()
  },
  {
    id: "3",
    roomId: "1",
    sessionId: "session3",
    startTime: new Date("2024-01-16T09:00:00"),
    endTime: new Date("2024-01-16T11:00:00"),
    status: "rejected",
    requestedById: "trainer3",
    approvedById: "admin1",
    notes: "القاعة محجوزة مسبقاً",
    createdAt: new Date()
  }
]

const mockRooms = [
  { id: "1", name: "قاعة 101" },
  { id: "2", name: "قاعة 203" },
  { id: "3", name: "قاعة 305" }
]

export default function InstituteRoomBookings() {
  const [bookings, setBookings] = useState<RoomBooking[]>(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null }>({
    open: false,
    type: null
  })
  const [notes, setNotes] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")

  const handleApproveBooking = (booking: RoomBooking) => {
    setSelectedBooking(booking)
    setActionDialog({ open: true, type: 'approve' })
    setSelectedRoom(booking.roomId)
  }

  const handleRejectBooking = (booking: RoomBooking) => {
    setSelectedBooking(booking)
    setActionDialog({ open: true, type: 'reject' })
  }

  const executeAction = () => {
    if (!selectedBooking) return

    const updatedBooking: RoomBooking = {
      ...selectedBooking,
      status: actionDialog.type === 'approve' ? 'approved' : 'rejected',
      approvedById: "admin1",
      notes: actionDialog.type === 'approve' ? `تم تخصيص ${mockRooms.find(r => r.id === selectedRoom)?.name}` : notes
    }

    if (actionDialog.type === 'approve') {
      updatedBooking.roomId = selectedRoom
    }

    setBookings(bookings.map(b => b.id === selectedBooking.id ? updatedBooking : b))
    setActionDialog({ open: false, type: null })
    setSelectedBooking(null)
    setNotes("")
    setSelectedRoom("")
  }

  const getStatusBadge = (status: RoomBooking['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">مقبول</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">طلبات حجز القاعات</h1>
        <p className="text-gray-600 mt-2">مراجعة وإدارة طلبات حجز قاعات المعهد</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدورة</TableHead>
                <TableHead>المدرب</TableHead>
                <TableHead>التاريخ والوقت</TableHead>
                <TableHead>القاعة المطلوبة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    دورة البرمجة الأساسية
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      فاطمة علي
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(booking.startTime)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockRooms.find(r => r.id === booking.roomId)?.name}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveBooking(booking)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          قبول
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectBooking(booking)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          رفض
                        </Button>
                      </div>
                    )}
                    {booking.status !== 'pending' && (
                      <span className="text-sm text-gray-500">
                        {booking.status === 'approved' ? 'تم القبول' : 'تم الرفض'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' ? 'قبول طلب الحجز' : 'رفض طلب الحجز'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedBooking && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">تفاصيل الطلب:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>الدورة:</strong> دورة البرمجة الأساسية</p>
                  <p><strong>المدرب:</strong> فاطمة علي</p>
                  <p><strong>التاريخ:</strong> {formatDate(selectedBooking.startTime)}</p>
                  <p><strong>الوقت:</strong> {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</p>
                </div>
              </div>
            )}

            {actionDialog.type === 'approve' && (
              <div>
                <Label htmlFor="room-select">اختر القاعة</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قاعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {actionDialog.type === 'reject' && (
              <div>
                <Label htmlFor="notes">سبب الرفض</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب سبب رفض الطلب..."
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={executeAction}
                className={actionDialog.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                disabled={actionDialog.type === 'approve' && !selectedRoom}
              >
                {actionDialog.type === 'approve' ? 'قبول الطلب' : 'رفض الطلب'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}