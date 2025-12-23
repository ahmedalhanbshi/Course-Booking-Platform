"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, XCircle, BookOpen, Users, Trash2, Edit } from "lucide-react"
import { Course } from "@/types"
import { AdminPageHeader } from "@/components/admin/page-header"
import { format } from "date-fns"

// Mock data
const mockCourses: Course[] = [
  {
    id: "course1",
    title: "دورة البرمجة الأساسية",
    description: "تعلم أساسيات البرمجة من الصفر",
    shortDescription: "دورة شاملة للمبتدئين",
    trainerId: "trainer1",
    trainer: {
      id: "trainer1",
      name: "فاطمة علي",
      email: "fatima@example.com",
      role: "trainer",
      status: "active",
      avatar: "/avatars/fatima.jpg",
      createdAt: new Date()
    },
    institute: {
      id: "inst1",
      name: "معهد الرياض للتدريب",
      description: "",
      email: "",
      phone: "",
      address: "",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    category: "برمجة",
    price: 50000,
    duration: 40,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-03-01"),
    maxStudents: 30,
    enrolledStudents: 25,
    rating: 4.5,
    reviewCount: 12,
    status: "approved",
    deliveryType: "in_person",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "course2",
    title: "دورة تطوير التطبيقات",
    description: "بناء تطبيقات الويب الحديثة",
    shortDescription: "React و Node.js",
    trainerId: "trainer2",
    trainer: {
      id: "trainer2",
      name: "محمد أحمد",
      email: "mohamed@example.com",
      role: "trainer",
      status: "active",
      avatar: "/avatars/mohamed.jpg",
      createdAt: new Date()
    },
    institute: {
      id: "inst1",
      name: "معهد الرياض للتدريب",
      description: "",
      email: "",
      phone: "",
      address: "",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    category: "تطوير الويب",
    price: 80000,
    duration: 60,
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-04-15"),
    maxStudents: 25,
    enrolledStudents: 20,
    rating: 4.8,
    reviewCount: 8,
    status: "approved",
    deliveryType: "online",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "course3",
    title: "دورة إدارة المشاريع",
    description: "مهارات إدارة المشاريع الرقمية",
    shortDescription: "Agile و Scrum",
    trainerId: "trainer3",
    trainer: {
      id: "trainer3",
      name: "سارة خالد",
      email: "sara@example.com",
      role: "trainer",
      status: "active",
      avatar: "/avatars/sara.jpg",
      createdAt: new Date()
    },
    institute: {
      id: "inst2",
      name: "أكاديمية جدة التقنية",
      description: "",
      email: "",
      phone: "",
      address: "",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    category: "إدارة",
    price: 60000,
    duration: 30,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-30"),
    maxStudents: 20,
    enrolledStudents: 15,
    rating: 4.2,
    reviewCount: 6,
    status: "cancelled",
    deliveryType: "hybrid",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockTrainersList = [
  { id: "trainer1", name: "فاطمة علي" },
  { id: "trainer2", name: "محمد أحمد" },
  { id: "trainer3", name: "سارة خالد" },
]

const mockInstitutesList = [
  { id: "inst1", name: "معهد الرياض للتدريب" },
  { id: "inst2", name: "أكاديمية جدة التقنية" },
]

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'delete' | 'edit' | null }>({
    open: false,
    type: null
  })
  const [editForm, setEditForm] = useState({
    title: "",
    price: 0,
    description: "",
    shortDescription: "",
    category: "",
    startDate: "",
    endDate: "",
    maxStudents: 0,
    status: "approved",
    trainerId: "",
    instituteId: ""
  })

  const filteredCourses = courses.filter(course => {
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const handleSuspendCourse = (courseId: string) => {
    setCourses(courses.map(course =>
      course.id === courseId ? { ...course, status: 'cancelled' as const } : course
    ))
  }

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course)
    setActionDialog({ open: true, type: 'delete' })
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setEditForm({
      title: course.title,
      price: course.price,
      description: course.description,
      shortDescription: course.shortDescription || "",
      category: course.category,
      startDate: format(course.startDate, "yyyy-MM-dd"),
      endDate: format(course.endDate, "yyyy-MM-dd"),
      maxStudents: course.maxStudents,
      status: course.status,
      trainerId: course.trainerId,
      instituteId: course.instituteId || ""
    })
    setActionDialog({ open: true, type: 'edit' })
  }

  const executeAction = () => {
    if (!selectedCourse) return

    if (actionDialog.type === 'delete') {
      setCourses(courses.filter(c => c.id !== selectedCourse.id))
    } else if (actionDialog.type === 'edit') {
      setCourses(courses.map(c =>
        c.id === selectedCourse.id ? {
          ...c,
          title: editForm.title,
          price: editForm.price,
          description: editForm.description,
          shortDescription: editForm.shortDescription,
          category: editForm.category,
          startDate: new Date(editForm.startDate),
          endDate: new Date(editForm.endDate),
          maxStudents: editForm.maxStudents,
          status: editForm.status as any,
          trainerId: editForm.trainerId,
          instituteId: editForm.instituteId || undefined,
          trainer: mockTrainersList.find(t => t.id === editForm.trainerId) ? {
            ...c.trainer,
            name: mockTrainersList.find(t => t.id === editForm.trainerId)?.name || c.trainer.name,
            id: editForm.trainerId
          } : c.trainer,
          institute: mockInstitutesList.find(i => i.id === editForm.instituteId) ? {
            ...c.institute!,
            name: mockInstitutesList.find(i => i.id === editForm.instituteId)?.name || c.institute!.name,
            id: editForm.instituteId
          } : c.institute
        } : c
      ))
    }

    setActionDialog({ open: false, type: null })
    setSelectedCourse(null)
  }

  const getStatusBadge = (status: Course['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">معتمد</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">نشط</Badge>
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">مكتمل</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const uniqueCategories = Array.from(new Set(courses.map(course => course.category)))

  const totalCourses = courses.length
  const approvedCourses = courses.filter(c => c.status === 'approved' || c.status === 'active').length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة الدورات"
        description="مراجعة وإدارة جميع الدورات في المنصة"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدورات</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">دورة مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الدورات النشطة</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCourses}</div>
            <p className="text-xs text-muted-foreground">دورة متاحة للتسجيل</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="البحث في الدورات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="approved">معتمد</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الدورات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدورة</TableHead>
                <TableHead>المدرب</TableHead>
                <TableHead>المعهد</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الطلاب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500">{new Intl.NumberFormat('en-US').format(course.price)} ريال يمني</div>
                    </div>
                  </TableCell>
                  <TableCell>{course.trainer.name}</TableCell>
                  <TableCell>{course.institute?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolledStudents}/{course.maxStudents}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {(course.status === 'approved' || course.status === 'active') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendCourse(course.id)}
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          تعليق
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCourse(course)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'delete'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف الدورة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCourse && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-red-600">هل أنت متأكد من حذف الدورة <strong>{selectedCourse.title}</strong>؟</p>
                <p className="text-sm text-gray-600 mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
              <Button onClick={executeAction} variant="destructive">
                حذف
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'edit'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الدورة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-title">عنوان الدورة</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">السعر</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">الفئة</Label>
                <Input
                  id="edit-category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-shortDescription">وصف قصير</Label>
                <Input
                  id="edit-shortDescription"
                  value={editForm.shortDescription}
                  onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">الوصف الكامل</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-startDate">تاريخ البدء</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">تاريخ الانتهاء</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-maxStudents">الحد الأقصى للطلاب</Label>
                <Input
                  id="edit-maxStudents"
                  type="number"
                  value={editForm.maxStudents}
                  onChange={(e) => setEditForm({ ...editForm, maxStudents: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">الحالة</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">معتمد</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-trainer">المدرب</Label>
                <Select
                  value={editForm.trainerId}
                  onValueChange={(value) => setEditForm({ ...editForm, trainerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدرب" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTrainersList.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
              <Button onClick={executeAction}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}