"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Save, CheckCircle2, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Mock data
const courses = [
    { id: "1", title: "تعلم React من الصفر" },
    { id: "2", title: "تصميم واجهات المستخدم" },
]

const students = [
    { id: "1", name: "محمد أحمد", status: "present" },
    { id: "2", name: "سارة علي", status: "present" },
    { id: "3", name: "خالد عمر", status: "absent" },
    { id: "4", name: "ليلى حسن", status: "late" },
    { id: "5", name: "عمر يوسف", status: "present" },
]

export default function AttendancePage() {
    const [selectedCourse, setSelectedCourse] = useState(courses[0].id)
    const [date, setDate] = useState(new Date())
    const [attendanceData, setAttendanceData] = useState(students)
    const [isSaving, setIsSaving] = useState(false)

    const handleStatusChange = (studentId: string, newStatus: string) => {
        setAttendanceData(prev => prev.map(student =>
            student.id === studentId ? { ...student, status: newStatus } : student
        ))
    }

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSaving(false)
        alert("تم حفظ سجل الحضور بنجاح")
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">سجل الحضور والغياب</h1>
                    <p className="text-muted-foreground">
                        إدارة حضور الطلاب للدورات التدريبية
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border shadow-sm">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                        {format(date, "EEEE, d MMMM yyyy", { locale: ar })}
                    </span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>تسجيل الحضور</CardTitle>
                            <CardDescription>قم بتحديد الدورة وتسجيل حالة حضور الطلاب</CardDescription>
                        </div>
                        <div className="w-full md:w-64">
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الدورة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">اسم الطالب</TableHead>
                                    <TableHead className="text-center">الحالة</TableHead>
                                    <TableHead className="text-center">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={
                                                    student.status === 'present' ? 'default' :
                                                        student.status === 'absent' ? 'destructive' :
                                                            'secondary'
                                                }
                                                className={cn(
                                                    student.status === 'present' && "bg-green-500 hover:bg-green-600",
                                                    student.status === 'late' && "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                )}
                                            >
                                                {student.status === 'present' ? 'حاضر' :
                                                    student.status === 'absent' ? 'غائب' :
                                                        'متأخر'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={student.status === 'present' ? "default" : "outline"}
                                                    className={cn(student.status === 'present' && "bg-green-500 hover:bg-green-600")}
                                                    onClick={() => handleStatusChange(student.id, 'present')}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="sr-only">حاضر</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={student.status === 'absent' ? "destructive" : "outline"}
                                                    onClick={() => handleStatusChange(student.id, 'absent')}
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    <span className="sr-only">غائب</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={student.status === 'late' ? "secondary" : "outline"}
                                                    className={cn(student.status === 'late' && "bg-yellow-500 text-white hover:bg-yellow-600")}
                                                    onClick={() => handleStatusChange(student.id, 'late')}
                                                >
                                                    <Clock className="h-4 w-4" />
                                                    <span className="sr-only">متأخر</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
                            <Save className="ml-2 h-4 w-4" />
                            {isSaving ? "جاري الحفظ..." : "حفظ السجل"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
