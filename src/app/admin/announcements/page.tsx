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
import { Bell, Megaphone, Users, Calendar, Send, Trash2, Edit, Paperclip, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AdminPageHeader } from "@/components/admin/page-header"
import { format } from "date-fns"

// Mock data
interface Announcement {
  id: string
  title: string
  content: string
  targetAudience: 'all' | 'students' | 'trainers' | 'institutes'
  category: 'general' | 'event' | 'maintenance' | 'urgent'
  status: 'draft' | 'scheduled' | 'sent'
  scheduledDate?: Date
  sentDate?: Date
  attachment?: string
  createdAt: Date
}

const mockAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "صيانة مجدولة للمنصة",
    content: "ستتوقف المنصة للصيانة يوم الجمعة القادم من الساعة 2 صباحاً حتى 6 صباحاً",
    targetAudience: "all",
    category: "maintenance",
    status: "scheduled",
    scheduledDate: new Date("2024-02-01T02:00:00"),
    createdAt: new Date("2024-01-28")
  },
  {
    id: "ann2",
    title: "تحديث سياسة الخصوصية",
    content: "تم تحديث سياسة الخصوصية، يرجى الاطلاع عليها",
    targetAudience: "all",
    category: "general",
    status: "sent",
    sentDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-15")
  },
  {
    id: "ann3",
    title: "تهنئة للمدربين المتميزين",
    content: "نبارك للمدربين الحاصلين على أعلى تقييم هذا الشهر",
    targetAudience: "trainers",
    category: "event",
    status: "draft",
    createdAt: new Date("2024-01-20")
  }
]

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'delete' | 'edit' | null }>({
    open: false,
    type: null
  })
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    category: "general",
    status: "draft",
    scheduledDate: "",
    scheduledTime: "",
    attachment: ""
  })
  const [newAnnouncement, setNewAnnouncement] = useState<{
    title: string
    content: string
    targetAudience: string
    category: string
    status: string
    scheduledDate: string
    scheduledTime: string
    attachment: string
  }>({
    title: "",
    content: "",
    targetAudience: 'all',
    category: 'general',
    status: 'draft',
    scheduledDate: "",
    scheduledTime: "",
    attachment: ""
  })

  const handleCreateAnnouncement = () => {
    let scheduledDate: Date | undefined = undefined;
    if (newAnnouncement.scheduledDate) {
      scheduledDate = new Date(newAnnouncement.scheduledDate);
      if (newAnnouncement.scheduledTime) {
        const [hours, minutes] = newAnnouncement.scheduledTime.split(':').map(Number);
        scheduledDate.setHours(hours, minutes);
      }
    }

    const announcement: Announcement = {
      id: `ann${announcements.length + 1}`,
      title: newAnnouncement.title || "",
      content: newAnnouncement.content || "",
      targetAudience: newAnnouncement.targetAudience as any,
      category: newAnnouncement.category as any,
      status: (scheduledDate ? 'scheduled' : 'draft') as any,
      scheduledDate: scheduledDate,
      attachment: newAnnouncement.attachment,
      createdAt: new Date()
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({
      title: "",
      content: "",
      targetAudience: 'all',
      category: 'general',
      status: 'draft',
      scheduledDate: "",
      scheduledTime: "",
      attachment: ""
    })
  }

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setActionDialog({ open: true, type: 'delete' })
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setEditForm({
      title: announcement.title,
      content: announcement.content,
      targetAudience: announcement.targetAudience,
      category: announcement.category,
      status: announcement.status,
      scheduledDate: announcement.scheduledDate ? format(announcement.scheduledDate, "yyyy-MM-dd") : "",
      scheduledTime: announcement.scheduledDate ? format(announcement.scheduledDate, "HH:mm") : "",
      attachment: announcement.attachment || ""
    })
    setActionDialog({ open: true, type: 'edit' })
  }

  const executeAction = () => {
    if (!selectedAnnouncement) return

    if (actionDialog.type === 'delete') {
      setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id))
    } else if (actionDialog.type === 'edit') {
      setAnnouncements(announcements.map(a => {
        if (a.id === selectedAnnouncement.id) {
          let scheduledDate: Date | undefined = undefined;
          if (editForm.scheduledDate) {
            scheduledDate = new Date(editForm.scheduledDate);
            if (editForm.scheduledTime) {
              const [hours, minutes] = editForm.scheduledTime.split(':').map(Number);
              scheduledDate.setHours(hours, minutes);
            }
          }

          return {
            ...a,
            title: editForm.title,
            content: editForm.content,
            targetAudience: editForm.targetAudience as any,
            category: editForm.category as any,
            status: editForm.status as any,
            scheduledDate: scheduledDate,
            attachment: editForm.attachment
          }
        }
        return a
      }))
    }

    setActionDialog({ open: false, type: null })
    setSelectedAnnouncement(null)
  }

  const getCategoryBadge = (category: Announcement['category']) => {
    switch (category) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">عاجل</Badge>
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800">صيانة</Badge>
      case 'event':
        return <Badge className="bg-blue-100 text-blue-800">فعالية</Badge>
      default:
        return <Badge variant="secondary">عام</Badge>
    }
  }

  const getStatusBadge = (status: Announcement['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">تم الإرسال</Badge>
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800">مجدول</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">مسودة</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAudienceLabel = (audience: Announcement['targetAudience']) => {
    switch (audience) {
      case 'all': return 'الجميع'
      case 'students': return 'الطلاب'
      case 'trainers': return 'المدربين'
      case 'institutes': return 'المعاهد'
      default: return audience
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="الإعلانات والتنبيهات"
        description="إدارة الإعلانات والتنبيهات لجميع مستخدمي المنصة"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Announcement Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              إعلان جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الإعلان</Label>
                <Input
                  id="title"
                  placeholder="أدخل عنوان الإعلان"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="audience">الجمهور المستهدف</Label>
                <Select
                  value={newAnnouncement.targetAudience}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجمهور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الجميع</SelectItem>
                    <SelectItem value="students">الطلاب</SelectItem>
                    <SelectItem value="trainers">المدربين</SelectItem>
                    <SelectItem value="institutes">المعاهد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">نوع الإعلان</Label>
                <Select
                  value={newAnnouncement.category}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="event">فعالية</SelectItem>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="scheduledDate">تاريخ النشر</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={newAnnouncement.scheduledDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scheduledDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">وقت النشر</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={newAnnouncement.scheduledTime}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scheduledTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="attachment">مرفق (اختياري)</Label>
                <Input
                  id="attachment"
                  type="file"
                  onChange={(e) => {
                    // In a real app, handle file upload here
                    if (e.target.files && e.target.files[0]) {
                      setNewAnnouncement({ ...newAnnouncement, attachment: e.target.files[0].name })
                    }
                  }}
                />
              </div>

              <div>
                <Label htmlFor="content">نص الإعلان</Label>
                <Textarea
                  id="content"
                  placeholder="اكتب نص الإعلان هنا..."
                  className="h-32"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button className="w-full" onClick={handleCreateAnnouncement}>
                  <Send className="h-4 w-4 ml-2" />
                  نشر الإعلان
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>سجل الإعلانات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الإعلان</TableHead>
                  <TableHead>الجمهور</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {announcement.title}
                          {announcement.attachment && <Paperclip className="h-3 w-3 text-gray-400" />}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {announcement.content}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        {getAudienceLabel(announcement.targetAudience)}
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(announcement.category)}</TableCell>
                    <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          {formatDate(announcement.createdAt)}
                        </div>
                        {announcement.scheduledDate && (
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Clock className="h-3 w-3" />
                            {format(announcement.scheduledDate, "dd/MM HH:mm")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditAnnouncement(announcement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAnnouncement(announcement)}
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
      </div>

      {/* Delete Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'delete'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف الإعلان</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAnnouncement && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-red-600">هل أنت متأكد من حذف الإعلان <strong>{selectedAnnouncement.title}</strong>؟</p>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الإعلان</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">عنوان الإعلان</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-audience">الجمهور المستهدف</Label>
              <Select
                value={editForm.targetAudience}
                onValueChange={(value) => setEditForm({ ...editForm, targetAudience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجمهور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الجميع</SelectItem>
                  <SelectItem value="students">الطلاب</SelectItem>
                  <SelectItem value="trainers">المدربين</SelectItem>
                  <SelectItem value="institutes">المعاهد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-category">نوع الإعلان</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">عام</SelectItem>
                  <SelectItem value="event">فعالية</SelectItem>
                  <SelectItem value="maintenance">صيانة</SelectItem>
                  <SelectItem value="urgent">عاجل</SelectItem>
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
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="scheduled">مجدول</SelectItem>
                  <SelectItem value="sent">تم الإرسال</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit-scheduledDate">تاريخ النشر</Label>
                <Input
                  id="edit-scheduledDate"
                  type="date"
                  value={editForm.scheduledDate}
                  onChange={(e) => setEditForm({ ...editForm, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-scheduledTime">وقت النشر</Label>
                <Input
                  id="edit-scheduledTime"
                  type="time"
                  value={editForm.scheduledTime}
                  onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-attachment">مرفق (اختياري)</Label>
              <Input
                id="edit-attachment"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEditForm({ ...editForm, attachment: e.target.files[0].name })
                  }
                }}
              />
              {editForm.attachment && (
                <p className="text-xs text-gray-500 mt-1">الملف الحالي: {editForm.attachment}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-content">نص الإعلان</Label>
              <Textarea
                id="edit-content"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              />
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