"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Cairo } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Play, Link as LinkIcon, Download, Calendar, BookOpen, File } from "lucide-react"
import { Material } from "@/types"
import { formatDate } from "@/lib/utils"

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
})

// Mock course data
const mockCourse = {
  id: "1",
  title: "تعلم React من الصفر",
  trainer: {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "trainer" as const
  }
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
        isVisible: true
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
        isVisible: true
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
        isVisible: true
      }
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
        isVisible: true
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
        isVisible: true
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
        isVisible: true
      }
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
        isVisible: true
      }
    ]
  }
]

export default function CourseMaterialsPage() {
  const params = useParams()
  const courseId = params.id as string

  const safeText = (value: string | undefined | null, fallback: string) => {
    if (typeof value !== "string") return fallback
    const trimmed = value.trim()
    return trimmed.length ? trimmed : fallback
  }

  const getMaterialIcon = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "video":
        return <Play className="h-4 w-4 text-blue-500" />
      case "link":
        return <LinkIcon className="h-4 w-4 text-green-500" />
      default:
        return <File className="h-4 w-4 text-slate-500" />
    }
  }

  const getMaterialTypeLabel = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
        return "PDF"
      case "video":
        return "فيديو"
      case "link":
        return "رابط"
      default:
        return type
    }
  }

  const handleDownload = (material: Material) => {
    if (material.type === "link") {
      window.open(material.url, "_blank")
    } else {
      console.log("Downloading:", material.title)
    }
  }

  const courseTitle = safeText(mockCourse.title, "الدورة")
  const totalMaterials = mockMaterialsBySection.reduce(
    (acc, section) => acc + section.materials.length,
    0
  )
  const totalVideos = mockMaterialsBySection
    .flatMap((section) => section.materials)
    .filter((material) => material.type === "video").length

  return (
    <div
      className={`${cairo.className} mx-auto max-w-4xl space-y-6`}
      dir="rtl"
      lang="ar"
    >
      {/* Header */}
      <div className="space-y-3">
        <Button variant="outline" size="sm" asChild className="h-8 rounded-full px-4 text-xs">
          <Link href={`/student/courses/${courseId}`}>العودة للدورة</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مواد الدورة</h1>
          <p className="text-sm text-slate-600">{courseTitle}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="h-[80px] rounded-xl border border-slate-100 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
          <CardContent className="flex h-full items-center p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">إجمالي المواد</p>
                <p className="text-lg font-semibold text-slate-900">{totalMaterials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[80px] rounded-xl border border-slate-100 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
          <CardContent className="flex h-full items-center p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">فيديوهات</p>
                <p className="text-lg font-semibold text-slate-900">{totalVideos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials by Section */}
      {mockMaterialsBySection.length === 0 ? (
        <Card className="rounded-2xl border border-slate-100">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                لا توجد مواد متاحة بعد
              </h3>
              <p className="text-slate-500 mb-4">
                سيتم رفع المواد التدريبية قريبًا. يرجى مراجعة الصفحة لاحقًا.
              </p>
              <Button variant="outline" asChild>
                <Link href={`/student/courses/${courseId}`}>العودة للدورة</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {mockMaterialsBySection.map((section, sectionIndex) => {
            const sectionTitle = safeText(section.section, "قسم المواد")

            return (
              <Card key={sectionIndex} className="rounded-2xl border border-slate-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <BookOpen className="h-5 w-5" />
                    {sectionTitle}
                  </CardTitle>
                  <CardDescription>
                    {section.materials.length} مادة متاحة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.materials.map((material) => {
                      const materialTitle = safeText(material.title, "مادة تدريبية")

                      return (
                        <div
                          key={material.id}
                          className="flex items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              {getMaterialIcon(material.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-900 mb-1">
                                {materialTitle}
                              </h3>
                              <div className="flex items-center gap-4 text-xs text-slate-600">
                                <Badge variant="outline" className="text-[10px]">
                                  {getMaterialTypeLabel(material.type)}
                                </Badge>
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
                            className="flex items-center gap-2 rounded-full px-4 text-xs"
                          >
                            {material.type === "link" ? (
                              <>
                                <LinkIcon className="h-4 w-4" />
                                زيارة
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                {material.type === "video" ? "مشاهدة" : "تحميل"}
                              </>
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Download All Section */}
      {totalMaterials > 0 && (
        <Card className="rounded-2xl border border-slate-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                تحميل جميع المواد
              </h3>
              <p className="text-slate-600 mb-4">
                يمكنك تحميل جميع مواد الدورة كملف مضغوط
              </p>
              <Button size="lg" className="rounded-full">
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
