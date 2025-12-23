"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Play, Link as LinkIcon, Plus, Edit, Trash2, Upload, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Material, User, Course } from "@/types"
import { useState } from "react"

// Mock user data
const mockUser: User = {
  id: "2",
  name: "فاطمة علي",
  email: "fatima@example.com",
  role: 'trainer' as const,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock course data
const mockCourse: Course = {
  id: "1",
  title: "تعلم React من الصفر",
  description: "دورة شاملة في تعلم React.js",
  price: 29900,
  duration: 40,
  startDate: new Date("2025-02-01"),
  endDate: new Date("2025-03-15"),
  maxStudents: 50,
  enrolledStudents: 23,
  rating: 4.8,
  reviewCount: 156,
  status: 'active',
  category: "تطوير الويب",
  trainerId: "2",
  trainer: {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    role: 'trainer' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock materials data
const mockMaterials: Material[] = [
  {
    id: "1",
    courseId: "1",
    title: "شرح المحاضرة الأولى - PDF",
    type: "pdf" as const,
    url: "/materials/lecture1.pdf",
    uploadedAt: new Date("2025-01-25"),
    order: 1,
    isVisible: true,
  },
  {
    id: "2",
    courseId: "1",
    title: "فيديو شرح المكونات",
    type: "video" as const,
    url: "/materials/components.mp4",
    uploadedAt: new Date("2025-01-26"),
    order: 2,
    isVisible: true,
  },
  {
    id: "3",
    courseId: "1",
    title: "مشروع تطبيق TODO - GitHub",
    type: "link" as const,
    url: "https://github.com/example/todo-app",
    uploadedAt: new Date("2025-01-27"),
    order: 3,
    isVisible: false,
  },
]

export default function TrainerMaterialsPage() {
  const params = useParams()
  const courseId = params.id as string

  const [materials, setMaterials] = useState(mockMaterials)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "" as Material['type'],
    url: "",
    isVisible: true,
  })

  const getMaterialIcon = (type: Material['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'video':
        return <Play className="h-5 w-5 text-blue-500" />
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getMaterialTypeLabel = (type: Material['type']) => {
    switch (type) {
      case 'pdf': return 'PDF'
      case 'video': return 'فيديو'
      case 'link': return 'رابط'
      default: return type
    }
  }

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.type || !newMaterial.url) return

    const material: Material = {
      id: Date.now().toString(),
      courseId,
      title: newMaterial.title,
      type: newMaterial.type,
      url: newMaterial.url,
      uploadedAt: new Date(),
      order: materials.length + 1,
      isVisible: newMaterial.isVisible,
    }

    setMaterials([...materials, material])
    setNewMaterial({ title: "", type: "" as Material['type'], url: "", isVisible: true })
    setShowAddDialog(false)
  }

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material)
    setNewMaterial({
      title: material.title,
      type: material.type,
      url: material.url,
      isVisible: material.isVisible,
    })
  }

  const handleUpdateMaterial = () => {
    if (!editingMaterial || !newMaterial.title || !newMaterial.type || !newMaterial.url) return

    setMaterials(materials.map(m =>
      m.id === editingMaterial.id
        ? { ...m, title: newMaterial.title, type: newMaterial.type, url: newMaterial.url, isVisible: newMaterial.isVisible }
        : m
    ))

    setEditingMaterial(null)
    setNewMaterial({ title: "", type: "" as Material['type'], url: "", isVisible: true })
  }

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(materials.filter(m => m.id !== materialId))
  }

  const toggleVisibility = (materialId: string) => {
    setMaterials(materials.map(m =>
      m.id === materialId ? { ...m, isVisible: !m.isVisible } : m
    ))
  }

  const resetForm = () => {
    setNewMaterial({ title: "", type: "" as Material['type'], url: "", isVisible: true })
    setEditingMaterial(null)
  }

  const isFormValid = () => {
    return newMaterial.title && newMaterial.type && newMaterial.url
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/trainer/courses/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للدورة
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إدارة مواد الدورة
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المواد</p>
                <p className="text-2xl font-bold">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مرئية للطلاب</p>
                <p className="text-2xl font-bold">{materials.filter(m => m.isVisible).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">ملفات PDF</p>
                <p className="text-2xl font-bold">{materials.filter(m => m.type === 'pdf').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">فيديوهات</p>
                <p className="text-2xl font-bold">{materials.filter(m => m.type === 'video').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Material Button */}
      <div className="mb-6">
        <Dialog open={showAddDialog || !!editingMaterial} onOpenChange={(open) => {
          if (!open) resetForm()
          setShowAddDialog(open)
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMaterial(null)}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة مادة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? 'تعديل المادة' : 'إضافة مادة جديدة'}
              </DialogTitle>
              <DialogDescription>
                أدخل تفاصيل المادة التدريبية
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المادة</Label>
                <Input
                  id="title"
                  placeholder="مثال: شرح المحاضرة الأولى"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">نوع المادة</Label>
                <Select
                  value={newMaterial.type}
                  onValueChange={(value: Material['type']) => setNewMaterial(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">ملف PDF</SelectItem>
                    <SelectItem value="video">فيديو</SelectItem>
                    <SelectItem value="link">رابط خارجي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">
                  {newMaterial.type === 'link' ? 'الرابط' : 'رابط الملف'}
                </Label>
                {newMaterial.type === 'link' ? (
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={newMaterial.url}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">اسحب وأفلت الملف هنا، أو</p>
                    <Button variant="outline" size="sm">
                      اختر ملف
                    </Button>
                    <Input
                      type="file"
                      accept={newMaterial.type === 'pdf' ? '.pdf' : newMaterial.type === 'video' ? '.mp4,.avi,.mov' : ''}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // In real app, upload file and get URL
                          setNewMaterial(prev => ({ ...prev, url: file.name }))
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="visible"
                  checked={newMaterial.isVisible}
                  onCheckedChange={(checked) => setNewMaterial(prev => ({ ...prev, isVisible: !!checked }))}
                />
                <Label htmlFor="visible">مرئية للطلاب</Label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
                <Button
                  onClick={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
                  disabled={!isFormValid()}
                >
                  {editingMaterial ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {materials.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  لا توجد مواد
                </h3>
                <p className="text-gray-500 mb-4">
                  ابدأ بإضافة المواد التدريبية للدورة
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة أول مادة
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          materials.map((material) => (
            <Card key={material.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getMaterialIcon(material.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{material.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">
                          {getMaterialTypeLabel(material.type)}
                        </Badge>
                        <span>تم الرفع في {formatDate(material.uploadedAt)}</span>
                        <div className="flex items-center gap-1">
                          {material.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={material.isVisible ? 'text-green-600' : 'text-gray-400'}>
                            {material.isVisible ? 'مرئية' : 'مخفية'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(material.id)}
                    >
                      {material.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}