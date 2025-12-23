"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, User, BookOpen, CreditCard, FileText, Download } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Mock pending enrollments with payment details
const mockPendingEnrollments = [
    {
        id: "1",
        studentName: "سعيد محمد",
        studentEmail: "saeed@example.com",
        courseTitle: "تعلم React من الصفر",
        requestDate: new Date("2025-01-25T10:30:00"),
        status: "pending",
        paymentType: "transfer",
        amount: 299,
        transactionId: "TRX-123456789",
        paymentEvidence: "/images/receipt-placeholder.jpg",
        initialConfirmation: true,
        paymentConfirmation: true
    },
    {
        id: "2",
        studentName: "نورة علي",
        studentEmail: "noura@example.com",
        courseTitle: "تصميم واجهات المستخدم",
        requestDate: new Date("2025-01-24T15:45:00"),
        status: "pending",
        paymentType: "online",
        amount: 199,
        transactionId: "PAY-987654321",
        paymentEvidence: null,
        initialConfirmation: true,
        paymentConfirmation: false
    },
    {
        id: "3",
        studentName: "خالد عمر",
        studentEmail: "khaled@example.com",
        courseTitle: "تعلم React من الصفر",
        requestDate: new Date("2025-01-26T09:15:00"),
        status: "pending",
        paymentType: "transfer",
        amount: 299,
        transactionId: "TRX-456123789",
        paymentEvidence: "/images/receipt-placeholder.jpg",
        initialConfirmation: false,
        paymentConfirmation: false
    }
]

export default function TrainerEnrollmentsPage() {
    const [enrollments, setEnrollments] = useState(mockPendingEnrollments)
    const [selectedEnrollment, setSelectedEnrollment] = useState<typeof mockPendingEnrollments[0] | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAccept = (id: string) => {
        // In a real app, this would make an API call
        setEnrollments(enrollments.filter(e => e.id !== id))
        setIsDialogOpen(false)
        // Show success message or toast
    }

    const handleReject = (id: string) => {
        // In a real app, this would make an API call
        setEnrollments(enrollments.filter(e => e.id !== id))
        setIsDialogOpen(false)
    }

    const openPaymentDetails = (enrollment: typeof mockPendingEnrollments[0]) => {
        setSelectedEnrollment(enrollment)
        setIsDialogOpen(true)
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات التسجيل</h1>
                <p className="text-gray-600">
                    مراجعة وقبول طلبات انضمام الطلاب للدورات التدريبية
                </p>
            </div>

            <div className="grid gap-6">
                {enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="overflow-hidden bg-white dark:bg-slate-900 shadow-sm border-gray-100 ring-1 ring-gray-100">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4 flex-1">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                            <AvatarFallback>{enrollment.studentName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{enrollment.studentName}</h3>
                                                <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
                                            </div>
                                            
                                            {/* New Verification Status Fields */}
                                            <div className="flex flex-wrap items-center gap-6 py-2 px-4 bg-gray-50/50 rounded-lg w-fit border border-gray-100/50">
                                                 <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${enrollment.initialConfirmation ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <span className={`text-sm font-medium ${enrollment.initialConfirmation ? 'text-gray-900' : 'text-gray-500'}`}>التأكيد المبدئي</span>
                                                    {enrollment.initialConfirmation && <CheckCircle className="h-3.5 w-3.5 text-green-500" />}
                                                 </div>
                                                 <div className="w-px h-4 bg-gray-200"></div>
                                                 <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${enrollment.paymentConfirmation ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <span className={`text-sm font-medium ${enrollment.paymentConfirmation ? 'text-gray-900' : 'text-gray-500'}`}>تأكيد الدفع</span>
                                                     {enrollment.paymentConfirmation && <CheckCircle className="h-3.5 w-3.5 text-green-500" />}
                                                 </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-medium">
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                    <span>{enrollment.courseTitle}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>منذ {formatDate(enrollment.requestDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {enrollment.initialConfirmation && (
                                            <Button
                                                variant="outline"
                                                onClick={() => openPaymentDetails(enrollment)}
                                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                            >
                                                <FileText className="ml-2 h-4 w-4" />
                                                تفاصيل الدفع
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleAccept(enrollment.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="ml-2 h-4 w-4" />
                                            قبول
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleReject(enrollment.id)}
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <XCircle className="ml-2 h-4 w-4" />
                                            رفض
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                لا توجد طلبات معلقة
                            </h3>
                            <p className="text-gray-500">
                                جميع طلبات التسجيل تمت مراجعتها
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Payment Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>تفاصيل الدفع</DialogTitle>
                    </DialogHeader>

                    {selectedEnrollment && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">الطالب</p>
                                    <p className="font-semibold">{selectedEnrollment.studentName}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">الدورة</p>
                                    <p className="font-semibold">{selectedEnrollment.courseTitle}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">المبلغ</p>
                                    <p className="font-semibold text-green-600">{selectedEnrollment.amount} ريال</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">نوع الدفع</p>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-gray-400" />
                                        <p className="font-semibold">
                                            {selectedEnrollment.paymentType === 'transfer' ? 'تحويل بنكي' : 'دفع إلكتروني'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    {selectedEnrollment.paymentType === 'transfer' ? 'صورة الإيصال' : 'تفاصيل الفاتورة'}
                                </h4>

                                {selectedEnrollment.paymentType === 'transfer' ? (
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                        {/* In a real app, use the actual image URL */}
                                        <div className="text-center text-gray-400">
                                            <FileText className="h-12 w-12 mx-auto mb-2" />
                                            <p>صورة الإيصال</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-dashed">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">رقم المعاملة:</span>
                                            <span className="font-mono">{selectedEnrollment.transactionId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">تاريخ الدفع:</span>
                                            <span>{formatDate(selectedEnrollment.requestDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">الحالة:</span>
                                            <Badge className="bg-green-100 text-green-800">تم الدفع</Badge>
                                        </div>
                                        <div className="pt-3 border-t flex justify-between items-center">
                                            <span className="font-bold">الإجمالي:</span>
                                            <span className="font-bold text-lg">{selectedEnrollment.amount} ريال</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <div className="flex gap-2 w-full">
                                    <Button
                                        onClick={() => handleAccept(selectedEnrollment.id)}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="ml-2 h-4 w-4" />
                                        تأكيد وقبول
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleReject(selectedEnrollment.id)}
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <XCircle className="ml-2 h-4 w-4" />
                                        رفض
                                    </Button>
                                </div>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
