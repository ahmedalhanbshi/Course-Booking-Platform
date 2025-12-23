"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Play, Link as LinkIcon, Download, Calendar, BookOpen, File } from "lucide-react"
import { Material } from "@/types"
import { formatDate } from "@/lib/utils"

// Mock user data
const mockUser = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: 'student' as const,
}

// Mock course data
const mockCourse = {
  id: "1",
  title: "تعلم React من الصفر",
  trainer: {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: 'trainer' as const,
  },
}

// Mock materials data organized by sections
const mockMaterialsBySection = [
  {
    section: "الأسبوع الأول: المقدمة",
    materials: [
      {
        id: "1",
        courseId: "1",
        title: "شرح المحاضرة الأولى - PDF",
        type: "pdf" as const,
        url: "/materials/lecture1.pdf",
        uploadedAt: new Date("2025-01-25"),
        uploadedBy: "1",
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
        uploadedBy: "1",
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
        uploadedBy: "1",
        order: 3,
        isVisible: true,
      },
    ]
  },
  {
    section: "الأسبوع الثاني: إدارة الحالة",
    materials: [
      {
        id: "4",
        courseId: "1",
        title: "شرح useState و useEffect - PDF",
        type: "pdf" as const,
        url: "/materials/hooks.pdf",
        uploadedAt: new Date("2025-02-01"),
        uploadedBy: "1",
        order: 1,
        isVisible: true,
      },
      {
        id: "5",
        courseId: "1",
        title: "فيديو عملي: إدارة الحالة",
        type: "video" as const,
        url: "/materials/state-management.mp4",
        uploadedAt: new Date("2025-02-02"),
        uploadedBy: "1",
        order: 2,
        isVisible: true,
      },
      {
        id: "6",
        courseId: "1",
        title: "تمرين عملي: تطبيق عداد",
        type: "link" as const,
        url: "https://codesandbox.io/s/counter-app-example",
        uploadedAt: new Date("2025-02-03"),
        uploadedBy: "1",
        order: 3,
        isVisible: true,
      },
    ]
  },
  {
    section: "الأسبوع الثالث: التوجيه",
    materials: [
      {
        id: "7",
        courseId: "1",
        title: "دليل React Router - PDF",
        type: "pdf" as const,
        url: "/materials/router-guide.pdf",
        uploadedAt: new Date("2025-02-08"),
        uploadedBy: "1",
        order: 1,
        isVisible: true,
      },
    ]
  },
]

export default function CourseMaterialsPage() {
  const params = useParams()
  const courseId = params.id as string

  const getMaterialIcon = (type: Material['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'video':
        return <Play className="h-5 w-5 text-blue-500" />
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
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

  const handleDownload = (material: Material) => {
    // In real app, this would trigger download or open in new tab
    if (material.type === 'link') {
      window.open(material.url, '_blank')
    } else {
      // Simulate download
      console.log('Downloading:', material.title)
    }
  }

  const totalMaterials = mockMaterialsBySection.reduce((acc, section) => acc + section.materials.length, 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/student/courses/${courseId}`}>
              ← العودة للدورة
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          مواد الدورة
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="me-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المواد</p>
                <p className="text-2xl font-bold">{totalMaterials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-red-600" />
              <div className="me-4">
                <p className="text-sm font-medium text-gray-600">ملفات PDF</p>
                <p className="text-2xl font-bold">
                  {mockMaterialsBySection.flatMap(s => s.materials).filter(m => m.type === 'pdf').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-blue-600" />
              <div className="me-4">
                <p className="text-sm font-medium text-gray-600">فيديوهات</p>
                <p className="text-2xl font-bold">
                  {mockMaterialsBySection.flatMap(s => s.materials).filter(m => m.type === 'video').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials by Section */}
      {mockMaterialsBySection.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                لا توجد مواد متاحة بعد
              </h3>
              <p className="text-gray-500 mb-4">
                سيتم رفع المواد التدريبية قريباً. يرجى مراجعة الصفحة لاحقاً.
              </p>
              <Button variant="outline" asChild>
                <Link href={`/student/courses/${courseId}`}>
                  العودة للدورة
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {mockMaterialsBySection.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {section.section}
                </CardTitle>
                <CardDescription>
                  {section.materials.length} مادة متاحة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getMaterialIcon(material.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {material.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {getMaterialTypeLabel(material.type)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(material.uploadedAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleDownload(material)}
                        className="flex items-center gap-2"
                      >
                        {material.type === 'link' ? (
                          <>
                            <LinkIcon className="h-4 w-4" />
                            زيارة
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            {material.type === 'video' ? 'مشاهدة' : 'تحميل'}
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Download All Section */}
      {totalMaterials > 0 && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                تحميل جميع المواد
              </h3>
              <p className="text-gray-600 mb-4">
                يمكنك تحميل جميع مواد الدورة كملف مضغوط
              </p>
              <Button size="lg">
                <Download className="me-2 h-5 w-5" />
                تحميل المجموعة الكاملة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}