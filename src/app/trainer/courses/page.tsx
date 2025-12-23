"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Plus, Search, Users, Calendar, Eye, Edit, MoreHorizontal, Star, Clock, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, CreditCard, Banknote } from "lucide-react"
import { toast } from "sonner"

// Mock courses data
const courses = [
  {
    id: "1",
    title: "تعلم React من الصفر",
    description: "دورة شاملة في تعلم React.js مع مشاريع عملية",
    status: 'active' as const,
    enrolledStudents: 23,
    maxStudents: 50,
    price: 29900,
    rating: 4.8,
    reviewCount: 156,
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-15"),
    category: "تطوير الويب",
    institute: "أكاديمية التكنولوجيا",
  },
  {
    id: "2",
    title: "تصميم واجهات المستخدم",
    description: "تعلم مبادئ التصميم وأدوات التصميم الحديثة",
    status: 'payment_required' as const, // New Status Example
    enrolledStudents: 18,
    maxStudents: 30,
    price: 39900,
    rating: 4.9,
    reviewCount: 89,
    startDate: new Date("2025-02-15"),
    endDate: new Date("2025-03-30"),
    category: "التصميم",
    institute: "معهد التصميم الرقمي",
  },
  {
    id: "3",
    title: "إدارة المشاريع الرقمية",
    description: "تعلم إدارة المشاريع الرقمية باستخدام أدوات حديثة",
    status: 'processing_payment' as const, // New Status Example
    enrolledStudents: 0,
    maxStudents: 40,
    price: 49900,
    rating: 0,
    reviewCount: 0,
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-04-30"),
    category: "إدارة الأعمال",
    institute: "جامعة الأعمال",
  },
  {
    id: "4",
    title: "تعلم Python للمبتدئين",
    description: "دورة شاملة في لغة Python مع تطبيقات عملية",
    status: 'pending_approval' as const, // New Status Example
    enrolledStudents: 0,
    maxStudents: 45,
    price: 24900,
    rating: 0,
    reviewCount: 0,
    startDate: new Date("2025-02-10"),
    endDate: new Date("2025-03-25"),
    category: "تطوير البرمجيات",
    institute: null,
  },
]

export default function TrainerCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "students":
        return b.enrolledStudents - a.enrolledStudents
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
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
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'receipt'>('online')

  const handlePaymentClick = (course: typeof courses[0]) => {
      setSelectedCourse(course)
      setPaymentModalOpen(true)
  }

  const handlePaymentSubmit = () => {
      setPaymentModalOpen(false)
      toast.success(paymentMethod === 'online' ? "تمت عملية الدفع بنجاح" : "تم رفع السند بنجاح وبانتظار المراجعة")
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>إتمام عملية دفع رسوم القاعة</DialogTitle>
                <DialogDescription>
                    {selectedCourse?.title} - {new Intl.NumberFormat('en-US').format(5000)} ريال يمني
                </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="card" className="w-full" onValueChange={(v) => setPaymentMethod(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">دفع إلكتروني</TabsTrigger>
                    <TabsTrigger value="receipt">إرفاق صورة السند</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-number">رقم البطاقة</Label>
                            <Input id="card-number" placeholder="0000 0000 0000 0000" dir="ltr" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                                <Input id="expiry" placeholder="MM/YY" dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" dir="ltr" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">الاسم على البطاقة</Label>
                            <Input id="name" placeholder="الاسم بالكامل" />
                        </div>
                        <Button onClick={handlePaymentSubmit} className="w-full bg-blue-600 hover:bg-blue-700">ادفع الآن</Button>
                    </div>
                </TabsContent>

                <TabsContent value="receipt">
                     <div className="space-y-4 py-4">
                         <div className="bg-muted p-4 rounded text-sm border"><p className="font-mono">حساب الراجحي: SA00000000</p></div>
                         <Label>رفع الإيصال</Label>
                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                             <Upload className="w-8 h-8 mb-2" />
                             <span className="text-xs">اضغط لرفع الصورة</span>
                             <Input type="file" className="hidden" />
                         </div>
                         <Button onClick={handlePaymentSubmit} className="w-full">تأكيد الطلب</Button>
                     </div>
                </TabsContent>
            </Tabs>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الدورات</h1>
          <p className="text-gray-600">
            إدارة ومتابعة جميع الدورات التدريبية التي تقدمها
          </p>
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
                  {courses.reduce((acc, course) => acc + course.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
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
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="price-low">السعر: من الأقل</SelectItem>
                <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                        {course.description}
                      </div>
                      {course.institute && (
                        <div className="text-xs text-gray-400 mt-1">
                          {course.institute}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Intl.NumberFormat('en-US').format(course.price)} ريال يمني</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{course.enrolledStudents}/{course.maxStudents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(course.startDate)}</span>
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
                لا توجد دورات
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