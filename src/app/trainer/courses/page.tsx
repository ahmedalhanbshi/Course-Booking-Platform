"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Plus, Search, Users, Calendar, Edit, MoreHorizontal, DollarSign, UploadCloud, FileText, ChevronDown, X, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { trainerService } from "@/lib/trainer-service"

const bankAccounts = [
  {
    id: "inma",
    bankName: "بنك الإنماء",
    iban: "SA56 0500 0012 3456 7890 1234",
    beneficiary: "معهد التدريب المتقدم"
  }
]

export default function TrainerCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await trainerService.getCourses()
        setCourses(data)
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "فشل في تحميل الدورات")
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.shortDescription ?? course.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "title": return a.title.localeCompare(b.title)
      case "students": return (b.enrolledStudents ?? 0) - (a.enrolledStudents ?? 0)
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      default: return new Date(b.createdAt ?? b.startDate).getTime() - new Date(a.createdAt ?? a.startDate).getTime()
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">مستمر</Badge>
      case 'draft':
        return <Badge variant="secondary">مسودة</Badge>
      case 'pending':
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">بانتظار الموافقة المبدئية</Badge>
      case 'payment_required':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">بانتظار سداد الرسوم</Badge>
      case 'processing_payment':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">جارٍ التحقق من الدفع</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">مكتمل</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptInfo, setReceiptInfo] = useState<{ name: string; note: string }>({
    name: "",
    note: ""
  })
  const [paymentError, setPaymentError] = useState("")
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [expandedBankId, setExpandedBankId] = useState<string | null>(bankAccounts[0]?.id ?? null)
  const paymentFileRef = useRef<HTMLInputElement | null>(null)

  const handlePaymentClick = (course: any) => {
    setSelectedCourse(course)
    setPaymentModalOpen(true)
  }

  const handlePaymentSubmit = () => {
    if (!receiptFile && !receiptInfo.name) {
      setPaymentError("يرجى رفع سند الدفع قبل التأكيد.")
      return
    }
    setPaymentError("")
    setPaymentModalOpen(false)
    toast.success("تم رفع السند بنجاح وبانتظار المراجعة")
  }

  const formatYER = (value: number) =>
    `${new Intl.NumberFormat("en-US").format(value)} ر.ي`

  const formatFileSize = (size?: number) => {
    if (!size || Number.isNaN(size)) return ""
    if (size < 1024) return `${size} B`
    const kb = size / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  const handleReceiptFile = (file: File | null) => {
    setReceiptFile(file)
    if (file) {
      setReceiptInfo((prev) => ({ ...prev, name: file.name }))
    }
    setPaymentError("")
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent
          dir="rtl"
          className="max-w-3xl [&>button[data-dialog-close='default']]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4"
        >
          <DialogClose className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30">
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
          <DialogHeader className="space-y-2 text-right">
            <DialogTitle className="text-right">إتمام عملية دفع رسوم القاعة</DialogTitle>
            <DialogDescription className="text-right">
              {selectedCourse ? `${selectedCourse.title} - ${formatYER(5000)}` : formatYER(5000)}
              <br />
              يرجى تحويل المبلغ وإرفاق سند الدفع لإكمال الخطوة.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4 lg:grid-cols-2">
            <div className="order-2 space-y-4 text-right lg:order-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">رفع سند الدفع</h4>
                  <span className="text-xs text-slate-500">صور أو PDF</span>
                </div>
                <div
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDraggingFile(true)
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setIsDraggingFile(false)
                    const file = event.dataTransfer.files?.[0] ?? null
                    handleReceiptFile(file)
                  }}
                  onClick={() => paymentFileRef.current?.click()}
                  className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-5 text-sm transition ${isDraggingFile ? "border-blue-500 bg-blue-50/60" : "border-slate-200 bg-slate-50/60"
                    }`}
                >
                  <UploadCloud className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-slate-700">اسحب الملف هنا</span>
                  <span className="text-xs text-slate-500">أو اختر ملفًا من جهازك</span>
                  <Button type="button" size="sm" className="rounded-full">
                    اختيار ملف
                  </Button>
                  <Input
                    ref={paymentFileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null
                      handleReceiptFile(file)
                    }}
                  />
                </div>
                {(receiptFile?.name || receiptInfo.name) && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {receiptFile?.name ?? receiptInfo.name}
                        </p>
                        {receiptFile && (
                          <p className="text-[11px] text-slate-500">
                            {receiptFile.type || "ملف"} · {formatFileSize(receiptFile.size)}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReceiptFile(null)
                          setReceiptInfo((prev) => ({ ...prev, name: "" }))
                        }}
                        className="h-7 rounded-full px-3 text-xs"
                      >
                        إزالة الملف
                      </Button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => paymentFileRef.current?.click()}
                        className="h-7 rounded-full px-3 text-xs"
                      >
                        تغيير الملف
                      </Button>
                    </div>
                  </div>
                )}
                {!receiptFile?.name && !receiptInfo.name && (
                  <p className="mt-3 text-xs text-slate-500">
                    ارفع سند الدفع أولاً حتى تتمكن من التأكيد.
                  </p>
                )}
                {paymentError && <p className="mt-2 text-xs text-red-500">{paymentError}</p>}
              </div>
            </div>
            <div className="order-1 space-y-4 text-right lg:order-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">الحسابات البنكية</h4>
                  <span className="text-xs text-slate-500">اختر بنكًا لعرض التفاصيل</span>
                </div>
                <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {bankAccounts.map((bank) => {
                    const isOpen = expandedBankId === bank.id
                    return (
                      <div key={bank.id} className="rounded-xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBankId((prev) => (prev === bank.id ? null : bank.id))
                          }
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm font-semibold text-slate-900">
                            {bank.bankName}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-200 px-4 py-3 text-right text-sm">
                            <p className="text-xs text-slate-500">
                              اسم المستفيد: {bank.beneficiary}
                            </p>
                            <div className="mt-3 space-y-2">
                              <p className="text-xs text-slate-500">رقم IBAN</p>
                              <p className="font-mono text-sm font-semibold text-slate-900">
                                {bank.iban}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(bank.iban)
                                    toast.success("تم نسخ رقم الآيبان")
                                  } catch {
                                    toast.error("تعذر نسخ رقم الآيبان")
                                  }
                                }}
                                className="h-7 rounded-full px-3 text-xs"
                              >
                                نسخ IBAN
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              onClick={handlePaymentSubmit}
              disabled={!receiptFile?.name && !receiptInfo.name}
              className="w-full"
            >
              تأكيد الدفع بإرسال السند
            </Button>
            {!receiptFile?.name && !receiptInfo.name && (
              <p className="mt-2 text-xs text-red-500 text-right">
                ارفع السند أولاً لتفعيل زر التأكيد.
              </p>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الدورات</h1>
        </div>
        <Button asChild>
          <Link href="/trainer/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            إنشاء دورة جديدة
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الدورات</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold">
                  {courses.reduce((acc, course) => acc + (course.enrolledStudents ?? 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الدورات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="حالة الدورة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">مستمر</SelectItem>
              <SelectItem value="pending_approval">بانتظار الموافقة</SelectItem>
              <SelectItem value="payment_required">بانتظار الدفع</SelectItem>
              <SelectItem value="processing_payment">التحقق من الدفع</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="title">الاسم</SelectItem>
              <SelectItem value="students">عدد الطلاب</SelectItem>
              <SelectItem value="price-low">السعر: من الأقل</SelectItem>
              <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>الدورات ({sortedCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">الدورة</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>الطلاب</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {course.shortDescription || course.description}
                      </div>
                      {course.category && (
                        <div className="text-xs text-gray-400 mt-1">{course.category}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Intl.NumberFormat('en-US').format(course.price)} ر.ي</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{course.enrolledStudents ?? 0}/{course.maxStudents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{course.startDate ? formatDate(new Date(course.startDate)) : '—'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(course.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Conditional Payment Button */}
                      {course.status === 'payment_required' && (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white h-8 px-2 text-xs"
                          onClick={() => handlePaymentClick(course)}
                        >
                          <DollarSign className="h-3 w-3 ml-1" />
                          تأكيد الدفع
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">

                          <DropdownMenuItem asChild>
                            <Link href={`/trainer/courses/${course.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              تعديل
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/trainer/courses/${course.id}/students`}>
                              <Users className="mr-2 h-4 w-4" />
                              إدارة الطلاب
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sortedCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || statusFilter !== "all" ? "لا توجد دورات تطابق البحث" : "لا توجد دورات بعد"}
              </h3>
              <p className="text-gray-500 mb-6">
                ابدأ بإنشاء دورة تدريبية جديدة
              </p>
              <Button asChild>
                <Link href="/trainer/courses/create">
                  <Plus className="mr-2 h-4 w-4" />
                  إنشاء الدورة الأولى
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
