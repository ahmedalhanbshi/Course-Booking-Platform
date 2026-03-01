"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Mail, Phone, Eye, User, BookOpen, Trash2, Loader2, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { instituteService } from "@/lib/institute-service"

interface Student {
    id: string
    name: string
    email: string
    phone: string | null
    status: string
    enrolledCourses: string[]
    trainerNames: string[]
    enrollmentStatuses: string[]
}

export default function InstituteStudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

    useEffect(() => {
        instituteService.getStudents()
            .then(setStudents)
            .catch(() => setError("فشل تحميل بيانات الطلاب"))
            .finally(() => setLoading(false))
    }, [])

    const filteredStudents = students.filter(s =>
        s.name.includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleViewDetails = (student: Student) => {
        setSelectedStudent(student)
        setIsDialogOpen(true)
    }

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        // TODO: wire up delete API
        setIsDeleteDialogOpen(false)
        setStudentToDelete(null)
    }

    // Determine a single "active" status — student is active if ANY enrollment is active
    const getStudentDisplayStatus = (student: Student) => {
        if (student.enrollmentStatuses.includes("active")) return "active"
        if (student.enrollmentStatuses.includes("completed")) return "completed"
        return "other"
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الطلاب</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">عرض وإدارة الطلاب المسجلين في المعهد</p>
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
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>نعم، حذف الطالب</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <CardTitle>قائمة الطلاب</CardTitle>
                            {!loading && (
                                <Badge variant="secondary" className="font-mono">
                                    {filteredStudents.length} طالب
                                </Badge>
                            )}
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="بحث بالاسم أو البريد..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-gray-400">
                            <Loader2 className="h-6 w-6 animate-spin ml-2" />
                            <span>جاري تحميل الطلاب...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16 text-red-500 gap-2">
                            <span>{error}</span>
                            <Button variant="outline" size="sm" onClick={() => {
                                setLoading(true); setError(null);
                                instituteService.getStudents().then(setStudents).catch(() => setError("فشل تحميل بيانات الطلاب")).finally(() => setLoading(false));
                            }}>
                                إعادة المحاولة
                            </Button>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                            <Users className="h-10 w-10" />
                            <p>{searchTerm ? "لا توجد نتائج للبحث" : "لا يوجد طلاب مسجلون حتى الآن"}</p>
                        </div>
                    ) : (
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
                                {filteredStudents.map((student) => {
                                    const displayStatus = getStudentDisplayStatus(student)
                                    // de-duplicate trainer names
                                    const uniqueTrainers = [...new Set(student.trainerNames.filter(Boolean))]

                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <p className="font-medium">{student.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3" />
                                                        {student.email}
                                                    </div>
                                                    {student.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3" />
                                                            {student.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    {uniqueTrainers.join(" / ") || "—"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {student.enrolledCourses.length} دورات
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={displayStatus === 'active' ? 'default' : 'secondary'}
                                                    className={displayStatus === 'active' ? 'bg-green-500 hover:bg-green-600' : displayStatus === 'completed' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                                                >
                                                    {displayStatus === 'active' ? 'مستمر' : displayStatus === 'completed' ? 'مكتمل' : 'غير نشط'}
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
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Student Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>تفاصيل الطالب</DialogTitle>
                        <DialogDescription>عرض المعلومات الكاملة للطالب</DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{selectedStudent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                                    <Badge
                                        variant={getStudentDisplayStatus(selectedStudent) === 'active' ? 'default' : 'secondary'}
                                        className={getStudentDisplayStatus(selectedStudent) === 'active' ? 'bg-green-500' : ''}
                                    >
                                        {getStudentDisplayStatus(selectedStudent) === 'active' ? 'مستمر' : 'غير نشط'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3 mt-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{selectedStudent.email}</span>
                                </div>
                                {selectedStudent.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{selectedStudent.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-3 text-sm">
                                    <BookOpen className="h-4 w-4 text-gray-500 mt-1" />
                                    <div>
                                        <span className="block mb-2 font-medium">الدورات المسجلة ({selectedStudent.enrolledCourses.length}):</span>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedStudent.enrolledCourses.map((course, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">{course}</Badge>
                                            ))}
                                            {selectedStudent.enrolledCourses.length === 0 && (
                                                <span className="text-gray-400">لا توجد دورات</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>المدربون: {[...new Set(selectedStudent.trainerNames.filter(Boolean))].join(" / ") || "—"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
