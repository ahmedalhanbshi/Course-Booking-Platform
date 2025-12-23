"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, UserX, Users, BookOpen, Trash2, Edit } from "lucide-react"
import { User } from "@/types"
import { formatDate } from "@/lib/utils"
import { AdminPageHeader } from "@/components/admin/page-header"

// Mock data
const mockStudents: User[] = [
  {
    id: "student1",
    name: "علي أحمد",
    email: "ali@example.com",
    phone: "0501234567",
    role: "student",
    status: "active",
    avatar: "/avatars/ali.jpg",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "student2",
    name: "فاطمة محمد",
    email: "fatima.m@example.com",
    phone: "0507654321",
    role: "student",
    status: "active",
    avatar: "/avatars/fatima.jpg",
    createdAt: new Date("2023-02-20")
  },
  {
    id: "student3",
    name: "أحمد حسن",
    email: "ahmed.h@example.com",
    phone: "0509876543",
    role: "student",
    status: "suspended",
    avatar: "/avatars/ahmed.jpg",
    createdAt: new Date("2023-03-10")
  },
  {
    id: "student4",
    name: "سارة خالد",
    email: "sara.k@example.com",
    phone: "0501122334",
    role: "student",
    status: "pending",
    avatar: "/avatars/sara.jpg",
    createdAt: new Date("2023-04-05")
  }
]

const mockStudentStats = [
  { id: "student1", enrolledCourses: 3, completedCourses: 2 },
  { id: "student2", enrolledCourses: 2, completedCourses: 1 },
  { id: "student3", enrolledCourses: 4, completedCourses: 3 },
  { id: "student4", enrolledCourses: 1, completedCourses: 0 }
]

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'view' | 'suspend' | 'delete' | 'edit' | null }>({
    open: false,
    type: null
  })
  const [deleteReason, setDeleteReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    status: "active",
    avatar: "",
    password: ""
  })

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewStudent = (student: User) => {
    setSelectedStudent(student)
    setActionDialog({ open: true, type: 'view' })
  }

  const handleSuspendStudent = (student: User) => {
    setSelectedStudent(student)
    setActionDialog({ open: true, type: 'suspend' })
  }

  const handleDeleteStudent = (student: User) => {
    setSelectedStudent(student)
    setDeleteReason("")
    setActionDialog({ open: true, type: 'delete' })
  }

  const handleEditStudent = (student: User) => {
    setSelectedStudent(student)
    setEditForm({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      role: student.role as string,
      status: student.status || "active",
      avatar: student.avatar || "",
      password: ""
    })
    setActionDialog({ open: true, type: 'edit' })
  }

  const executeAction = () => {
    if (!selectedStudent) return

    if (actionDialog.type === 'delete') {
      console.log(`Deleting student ${selectedStudent.id} with reason: ${deleteReason}`)
      setStudents(students.filter(s => s.id !== selectedStudent.id))
    } else if (actionDialog.type === 'edit') {
      setStudents(students.map(s =>
        s.id === selectedStudent.id ? {
          ...s,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          role: editForm.role as any,
          status: editForm.status as any,
          avatar: editForm.avatar
        } as User : s
      ))
    }

    setActionDialog({ open: false, type: null })
    setSelectedStudent(null)
  }

  const getStudentStats = (studentId: string) => {
    return mockStudentStats.find(stat => stat.id === studentId) || {
      enrolledCourses: 0,
      completedCourses: 0,
    }
  }

  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'active').length
  const totalEnrollments = mockStudentStats.reduce((sum, stat) => sum + stat.enrolledCourses, 0)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة الطلاب"
        description="مراجعة وإدارة الطلاب المسجلين في المنصة"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">طالب مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلاب النشطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">نشط هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التسجيلات</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">تسجيل في دورات</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="البحث في الطلاب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلاب</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الطالب</TableHead>
                <TableHead>الدورات المسجلة</TableHead>
                <TableHead>الدورات المكتملة</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const stats = getStudentStats(student.id)
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {student.avatar && (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {stats.enrolledCourses}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {stats.completedCourses}/{stats.enrolledCourses}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(student.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewStudent(student)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuspendStudent(student)}
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          تعليق
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStudent(student)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'view'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الطالب</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedStudent.avatar ? (
                    <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <p className="text-sm text-gray-500">
                    انضم في {formatDate(selectedStudent.createdAt)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'}>
                      {selectedStudent.status === 'active' ? 'نشط' : selectedStudent.status === 'suspended' ? 'معلق' : 'قيد المراجعة'}
                    </Badge>
                    <Badge variant="outline">{selectedStudent.role}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {getStudentStats(selectedStudent.id).enrolledCourses}
                      </div>
                      <div className="text-sm text-gray-600">دورة مسجل</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getStudentStats(selectedStudent.id).completedCourses}
                      </div>
                      <div className="text-sm text-gray-600">دورة مكتملة</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">الدورات المسجلة</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">دورة البرمجة الأساسية</span>
                      <Badge>مكتملة</Badge>
                    </div>
                    <p className="text-sm text-gray-600">فاطمة علي</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">دورة تطوير التطبيقات</span>
                      <Badge variant="outline">قيد الدراسة</Badge>
                    </div>
                    <p className="text-sm text-gray-600">محمد أحمد</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setActionDialog({ open: false, type: null })} className="flex-1">
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'suspend'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعليق الطالب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>هل أنت متأكد من تعليق حساب الطالب <strong>{selectedStudent.name}</strong>؟</p>
                <p className="text-sm text-gray-600 mt-2">سيتم منع الوصول إلى جميع الدورات والمحتوى.</p>
              </div>
            )}
            <div>
              <Label htmlFor="suspend-reason">سبب التعليق</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر السبب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="violation">انتهاك القواعد</SelectItem>
                  <SelectItem value="payment">مشاكل دفع</SelectItem>
                  <SelectItem value="inactive">عدم نشاط</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={executeAction} className="bg-red-600 hover:bg-red-700">
                تعليق الحساب
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

      {/* Delete Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'delete'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف الطالب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                   <p className="text-red-600 font-medium">هل أنت متأكد من حذف حساب الطالب <strong>{selectedStudent.name}</strong>؟</p>
                   <p className="text-sm text-gray-600 mt-1">لا يمكن التراجع عن هذا الإجراء.</p>
                </div>
                
                 <div className="space-y-2">
                    <Label htmlFor="delete-reason" className="text-sm">سبب الحذف <span className="text-red-500">*</span></Label>
                    <Textarea 
                        id="delete-reason" 
                        placeholder="يرجى كتابة سبب الحذف..." 
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        className="bg-white"
                    />
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
              <Button 
                onClick={executeAction} 
                variant="destructive"
                disabled={deleteReason.length < 5}
              >
                حذف
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'edit'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">الاسم</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input
                id="edit-email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-avatar">رابط الصورة الشخصية</Label>
              <Input
                id="edit-avatar"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <Label htmlFor="edit-password">كلمة المرور الجديدة</Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="اتركها فارغة إذا لم ترد التغيير"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">الدور</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">طالب</SelectItem>
                  <SelectItem value="trainer">مدرب</SelectItem>
                  <SelectItem value="institute_admin">مسؤول معهد</SelectItem>
                  <SelectItem value="platform_admin">مسؤول منصة</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                </SelectContent>
              </Select>
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