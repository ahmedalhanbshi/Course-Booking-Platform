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
import { Eye, CheckCircle, XCircle, Building, Clock, Trash2, Edit } from "lucide-react"
import { Institute } from "@/types"
import { formatDate } from "@/lib/utils"
import { AdminPageHeader } from "@/components/admin/page-header"

// Mock data
const mockInstitutes: Institute[] = [
  {
    id: "inst1",
    name: "معهد الرياض للتدريب",
    description: "معهد متخصص في التدريب المهني والتقني",
    email: "info@riyadh-institute.com",
    phone: "+966501234567",
    address: "الرياض، المملكة العربية السعودية",
    logo: "/logos/inst1.jpg",
    website: "https://riyadh-institute.com",
    status: "approved",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15")
  },
  {
    id: "inst2",
    name: "أكاديمية جدة التقنية",
    description: "أكاديمية متخصصة في البرمجة والتطوير",
    email: "contact@jeddah-tech.com",
    phone: "+966507654321",
    address: "جدة، المملكة العربية السعودية",
    logo: "/logos/inst2.jpg",
    website: "https://jeddah-tech.com",
    status: "pending",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "inst3",
    name: "مركز الدمام التعليمي",
    description: "مركز تعليمي شامل للدورات التدريبية",
    email: "info@dammam-center.com",
    phone: "+966509876543",
    address: "الدمام، المملكة العربية السعودية",
    logo: "/logos/inst3.jpg",
    website: "https://dammam-center.com",
    status: "suspended",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-20")
  }
]

export default function AdminInstitutes() {
  const [institutes, setInstitutes] = useState<Institute[]>(mockInstitutes)
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'suspend' | 'reactivate' | 'delete' | 'edit' | null }>({
    open: false,
    type: null
  })
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    website: "",
    logo: "",
    status: "pending",
    password: ""
  })

  const handleApproveInstitute = (institute: Institute) => {
    setSelectedInstitute(institute)
    setActionDialog({ open: true, type: 'approve' })
  }

  const handleSuspendInstitute = (institute: Institute) => {
    setSelectedInstitute(institute)
    setActionDialog({ open: true, type: 'suspend' })
  }

  const handleReactivateInstitute = (institute: Institute) => {
    setSelectedInstitute(institute)
    setActionDialog({ open: true, type: 'reactivate' })
  }

  const handleDeleteInstitute = (institute: Institute) => {
    setSelectedInstitute(institute)
    setActionDialog({ open: true, type: 'delete' })
  }

  const handleEditInstitute = (institute: Institute) => {
    setSelectedInstitute(institute)
    setEditForm({
      name: institute.name,
      email: institute.email,
      phone: institute.phone || "",
      description: institute.description || "",
      address: institute.address || "",
      website: institute.website || "",
      logo: institute.logo || "",
      status: institute.status,
      password: ""
    })
    setActionDialog({ open: true, type: 'edit' })
  }

  const executeAction = () => {
    if (!selectedInstitute) return

    if (actionDialog.type === 'delete') {
      setInstitutes(institutes.filter(inst => inst.id !== selectedInstitute.id))
    } else if (actionDialog.type === 'edit') {
      setInstitutes(institutes.map(inst =>
        inst.id === selectedInstitute.id ? {
          ...inst,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          description: editForm.description,
          address: editForm.address,
          website: editForm.website,
          logo: editForm.logo,
          status: editForm.status as any
          // Password handled by API
        } : inst
      ))
    } else {
      let newStatus: Institute['status']
      switch (actionDialog.type) {
        case 'approve':
          newStatus = 'approved'
          break
        case 'suspend':
          newStatus = 'suspended'
          break
        case 'reactivate':
          newStatus = 'approved'
          break
        default:
          return
      }

      setInstitutes(institutes.map(inst =>
        inst.id === selectedInstitute.id ? { ...inst, status: newStatus } : inst
      ))
    }

    setActionDialog({ open: false, type: null })
    setSelectedInstitute(null)
  }

  const getStatusBadge = (status: Institute['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">معتمد</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">معلق</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة المعاهد"
        description="مراجعة وإدارة المعاهد المسجلة في المنصة"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعاهد</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutes.length}</div>
            <p className="text-xs text-muted-foreground">معاهد مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معاهد معتمدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {institutes.filter(inst => inst.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">معاهد نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {institutes.filter(inst => inst.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">طلبات جديدة</p>
          </CardContent>
        </Card>
      </div>

      {/* Institutes Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المعاهد</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المعاهد</TableHead>
                <TableHead>الموقع</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutes.map((institute) => (
                <TableRow key={institute.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {institute.logo && (
                        <img
                          src={institute.logo}
                          alt={institute.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{institute.name}</div>
                        <div className="text-sm text-gray-500">{institute.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{institute.address}</div>
                  </TableCell>
                  <TableCell>
                    {formatDate(institute.createdAt)}
                  </TableCell>
                  <TableCell>{getStatusBadge(institute.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditInstitute(institute)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {institute.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveInstitute(institute)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          اعتماد
                        </Button>
                      )}
                      {institute.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendInstitute(institute)}
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          تعليق
                        </Button>
                      )}
                      {institute.status === 'suspended' && (
                        <Button
                          size="sm"
                          onClick={() => handleReactivateInstitute(institute)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          إعادة تفعيل
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInstitute(institute)}
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

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' && 'اعتماد المعهد'}
              {actionDialog.type === 'suspend' && 'تعليق المعهد'}
              {actionDialog.type === 'reactivate' && 'إعادة تفعيل المعهد'}
              {actionDialog.type === 'delete' && 'حذف المعهد'}
              {actionDialog.type === 'edit' && 'تعديل بيانات المعهد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedInstitute && actionDialog.type !== 'edit' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">تفاصيل المعهد:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>الاسم:</strong> {selectedInstitute.name}</p>
                  <p><strong>البريد:</strong> {selectedInstitute.email}</p>
                  <p><strong>الهاتف:</strong> {selectedInstitute.phone}</p>
                </div>
              </div>
            )}

            {actionDialog.type === 'suspend' && (
              <div>
                <Label htmlFor="suspend-reason">سبب التعليق</Label>
                <Textarea
                  id="suspend-reason"
                  placeholder="اكتب سبب تعليق المعهد..."
                />
              </div>
            )}

            {actionDialog.type === 'delete' && (
              <div className="text-red-600 text-sm">
                هل أنت متأكد من حذف هذا المعهد؟ لا يمكن التراجع عن هذا الإجراء.
              </div>
            )}

            {actionDialog.type === 'edit' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">اسم المعهد</Label>
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
                  <Label htmlFor="edit-logo">رابط الشعار</Label>
                  <Input
                    id="edit-logo"
                    value={editForm.logo}
                    onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                    placeholder="https://example.com/logo.jpg"
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
                  <Label htmlFor="edit-description">الوصف</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-address">العنوان</Label>
                  <Input
                    id="edit-address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-website">الموقع الإلكتروني</Label>
                  <Input
                    id="edit-website"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
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
                      <SelectItem value="approved">معتمد</SelectItem>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="suspended">معلق</SelectItem>
                    </SelectContent>
                  </Select>
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
                variant={actionDialog.type === 'delete' ? "destructive" : "default"}
              >
                {actionDialog.type === 'approve' && 'اعتماد المعهد'}
                {actionDialog.type === 'suspend' && 'تعليق المعهد'}
                {actionDialog.type === 'reactivate' && 'إعادة التفعيل'}
                {actionDialog.type === 'delete' && 'حذف'}
                {actionDialog.type === 'edit' && 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}