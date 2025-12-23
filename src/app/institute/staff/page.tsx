"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Mail, UserCheck, UserX } from "lucide-react"
import { User } from "@/types"
import { formatDate } from "@/lib/utils"

// Mock data
const mockStaff: User[] = [
  {
    id: "staff1",
    name: "فاطمة علي",
    email: "fatima@institute.com",
    role: "trainer" as const,
    avatar: "/avatars/fatima.jpg",
    status: "active",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "staff2",
    name: "محمد أحمد",
    email: "mohamed@institute.com",
    role: "trainer" as const,
    avatar: "/avatars/mohamed.jpg",
    status: "active",
    createdAt: new Date("2023-03-20")
  },
]

const staffRoles = [
  { value: "trainer", label: "مدرب" },
  { value: "institute_admin", label: "مدير معهد" }
]

export default function InstituteStaff() {
  const [staff, setStaff] = useState<User[]>(mockStaff)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<User | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    role: User['role']
  }>({
    name: "",
    email: "",
    role: "trainer"
  })

  const handleAddStaff = () => {
    const newStaff: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: "/avatars/default.jpg",
      status: "active",
      createdAt: new Date()
    }
    setStaff([...staff, newStaff])
    setFormData({ name: "", email: "", role: "trainer" })
    setIsAddDialogOpen(false)
  }

  const handleEditStaff = (member: User) => {
    setEditingStaff(member)
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role
    })
  }

  const handleUpdateStaff = () => {
    if (!editingStaff) return

    const updatedStaff: User = {
      ...editingStaff,
      name: formData.name,
      email: formData.email,
      role: formData.role
    }

    setStaff(staff.map(member => member.id === editingStaff.id ? updatedStaff : member))
    setEditingStaff(null)
    setFormData({ name: "", email: "", role: "trainer" })
  }

  const handleRemoveStaff = (staffId: string) => {
    setStaff(staff.filter(member => member.id !== staffId))
  }

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'trainer':
        return <Badge className="bg-blue-100 text-blue-800">مدرب</Badge>
      case 'institute_admin':
        return <Badge className="bg-purple-100 text-purple-800">مدير معهد</Badge>
      case 'platform_admin':
        return <Badge className="bg-red-100 text-red-800">مدير منصة</Badge>
      case 'student':
        return <Badge className="bg-green-100 text-green-800">طالب</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطاقم</h1>
          <p className="text-gray-600 mt-2">إدارة موظفي ومدربي المعهد</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              دعوة موظف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>دعوة موظف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@institute.com"
                />
              </div>
              <div>
                <Label htmlFor="role">الدور</Label>
                <Select value={formData.role} onValueChange={(value: User['role']) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddStaff} className="w-full">
                إرسال الدعوة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطاقم</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">موظف نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدربين</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(member => member.role === 'trainer').length}
            </div>
            <p className="text-xs text-muted-foreground">مدرب نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإداريين</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(member => member.role === 'institute_admin').length}
            </div>
            <p className="text-xs text-muted-foreground">مدير معهد</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطاقم</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>تاريخ الانضمام</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {member.email}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStaff(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveStaff(member.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الموظف</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">الاسم الكامل</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">الدور</Label>
              <Select value={formData.role} onValueChange={(value: User['role']) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateStaff} className="w-full">
              حفظ التغييرات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}