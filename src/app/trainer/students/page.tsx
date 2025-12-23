"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Mail, Phone, Calendar, BookOpen, MessageSquare, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"

// Mock students data
const students = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    avatar: null,
    enrolledCourses: [
      {
        courseId: "1",
        courseTitle: "تعلم React من الصفر",
        enrollmentDate: new Date("2025-01-15"),
        progress: 75,
        status: 'active' as const,
        rating: 5,
      },
      {
        courseId: "2",
        courseTitle: "تصميم واجهات المستخدم",
        enrollmentDate: new Date("2025-01-20"),
        progress: 45,
        status: 'active' as const,
        rating: null,
      }
    ],
    totalCourses: 2,
    lastActivity: new Date("2025-01-22"),
  },
  {
    id: "2",
    name: "سارة أحمد",
    email: "sara@example.com",
    phone: "+966507654321",
    avatar: null,
    enrolledCourses: [
      {
        courseId: "1",
        courseTitle: "تعلم React من الصفر",
        enrollmentDate: new Date("2025-01-10"),
        progress: 90,
        status: 'active' as const,
        rating: 4,
      }
    ],
    totalCourses: 1,
    lastActivity: new Date("2025-01-21"),
  },
  {
    id: "3",
    name: "محمد علي",
    email: "mohamed@example.com",
    phone: "+966509876543",
    avatar: null,
    enrolledCourses: [
      {
        courseId: "3",
        courseTitle: "إدارة المشاريع الرقمية",
        enrollmentDate: new Date("2024-12-15"),
        progress: 100,
        status: 'completed' as const,
        rating: 5,
      }
    ],
    totalCourses: 1,
    lastActivity: new Date("2025-01-15"),
  },
  {
    id: "4",
    name: "فاطمة حسن",
    email: "fatima.h@example.com",
    phone: "+966502468135",
    avatar: null,
    enrolledCourses: [
      {
        courseId: "2",
        courseTitle: "تصميم واجهات المستخدم",
        enrollmentDate: new Date("2025-01-05"),
        progress: 30,
        status: 'active' as const,
        rating: null,
      }
    ],
    totalCourses: 1,
    lastActivity: new Date("2025-01-20"),
  },
]

export default function TrainerStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Get unique courses for filter
  const courses = Array.from(new Set(students.flatMap(student =>
    student.enrolledCourses.map(ec => ec.courseTitle)
  )))

  // Filter and sort students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCourse = courseFilter === "all" ||
      student.enrolledCourses.some(ec => ec.courseTitle === courseFilter)

    return matchesSearch && matchesCourse
  })

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "courses":
        return b.totalCourses - a.totalCourses
      case "lastActivity":
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      default:
        return 0
    }
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-blue-600'
    if (progress >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلاب</h1>
        <p className="text-gray-600">
          متابعة وإدارة جميع الطلاب المسجلين في دوراتك التدريبية
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي التسجيلات</p>
                <p className="text-2xl font-bold">
                  {students.reduce((acc, student) => acc + student.totalCourses, 0)}
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
                placeholder="البحث في الطلاب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الدورة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الدورات</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>الطلاب ({sortedStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الطالب</TableHead>
                <TableHead>الدورات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar || undefined} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {student.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {student.enrolledCourses.slice(0, 2).map((course) => (
                        <div key={course.courseId} className="text-sm">
                          <div className="font-medium line-clamp-1">{course.courseTitle}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                             {/* Progress and Rating Removed */}
                          </div>
                        </div>
                      ))}
                      {student.enrolledCourses.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{student.enrolledCourses.length - 2} دورة أخرى
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          إرسال رسالة
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/trainer/courses/${student.enrolledCourses[0]?.courseId}/students`}>
                            عرض التفاصيل
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sortedStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا يوجد طلاب
              </h3>
              <p className="text-gray-500">
                لم يتم العثور على طلاب مطابقين لمعايير البحث
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}