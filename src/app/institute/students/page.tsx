"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreVertical, Mail, Phone, Eye, User, BookOpen, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Mock data for students
const mockStudents = [
    {
        id: "1",
        name: "سارة أحمد",
        email: "sara@example.com",
        phone: "+966501234567",
        enrolledCourses: ["برمجة واجهات المستخدم", "تصميم تجربة المستخدم", "JavaScript المتقدمة"],
        status: "active",
        trainer: "فاطمة علي"
    },
    {
        id: "2",
        name: "محمد علي",
        email: "mohammed@example.com",
        phone: "+966502345678",
        enrolledCourses: ["أساسيات Python"],
        status: "active",
        trainer: "محمد أحمد"
    },
    {
        id: "3",
        name: "نورة سعد",
        email: "noura@example.com",
        phone: "+966503456789",
        enrolledCourses: ["التسويق الرقمي", "إدارة المشاريع الاحترافية"],
        status: "inactive",
        trainer: "سارة خالد"
    },
    {
        id: "4",
        name: "خالد عمر",
        email: "khaled@example.com",
        phone: "+966504567890",
        enrolledCourses: ["React Development", "Node.js Backend", "MongoDB Database", "DevOps Basics"],
        status: "active",
        trainer: "فاطمة علي"
    }
]

export default function InstituteStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<typeof mockStudents[0] | null>(null)

    const filteredStudents = mockStudents.filter(student =>
        student.name.includes(searchTerm) || student.email.includes(searchTerm)
    )

    const handleViewDetails = (student: typeof mockStudents[0]) => {
        setSelectedStudent(student)
        setIsDialogOpen(true)
    }

    const handleDeleteClick = (student: typeof mockStudents[0]) => {
        setStudentToDelete(student)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        console.log("Deleting student:", studentToDelete?.id)
        // In real app, call API to delete student
        setIsDeleteDialogOpen(false)
        setStudentToDelete(null)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة الطلاب</h1>
                <p className="text-gray-600 mt-2">عرض وإدارة الطلاب المسجلين في المعهد</p>
            </div>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">حذف الطالب</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف الطالب {studentToDelete?.name}؟
                            <br />
                            هذا الإجراء سيقوم بحذف حساب الطالب وجميع بياناته من المعهد بشكل نهائي.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            نعم، حذف الطالب
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>قائمة الطلاب</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="بحث عن طالب..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                تصفية
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الطالب</TableHead>
                                <TableHead>معلومات الاتصال</TableHead>
                                <TableHead>المدرب</TableHead>
                                <TableHead>الدورات المسجلة</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" />
                                                {student.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3" />
                                                {student.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            {student.trainer}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {student.enrolledCourses.length} دورات
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className={student.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                            {student.status === 'active' ? 'مستمر' : 'غير نشط'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    عرض التفاصيل
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    إرسال رسالة
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => handleDeleteClick(student)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    حذف الطالب
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>تفاصيل الطالب</DialogTitle>
                        <DialogDescription>
                            عرض المعلومات الكاملة للطالب
                        </DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{selectedStudent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                                    <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                        {selectedStudent.status === 'active' ? 'مستمر' : 'غير نشط'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{selectedStudent.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{selectedStudent.phone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <BookOpen className="h-4 w-4 text-gray-500 mt-1" />
                                    <div>
                                        <span className="block mb-1">الدورات المسجلة:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedStudent.enrolledCourses.map((course, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {course}
                                                </Badge>
                                            ))}
                                            {selectedStudent.enrolledCourses.length === 0 && (
                                                <span className="text-gray-500">لا توجد دورات</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>المدرب المشرف: {selectedStudent.trainer}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
