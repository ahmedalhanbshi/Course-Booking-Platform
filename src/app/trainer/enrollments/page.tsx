"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, User, BookOpen, CreditCard, FileText, Download, Phone } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Mock pending enrollments with payment details
const mockPendingEnrollments = [
    {
        id: "1",
        studentName: "سعيد محمد",
        studentEmail: "saeed@example.com",
        studentPhone: "+967 777 123 456",
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
        studentPhone: "+967 771 222 333",
        courseTitle: "تصميم واجهات المستخدم",
        requestDate: new Date("2025-01-24T15:45:00"),
        status: "accepted",
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
        studentPhone: "+967 733 444 555",
        courseTitle: "تعلم React من الصفر",
        requestDate: new Date("2025-01-26T09:15:00"),
        status: "rejected",
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
    const formatAmount = (amount: number) => `${(amount * 1000).toLocaleString("ar-YE")} ر.ي`

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
        <div className="max-w-5xl mx-auto" dir="rtl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات التسجيل</h1>
                <p className="text-gray-600">مراجعة وقبول طلبات انضمام الطلاب للدورات التدريبية</p>
            </div>

            <div className="grid gap-6">
                {enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="overflow-hidden bg-white shadow-sm border border-slate-100">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <Avatar className="h-12 w-12 border border-slate-100 shadow-sm">
                                            <AvatarFallback>{enrollment.studentName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-bold text-slate-900">{enrollment.studentName}</h3>
                                                {enrollment.status === "accepted" && (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">تم القبول</Badge>
                                                )}
                                                {enrollment.status === "rejected" && (
                                                    <Badge className="bg-rose-50 text-rose-700 border border-rose-200">تم الرفض</Badge>
                                                )}
                                                {enrollment.status === "pending" && (
                                                    <Badge className="bg-amber-50 text-amber-700 border border-amber-200">قيد المراجعة</Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-500 space-y-1">
                                                <p>{enrollment.studentEmail}</p>
                                                <p className="flex items-center gap-1">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {enrollment.studentPhone}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 w-fit">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${enrollment.initialConfirmation ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                    <span className={`text-xs font-medium ${enrollment.initialConfirmation ? 'text-slate-900' : 'text-slate-500'}`}>التأكيد المبدئي</span>
                                                    {enrollment.initialConfirmation && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                                                </div>
                                                <div className="w-px h-4 bg-slate-200"></div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${enrollment.paymentConfirmation ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                    <span className={`text-xs font-medium ${enrollment.paymentConfirmation ? 'text-slate-900' : 'text-slate-500'}`}>تأكيد الدفع</span>
                                                    {enrollment.paymentConfirmation && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-medium">
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                    <span>{enrollment.courseTitle}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
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
                                        {enrollment.status === "pending" && (
                                            <>
                                                <Button
                                                    onClick={() => handleAccept(enrollment.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                >
                                                    <CheckCircle className="ml-2 h-4 w-4" />
                                                    قبول
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleReject(enrollment.id)}
                                                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                >
                                                    <XCircle className="ml-2 h-4 w-4" />
                                                    رفض
                                                </Button>
                                            </>
                                        )}
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات معلّقة</h3>
                            <p className="text-gray-500">جميع طلبات التسجيل تمت مراجعتها</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Payment Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[820px] w-[95vw] rounded-2xl p-0">
                    <div className="px-6 pt-6">
                        <DialogHeader className="text-right">
                            <DialogTitle>تفاصيل الدفع</DialogTitle>
                        </DialogHeader>
                    </div>

                    {selectedEnrollment && (
                        <div className="px-6 pb-6 pt-4">
                            <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                                <div className="order-1">
                                    <div className="rounded-2xl border border-slate-100 bg-white p-4 h-full">
                                        <h4 className="flex items-center gap-2 font-semibold text-slate-900 text-right">
                                            <FileText className="h-4 w-4 text-slate-500" />
                                            سند الدفع
                                        </h4>
                                        <div className="mt-4">
                                            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                <Image
                                                    src={selectedEnrollment.paymentEvidence ?? "/images/receipt-placeholder.svg"}
                                                    alt="سند الدفع"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-2 space-y-4 text-right">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 border border-slate-200 shadow-sm">
                                                <AvatarFallback>{selectedEnrollment.studentName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-500">الطالب</p>
                                                <p className="text-lg font-semibold text-slate-900">{selectedEnrollment.studentName}</p>
                                                <div className="mt-1 space-y-1 text-sm text-slate-600">
                                                    <p>{selectedEnrollment.studentEmail}</p>
                                                    <p className="flex items-center gap-1">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {selectedEnrollment.studentPhone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                        <p className="text-sm text-slate-500">ملخص الدفع</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-sm text-slate-500">الإجمالي</span>
                                            <span className="text-lg font-semibold text-slate-900">{formatAmount(selectedEnrollment.amount)}</span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-sm text-slate-500">تاريخ الطلب</span>
                                            <span className="text-sm text-slate-600">{formatDate(selectedEnrollment.requestDate)}</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                        <p className="text-sm text-slate-500">الدورة</p>
                                        <p className="mt-1 font-semibold text-slate-900">{selectedEnrollment.courseTitle}</p>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                            <Clock className="h-4 w-4" />
                                            <span>تاريخ التسجيل: {formatDate(selectedEnrollment.requestDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-6 gap-2 sm:gap-0">
                                <div className="flex gap-2 w-full">
                                    <Button
                                        onClick={() => handleAccept(selectedEnrollment.id)}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <CheckCircle className="ml-2 h-4 w-4" />
                                        تأكيد وقبول
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleReject(selectedEnrollment.id)}
                                        className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
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


