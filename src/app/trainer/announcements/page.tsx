"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Send, Eye, Users, MessageSquare, Clock, Paperclip, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { Announcement } from "@/types"
import { formatDate } from "@/lib/utils"

// Mock data
const mockCourses = [
  { id: "course1", title: "دورة البرمجة الأساسية" },
  { id: "course2", title: "دورة تطوير التطبيقات" },
  { id: "course3", title: "دورة إدارة المشاريع" }
]

const mockStudents = [
  { id: "s1", name: "أحمد محمد", courseId: "course1" },
  { id: "s2", name: "سارة أحمد", courseId: "course1" },
  { id: "s3", name: "خالد علي", courseId: "course1" },
  { id: "s4", name: "منى حسن", courseId: "course2" },
  { id: "s5", name: "عمر فاروق", courseId: "course2" },
]

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "تذكير بموعد الدرس القادم",
    message: "عزيزي الطلاب، تذكركم بأن الدرس القادم ستكون يوم الاثنين المقبل في تمام الساعة 10:00 صباحاً",
    targetAudience: "course_students",
    courseId: "course1",
    senderId: "trainer1",
    createdAt: new Date("2024-01-10"),
    sentAt: new Date("2024-01-10")
  },
  {
    id: "2",
    title: "تم تحديث المواد التدريبية",
    message: "تم إضافة مواد جديدة للدورة. يرجى مراجعتها قبل الدرس القادمة",
    targetAudience: "course_students",
    courseId: "course2",
    senderId: "trainer1",
    createdAt: new Date("2024-01-08"),
    sentAt: new Date("2024-01-08")
  },
  {
    id: "3",
    title: "إعلان مهم لجميع الطلاب",
    message: "سيتم تغيير جدول الدورة ابتداءً من الأسبوع القادم",
    targetAudience: "course_students",
    courseId: "course1",
    senderId: "trainer1",
    createdAt: new Date("2024-01-05"),
    scheduledAt: new Date("2024-01-15")
  }
]

export default function TrainerAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    courseId: "",
    scheduledAt: "",
    recipientType: "all", // 'all' | 'specific'
    selectedStudents: [] as string[],
    attachment: null as File | null
  })

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      courseId: "",
      scheduledAt: "",
      recipientType: "all",
      selectedStudents: [],
      attachment: null
    })
    setEditingId(null)
  }

  const handleCreateAnnouncement = () => {
    if (editingId) {
      // Update existing announcement
      setAnnouncements(prev => prev.map(a => {
        if (a.id === editingId) {
          return {
            ...a,
            title: formData.title,
            message: formData.message,
            targetAudience: formData.recipientType === 'specific' ? 'specific_students' : 'course_students',
            courseId: formData.courseId,
            scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : undefined,
            sentAt: formData.scheduledAt ? undefined : new Date() // Reset sentAt if rescheduled, or set to now if immediate
          }
        }
        return a
      }))
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        targetAudience: formData.recipientType === 'specific' ? 'specific_students' : 'course_students',
        courseId: formData.courseId,
        senderId: "trainer1",
        createdAt: new Date(),
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : undefined,
        sentAt: formData.scheduledAt ? undefined : new Date()
      }
      setAnnouncements([newAnnouncement, ...announcements])
    }

    resetForm()
    setIsCreateDialogOpen(false)
  }

  const handleEditClick = (announcement: Announcement) => {
    setEditingId(announcement.id)
    setFormData({
      title: announcement.title,
      message: announcement.message,
      courseId: announcement.courseId || "",
      scheduledAt: announcement.scheduledAt ? new Date(announcement.scheduledAt).toISOString().slice(0, 16) : "",
      recipientType: announcement.targetAudience === 'specific_students' ? 'specific' : 'all',
      selectedStudents: [], // In a real app, we'd load the selected students for this announcement
      attachment: null
    })
    setIsCreateDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setAnnouncementToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (announcementToDelete) {
      setAnnouncements(prev => prev.filter(a => a.id !== announcementToDelete))
      setAnnouncementToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const getCourseTitle = (courseId: string) => {
    return mockCourses.find(c => c.id === courseId)?.title || "دورة غير محددة"
  }

  const getCourseStudents = (courseId: string) => {
    return mockStudents.filter(s => s.courseId === courseId)
  }

  const toggleStudentSelection = (studentId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedStudents.includes(studentId)
      return {
        ...prev,
        selectedStudents: isSelected
          ? prev.selectedStudents.filter(id => id !== studentId)
          : [...prev.selectedStudents, studentId]
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعلانات والتواصل</h1>
          <p className="text-gray-600 mt-2">إرسال إعلانات وتواصل مع طلاب دوراتك</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إعلان جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "تعديل الإعلان" : "إنشاء إعلان جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الإعلان</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان الإعلان"
                />
              </div>

              <div>
                <Label htmlFor="course">الدورة</Label>
                <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value, selectedStudents: [] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدورة" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.courseId && (
                <div className="space-y-2">
                  <Label>المستلمون</Label>
                  <RadioGroup
                    value={formData.recipientType}
                    onValueChange={(value) => setFormData({ ...formData, recipientType: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="all" id="r1" />
                      <Label htmlFor="r1">جميع طلاب الدورة</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="specific" id="r2" />
                      <Label htmlFor="r2">طلاب محددين</Label>
                    </div>
                  </RadioGroup>

                  {formData.recipientType === 'specific' && (
                    <div className="border rounded-md p-3 mt-2 max-h-40 overflow-y-auto space-y-2">
                      {getCourseStudents(formData.courseId).length > 0 ? (
                        getCourseStudents(formData.courseId).map(student => (
                          <div key={student.id} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id={`student-${student.id}`}
                              checked={formData.selectedStudents.includes(student.id)}
                              onCheckedChange={() => toggleStudentSelection(student.id)}
                            />
                            <Label htmlFor={`student-${student.id}`} className="text-sm font-normal cursor-pointer">
                              {student.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">لا يوجد طلاب في هذه الدورة</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="message">نص الإعلان</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب نص الإعلان..."
                  rows={4}
                />
              </div>



              <div>
                <Label htmlFor="scheduledAt">جدولة الإرسال (اختياري)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateAnnouncement} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {editingId ? "تحديث الإعلان" : "إرسال الإعلان"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإعلانات</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">إعلانات مرسلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإعلانات المرسلة</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(a => a.sentAt).length}
            </div>
            <p className="text-xs text-muted-foreground">تم الإرسال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجدولة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(a => a.scheduledAt && !a.sentAt).length}
            </div>
            <p className="text-xs text-muted-foreground">في انتظار الإرسال</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الإعلانات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الإعلان</TableHead>
                <TableHead>الدورة</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>حالة الإرسال</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{announcement.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{announcement.message}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCourseTitle(announcement.courseId || "")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(announcement.createdAt)}
                  </TableCell>
                  <TableCell>
                    {announcement.sentAt ? (
                      <Badge className="bg-green-100 text-green-800">مرسل</Badge>
                    ) : announcement.scheduledAt ? (
                      <Badge className="bg-blue-100 text-blue-800">مجدول</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">مسودة</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(announcement)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(announcement.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}