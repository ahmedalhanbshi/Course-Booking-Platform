"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Mail, Phone, BookOpen, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { trainerService } from "@/lib/trainer-service"
import { toast } from "sonner"

type EnrolledCourse = {
  courseId: string
  courseTitle: string
  enrollmentId: string
  status: string
  enrolledAt: string
}

type Student = {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  enrolledCourses: EnrolledCourse[]
  totalCourses: number
  lastActivity: string
}

type StudentsData = {
  students: Student[]
  totalStudents: number
  totalEnrollments: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "نشط", variant: "default" },
  completed: { label: "مكتمل", variant: "outline" },
  preliminary: { label: "أولي", variant: "secondary" },
  pending_payment: { label: "بانتظار الدفع", variant: "secondary" },
  cancelled: { label: "ملغي", variant: "destructive" },
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function TrainerStudentsPage() {
  const [data, setData] = useState<StudentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    const load = async () => {
      try {
        const result = await trainerService.getAllStudents()
        setData(result)
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "فشل في تحميل بيانات الطلاب")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Build unique course list for filter dropdown
  const courses = useMemo(() => {
    if (!data) return []
    const seen = new Set<string>()
    const list: { id: string; title: string }[] = []
    for (const s of data.students) {
      for (const ec of s.enrolledCourses) {
        if (!seen.has(ec.courseId)) {
          seen.add(ec.courseId)
          list.push({ id: ec.courseId, title: ec.courseTitle })
        }
      }
    }
    return list
  }, [data])

  const filteredStudents = useMemo(() => {
    if (!data) return []
    return data.students.filter(s => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      const matchesCourse = courseFilter === "all" ||
        s.enrolledCourses.some(ec => ec.courseId === courseFilter)
      return matchesSearch && matchesCourse
    })
  }, [data, searchQuery, courseFilter])

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "ar")
      if (sortBy === "courses") return b.totalCourses - a.totalCourses
      if (sortBy === "lastActivity")
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      return 0
    })
  }, [filteredStudents, sortBy])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلاب</h1>
        <p className="text-gray-600">متابعة وإدارة جميع الطلاب المسجلين في دوراتك التدريبية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold">{data?.totalStudents ?? 0}</p>
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
                <p className="text-2xl font-bold">{data?.totalEnrollments ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
        <div className="relative flex-1 min-w-[260px] max-w-[520px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="البحث بالاسم أو البريد..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-11 rounded-full bg-white pr-4 pl-10 text-sm text-right"
          />
        </div>

        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="تصفية حسب الدورة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الدورات</SelectItem>
            {courses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="الترتيب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">الاسم</SelectItem>
            <SelectItem value="courses">عدد الدورات</SelectItem>
            <SelectItem value="lastActivity">آخر نشاط</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>الطلاب ({sortedStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {data?.totalStudents === 0 ? "لا يوجد طلاب مسجلون حتى الآن" : "لا يوجد طلاب مطابقون للبحث"}
              </h3>
              <p className="text-gray-500">
                {data?.totalStudents === 0
                  ? "سيظهر الطلاب هنا بمجرد تسجيلهم في إحدى دوراتك"
                  : "جرّب تغيير معايير البحث أو التصفية"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الطالب</TableHead>
                  <TableHead className="text-right">الدورات المسجلة</TableHead>
                  <TableHead className="text-right">آخر نشاط</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map(student => (
                  <TableRow key={student.id}>
                    {/* Student info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={student.avatar ? `${API_URL}${student.avatar}` : undefined}
                            alt={student.name}
                          />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </div>
                          {student.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Enrolled courses */}
                    <TableCell>
                      <div className="space-y-1">
                        {student.enrolledCourses.slice(0, 2).map(ec => {
                          const s = statusBadge[ec.status] ?? { label: ec.status, variant: "secondary" as const }
                          return (
                            <div key={ec.enrollmentId} className="text-sm">
                              <span className="font-medium line-clamp-1">{ec.courseTitle}</span>
                              <Badge variant={s.variant} className="mr-2 text-xs mt-0.5">{s.label}</Badge>
                            </div>
                          )
                        })}
                        {student.enrolledCourses.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{student.enrolledCourses.length - 2} دورة أخرى
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Last activity */}
                    <TableCell className="text-sm text-gray-500">
                      {new Date(student.lastActivity).toLocaleDateString("ar-SA", {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {student.enrolledCourses[0] && (
                            <DropdownMenuItem asChild>
                              <Link href={`/trainer/courses/${student.enrolledCourses[0].courseId}/students`}>
                                عرض في الدورة
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
