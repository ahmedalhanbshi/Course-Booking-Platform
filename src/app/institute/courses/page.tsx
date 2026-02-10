"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, Clock, Users, BookOpen, MoreVertical, UserCog, Plus, Edit, Trash2, Search } from "lucide-react"
import { Course } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"

// Mock data
// Statuses: 'active' (مستمر), 'completed' (مكتمل), 'draft' (مسودة)
const mockCourses: any[] = [
  {
    id: "1",
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
    category: "برمجة",
    price: 50000,
    duration: 40,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-03-01"),
    maxStudents: 30,
    enrolledStudents: 25,
    rating: 4.5,
    reviewCount: 12,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
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
    category: "تطوير الويب",
    price: 80000,
    duration: 60,
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-04-15"),
    maxStudents: 25,
    enrolledStudents: 20,
    rating: 4.8,
    reviewCount: 8,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
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
    category: "إدارة",
    price: 60000,
    duration: 30,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-30"),
    maxStudents: 20,
    enrolledStudents: 20,
    rating: 4.2,
    reviewCount: 6,
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Mock trainers list for selection
const availableTrainers = [
  { id: "trainer1", name: "فاطمة علي" },
  { id: "trainer2", name: "محمد أحمد" },
  { id: "trainer3", name: "سارة خالد" },
  { id: "trainer4", name: "ياسر عمر" },
]

export default function InstituteCourses() {
  const [courses, setCourses] = useState<any[]>(mockCourses)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [trainerFilter, setTrainerFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const normalizeText = (value: string) => {
    if (!value) return value
    if (!/[ØÙ]/.test(value)) return value
    try {
      return decodeURIComponent(escape(value))
    } catch {
      return value
    }
  }

  // State for changing trainer
  const [isChangeTrainerOpen, setIsChangeTrainerOpen] = useState(false)
  const [selectedCourseForTrainerChange, setSelectedCourseForTrainerChange] = useState<any | null>(null)
  const [newTrainerId, setNewTrainerId] = useState("")

  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null)

  const filteredCourses = courses.filter(course => {
    const normalizedTitle = normalizeText(course.title)
    const normalizedTrainer = normalizeText(course.trainer?.name ?? "")
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesTrainer = trainerFilter === "all" || normalizedTrainer.includes(trainerFilter)
    const matchesSearch = normalizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      normalizedTrainer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesTrainer && matchesSearch
  })

  const handleDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter(c => c.id !== courseToDelete.id))
      setIsDeleteDialogOpen(false)
      setCourseToDelete(null)
      toast.success("تم حذف الدورة بنجاح")
    }
  }

  const openChangeTrainerDialog = (course: any) => {
    setSelectedCourseForTrainerChange(course)
    setNewTrainerId(course.trainerId)
    setIsChangeTrainerOpen(true)
  }

  const handleChangeTrainer = () => {
    if (selectedCourseForTrainerChange && newTrainerId) {
      const selectedTrainer = availableTrainers.find(t => t.id === newTrainerId)
      if (selectedTrainer) {
        setCourses(courses.map(course =>
          course.id === selectedCourseForTrainerChange.id
            ? {
              ...course,
              trainerId: newTrainerId,
              trainer: { ...course.trainer, id: newTrainerId, name: selectedTrainer.name, status: 'active' }
            }
            : course
        ))
        toast.success("تم تغيير المدرب بنجاح")
      }
      setIsChangeTrainerOpen(false)
      setSelectedCourseForTrainerChange(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">مستمر</Badge>
      case 'completed':
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">مكتمل</Badge> // Gray/Blue as requested
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">مسودة</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const uniqueTrainers = Array.from(new Set(courses.map(course => normalizeText(course.trainer?.name ?? ""))))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الدورات</h1>
          <p className="text-gray-600 mt-2">مراجعة وإدارة دورات المعهد</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/institute/courses/create">
            <Plus className="h-4 w-4" />
            إنشاء دورة جديدة
          </Link>
        </Button>
      </div>

            {/* Filters */}
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
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trainerFilter} onValueChange={setTrainerFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="المدرب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المدربين</SelectItem>
              {uniqueTrainers.map(trainer => (
                <SelectItem key={trainer} value={trainer as string}>{trainer as string}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
                      <div className="font-medium">{normalizeText(course.title)}</div>
                      <div className="text-sm text-gray-500">{new Intl.NumberFormat('en-US').format(course.price)} ريال يمني</div>
                    </div>
                  </TableCell>
                  <TableCell>{normalizeText(course.trainer.name)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{normalizeText(course.category)}</Badge>
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
                       {/* Simplified Actions for Institute Admin */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                             <Link href={`/institute/courses/${course.id}/students`} className="flex items-center cursor-pointer w-full">
                               <Users className="mr-2 h-4 w-4" />
                               إدارة الطلاب
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل الدورة
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openChangeTrainerDialog(course)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            تغيير المدرب
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => {
                              setCourseToDelete(course)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف الدورة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isChangeTrainerOpen} onOpenChange={setIsChangeTrainerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير مدرب الدورة</DialogTitle>
            <DialogDescription>
              اختر المدرب الجديد للدورة "{selectedCourseForTrainerChange?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="trainer-select" className="mb-2 block">اختر المدرب</Label>
            <Select value={newTrainerId} onValueChange={setNewTrainerId}>
              <SelectTrigger id="trainer-select">
                <SelectValue placeholder="اختر مدربًا" />
              </SelectTrigger>
              <SelectContent>
                {availableTrainers.map(trainer => (
                  <SelectItem key={trainer.id} value={trainer.id}>{trainer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeTrainerOpen(false)}>إلغاء</Button>
            <Button onClick={handleChangeTrainer}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف الدورة "{courseToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

