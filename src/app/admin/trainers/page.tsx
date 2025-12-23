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
import { Eye, CheckCircle, XCircle, UserCheck, BookOpen, Trash2, Edit, AlertTriangle, Users } from "lucide-react"
import { User } from "@/types"
import { formatDate } from "@/lib/utils"
import { AdminPageHeader } from "@/components/admin/page-header"

// Mock data
const mockTrainers: User[] = [
  {
    id: "trainer1",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "0501234567",
    role: "trainer",
    status: "approved",
    avatar: "/avatars/fatima.jpg",
    createdAt: new Date("2023-01-15"),
    trainerProfile: {
      id: "tp1",
      userId: "trainer1",
      bio: "مدربة متخصصة في تطوير الويب",
      specialties: ["React", "Node.js", "TypeScript"],
      rating: 4.5
    }
  },
  {
    id: "trainer2",
    name: "محمد أحمد",
    email: "mohamed@example.com",
    phone: "0507654321",
    role: "trainer",
    status: "pending",
    avatar: "/avatars/mohamed.jpg",
    createdAt: new Date("2023-03-20"),
    trainerProfile: {
      id: "tp2",
      userId: "trainer2",
      bio: "خبير في الذكاء الاصطناعي",
      specialties: ["Python", "Machine Learning", "AI"],
      rating: 4.8
    }
  },
  {
    id: "trainer3",
    name: "سارة خالد",
    email: "sara@example.com",
    phone: "0509876543",
    role: "trainer",
    status: "suspended",
    avatar: "/avatars/sara.jpg",
    createdAt: new Date("2023-06-10"),
    trainerProfile: {
      id: "tp3",
      userId: "trainer3",
      bio: "مدربة تصميم جرافيك",
      specialties: ["Photoshop", "Illustrator", "UI/UX"],
      rating: 4.2
    }
  },
  {
    id: "trainer4",
    name: "أحمد حسن",
    email: "ahmed.h@example.com",
    phone: "0501122334",
    role: "trainer",
    status: "rejected",
    avatar: "/avatars/ahmed.jpg",
    createdAt: new Date("2023-09-05"),
    trainerProfile: {
      id: "tp4",
      userId: "trainer4",
      bio: "خبير أمن سيبراني",
      specialties: ["Cyber Security", "Network Security"],
      rating: 4.6
    }
  }
]

const mockTrainerStats = [
  { id: "trainer1", coursesCount: 3, studentsCount: 45, averageRating: 4.5 },
  { id: "trainer2", coursesCount: 2, studentsCount: 32, averageRating: 4.8 },
  { id: "trainer3", coursesCount: 1, studentsCount: 18, averageRating: 4.2 },
  { id: "trainer4", coursesCount: 4, studentsCount: 67, averageRating: 4.6 }
]

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<User[]>(mockTrainers)
  const [selectedTrainer, setSelectedTrainer] = useState<User | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'view' | 'suspend' | 'activate' | 'delete' | 'edit' | 'approve' | 'reject' | null }>({
    open: false,
    type: null
  })
  const [deleteReason, setDeleteReason] = useState("")
  const [actionReason, setActionReason] = useState("")
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    specialties: "",
    status: "active",
    avatar: "",
    password: ""
  })

  // Handlers
  const handleViewTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setActionDialog({ open: true, type: 'view' })
  }

  const handleSuspendTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setActionReason("")
    setActionDialog({ open: true, type: 'suspend' })
  }

  const handleActivateTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setActionDialog({ open: true, type: 'activate' })
  }

  const handleApproveTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setActionDialog({ open: true, type: 'approve' })
  }

  const handleRejectTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setActionReason("")
    setActionDialog({ open: true, type: 'reject' })
  }

  const handleDeleteTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setDeleteReason("")
    setActionDialog({ open: true, type: 'delete' })
  }

  const handleEditTrainer = (trainer: User) => {
    setSelectedTrainer(trainer)
    setEditForm({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone || "",
      bio: trainer.trainerProfile?.bio || "",
      specialties: trainer.trainerProfile?.specialties.join(", ") || "",
      status: trainer.status || "active",
      avatar: trainer.avatar || "",
      password: ""
    })
    setActionDialog({ open: true, type: 'edit' })
  }

  const executeAction = () => {
    if (!selectedTrainer) return

    if (actionDialog.type === 'delete') {
      console.log(`Deleting trainer ${selectedTrainer.id} with reason: ${deleteReason}`)
      setTrainers(trainers.filter(t => t.id !== selectedTrainer.id))
    } else if (actionDialog.type === 'edit') {
      setTrainers(trainers.map(t => {
        if (t.id === selectedTrainer.id) {
          return {
            ...t,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            status: editForm.status as any,
            avatar: editForm.avatar,
            trainerProfile: t.trainerProfile ? {
              ...t.trainerProfile,
              bio: editForm.bio,
              specialties: editForm.specialties.split(",").map(s => s.trim()).filter(Boolean)
            } : undefined
          }
        }
        return t
      }))
    } else if (actionDialog.type === 'suspend') {
      console.log(`Suspending trainer ${selectedTrainer.id} with reason: ${actionReason}`)
      setTrainers(trainers.map(t => t.id === selectedTrainer.id ? { ...t, status: 'suspended' } : t))
    } else if (actionDialog.type === 'activate' || actionDialog.type === 'approve') {
      setTrainers(trainers.map(t => t.id === selectedTrainer.id ? { ...t, status: 'approved' } : t))
    } else if (actionDialog.type === 'reject') {
      console.log(`Rejecting trainer ${selectedTrainer.id} with reason: ${actionReason}`)
      setTrainers(trainers.map(t => t.id === selectedTrainer.id ? { ...t, status: 'rejected' } : t))
    }

    setActionDialog({ open: false, type: null })
    setSelectedTrainer(null)
  }

  const getTrainerStats = (trainerId: string) => {
    return mockTrainerStats.find(stat => stat.id === trainerId) || {
      coursesCount: 0,
      studentsCount: 0,
      averageRating: 0
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">معتمد</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد المراجعة</Badge>
      case 'rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مرفوض</Badge>
      case 'suspended': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">معلق</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة المدربين"
        description="مراجعة واعتماد طلبات المدربين الجدد وإدارة الحسابات الحالية"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدربين</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
            <p className="text-xs text-muted-foreground">مدرب مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainers.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">في انتظار الاعتماد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدورات</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTrainerStats.reduce((sum, stat) => sum + stat.coursesCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">دورة تدريبية</p>
          </CardContent>
        </Card>
      </div>

      {/* Trainers Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المدربين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المدرب</TableHead>
                <TableHead>الدورات</TableHead>
                <TableHead>الطلاب</TableHead>
                <TableHead>تاريخ الانضمام</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => {
                const stats = getTrainerStats(trainer.id)
                return (
                  <TableRow key={trainer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {trainer.avatar && (
                          <img
                            src={trainer.avatar}
                            alt={trainer.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{trainer.name}</div>
                          <div className="text-sm text-gray-500">{trainer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {stats.coursesCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {stats.studentsCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(trainer.createdAt)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(trainer.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewTrainer(trainer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditTrainer(trainer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {/* Verification Workflow Actions */}
                        {trainer.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveTrainer(trainer)}
                              className="bg-green-600 hover:bg-green-700 h-8"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              اعتماد
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectTrainer(trainer)}
                              className="h-8"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        
                        {trainer.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspendTrainer(trainer)}
                            className="border-orange-300 text-orange-600 hover:bg-orange-50 h-8"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            تعليق
                          </Button>
                        )}

                        {trainer.status === 'suspended' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateTrainer(trainer)}
                            className="border-green-300 text-green-600 hover:bg-green-50 h-8"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            تفعيل
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTrainer(trainer)}
                          className="border-red-300 text-red-600 hover:bg-red-50 h-8"
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

      {/* Trainer Details Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'view'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل المدرب</DialogTitle>
          </DialogHeader>
          {selectedTrainer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedTrainer.avatar ? (
                    <img src={selectedTrainer.avatar} alt={selectedTrainer.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTrainer.name}</h3>
                  <p className="text-gray-600">{selectedTrainer.email}</p>
                  <p className="text-sm text-gray-500">
                    انضم في {formatDate(selectedTrainer.createdAt)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(selectedTrainer.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {getTrainerStats(selectedTrainer.id).coursesCount}
                      </div>
                      <div className="text-sm text-gray-600">دورة تدريبية</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getTrainerStats(selectedTrainer.id).studentsCount}
                      </div>
                      <div className="text-sm text-gray-600">طالب</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getTrainerStats(selectedTrainer.id).averageRating}
                      </div>
                      <div className="text-sm text-gray-600">متوسط التقييم</div>
                    </div>
                  </CardContent>
                </Card>
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
            <DialogTitle>تعليق المدرب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTrainer && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>هل أنت متأكد من تعليق حساب المدرب <strong>{selectedTrainer.name}</strong>؟</p>
                <p className="text-sm text-gray-600 mt-2">سيتم إيقاف جميع دوراته ومنع الوصول إلى النظام.</p>
              </div>
            )}
            <div>
              <Label htmlFor="suspend-reason">سبب التعليق</Label>
              <Textarea
                id="suspend-reason"
                placeholder="اكتب سبب تعليق الحساب..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
              <Button onClick={executeAction} className="bg-red-600 hover:bg-red-700">
                تعليق الحساب
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'approve'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>اعتماد المدرب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             {selectedTrainer && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">هل ترغب في اعتماد حساب المدرب <strong>{selectedTrainer.name}</strong>؟</p>
                <p className="text-sm text-green-600 mt-2">سيتم تفعيل الحساب وتمكينه من إضافة الدورات.</p>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
              <Button onClick={executeAction} className="bg-green-600 hover:bg-green-700">
                تأكيد الاعتماد
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

       {/* Reject Dialog */}
       <Dialog open={actionDialog.open && actionDialog.type === 'reject'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>رفض المدرب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             {selectedTrainer && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-800">هل أنت متأكد من رفض طلب انضمام المدرب <strong>{selectedTrainer.name}</strong>؟</p>
              </div>
            )}
             <div>
              <Label htmlFor="reject-reason">سبب الرفض</Label>
              <Textarea
                id="reject-reason"
                placeholder="اكتب سبب الرفض..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                إلغاء
              </Button>
              <Button onClick={executeAction} variant="destructive">
                تأكيد الرفض
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>


      {/* Delete Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'delete'} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف المدرب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTrainer && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                   <p className="text-red-600 font-medium">هل أنت متأكد من حذف حساب المدرب <strong>{selectedTrainer.name}</strong>؟</p>
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
            <DialogTitle>تعديل بيانات المدرب</DialogTitle>
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
              <Label htmlFor="edit-bio">النبذة التعريفية</Label>
              <Textarea
                id="edit-bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-specialties">التخصصات (مفصولة بفاصلة)</Label>
              <Input
                id="edit-specialties"
                value={editForm.specialties}
                onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value })}
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
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="approved">معتمد</SelectItem>
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