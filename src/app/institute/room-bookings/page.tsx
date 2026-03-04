"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, MapPin, Calendar, User, Loader2, Eye } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { instituteService } from "@/lib/institute-service"
import { toast } from "sonner"

export default function InstituteRoomBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: "APPROVED" | "REJECTED" | null }>({
    open: false,
    type: null
  })
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; booking: any | null }>({
    open: false,
    booking: null
  })
  const [notes, setNotes] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsData, roomsData] = await Promise.all([
        instituteService.getRoomBookings(),
        instituteService.getHalls()
      ])
      setBookings(bookingsData)
      setRooms(roomsData)
    } catch (error) {
      toast.error("فشل في تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApproveBooking = (booking: any) => {
    setSelectedBooking(booking)
    setActionDialog({ open: true, type: "APPROVED" })
    setSelectedRoom(booking.roomId)
  }

  const handleRejectBooking = (booking: any) => {
    setSelectedBooking(booking)
    setActionDialog({ open: true, type: "REJECTED" })
  }

  const executeAction = async () => {
    if (!selectedBooking || !actionDialog.type) return

    if (actionDialog.type === "APPROVED" && !selectedRoom) {
      toast.error("الرجاء تحديد قاعة")
      return
    }

    try {
      setActionLoading(true)
      await instituteService.updateRoomBookingStatus(selectedBooking.id, {
        status: actionDialog.type,
        notes: notes,
        roomId: actionDialog.type === "APPROVED" ? selectedRoom : undefined
      })

      toast.success(actionDialog.type === "APPROVED" ? "تم قبول الحجز بنجاح" : "تم رفض الحجز")

      setActionDialog({ open: false, type: null })
      setSelectedBooking(null)
      setNotes("")
      setSelectedRoom("")

      // Refresh data
      fetchData()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء تنفيذ الإجراء")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">مقبول</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      case "PENDING_PAYMENT":
        return <Badge className="bg-blue-100 text-blue-800">في انتظار الدفع</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800">ملغى</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
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
                <TableHead>الطلب بواسطة</TableHead>
                <TableHead>التاريخ والوقت</TableHead>
                <TableHead>القاعة المقترحة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    لا توجد طلبات حجز حالياً
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.course?.title || "غير محدد"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {booking.requestedBy?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {booking.bookingMode === 'UNIFIED_TIME' ? (
                            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                          ) : (
                            <span>{formatDate(booking.startDate)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {formatTime(booking.defaultStartTime)} - {formatTime(booking.defaultEndTime)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.room?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(booking.status)}
                        {booking.payments && booking.payments.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPaymentDialog({ open: true, booking })}
                            className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1 ml-1" />
                            عرض الدفع
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.status === "PENDING_APPROVAL" || booking.status === "PENDING_PAYMENT" ? (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveBooking(booking)}
                            className="bg-green-600 hover:bg-green-700 w-full"
                          >
                            <CheckCircle className="h-4 w-4 mr-1 ml-1" />
                            قبول
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectBooking(booking)}
                            className="border-red-300 text-red-600 hover:bg-red-50 w-full"
                          >
                            <XCircle className="h-4 w-4 mr-1 ml-1" />
                            رفض
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {booking.status === "APPROVED" && booking.approvedBy && (
                            <span>بواسطة: {booking.approvedBy.name}</span>
                          )}
                          {(booking.notes || booking.rejectionReason) && (
                            <p className="mt-1 text-xs">{booking.notes || booking.rejectionReason}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && !actionLoading && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "APPROVED" ? "قبول طلب الحجز" : "رفض طلب الحجز"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedBooking && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">تفاصيل الطلب:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>الدورة:</strong> {selectedBooking.course?.title || "غير محدد"}</p>
                  <p><strong>مقدم الطلب:</strong> {selectedBooking.requestedBy?.name}</p>
                  <p><strong>التاريخ:</strong> {formatDate(selectedBooking.startDate)} {selectedBooking.bookingMode === 'UNIFIED_TIME' ? `- ${formatDate(selectedBooking.endDate)}` : ''}</p>
                  <p><strong>الوقت:</strong> {formatTime(selectedBooking.defaultStartTime)} - {formatTime(selectedBooking.defaultEndTime)}</p>
                </div>
              </div>
            )}

            {actionDialog.type === "APPROVED" && (
              <div>
                <Label htmlFor="room-select">تأكيد / اختيار القاعة</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="اختر قاعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="notes">{actionDialog.type === "APPROVED" ? "ملاحظات إضافية (اختياري)" : "سبب الرفض"}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={actionDialog.type === "APPROVED" ? "اكتب ملاحظاتك..." : "اكتب سبب رفض الطلب..."}
                className="resize-none mt-1"
                rows={3}
                disabled={actionLoading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, type: null })}
              disabled={actionLoading}
            >
              إلغاء
            </Button>
            <Button
              onClick={executeAction}
              className={actionDialog.type === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionDialog.type === "APPROVED" ? "تأكيد القبول" : "تأكيد الرفض"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialog.open} onOpenChange={(open) => !open && setPaymentDialog({ open: false, booking: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              تفاصيل الدفع
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {paymentDialog.booking && paymentDialog.booking.payments && paymentDialog.booking.payments.length > 0 ? (
              [...paymentDialog.booking.payments]
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((payment: any, index: number) => (
                  <div key={payment.id} className={`p-4 rounded-lg space-y-2 text-sm border ${index === 0 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">المبلغ:</span>
                        {index === 0 ? (
                          <Badge variant="default" className="bg-blue-600 text-[10px] px-1.5 h-5">الأحدث</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5">سابق</Badge>
                        )}
                      </div>
                      <span className="font-bold text-lg">{payment.amount} {payment.currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">الحالة:</span>
                      <Badge variant={payment.status === 'APPROVED' ? 'default' : payment.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                        {payment.status === 'APPROVED' ? 'مقبول' : payment.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                      </Badge>
                    </div>
                    {payment.notes && (
                      <div className="mt-2 pt-2 border-t text-gray-600">
                        <span className="font-medium text-gray-700 block mb-1">الملاحظات:</span>
                        {payment.notes}
                      </div>
                    )}
                    {payment.depositSlipImage && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="font-medium text-gray-700 block mb-2">صورة الإيصال:</span>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${payment.depositSlipImage}`}
                          alt="Deposit Slip"
                          className="max-w-full h-auto rounded-md border"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    {payment.rejectionReason && (
                      <div className="mt-2 pt-2 border-t text-red-600 bg-red-50 p-2 rounded">
                        <span className="font-medium block mb-1">سبب الرفض:</span>
                        {payment.rejectionReason}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-center p-4 text-gray-500">لا توجد تفاصيل دفع متاحة</div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setPaymentDialog({ open: false, booking: null })}
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
