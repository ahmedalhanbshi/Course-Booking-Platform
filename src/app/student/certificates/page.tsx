"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Award, Calendar, FileText, Star } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Mock user data
const mockUser = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: 'student' as const,
}

// Mock certificates data
const certificates = [
  {
    id: "1",
    courseTitle: "تعلم React من الصفر",
    courseId: "1",
    trainerName: "أحمد محمد",
    instituteName: "أكاديمية التكنولوجيا",
    completionDate: new Date("2025-01-15"),
    grade: "ممتاز",
    certificateNumber: "CERT-2025-001",
    skills: ["React", "JavaScript", "Frontend Development"],
    rating: 4.8,
  },
  {
    id: "2",
    courseTitle: "تصميم واجهات المستخدم",
    courseId: "2",
    trainerName: "فاطمة علي",
    instituteName: "معهد التصميم الرقمي",
    completionDate: new Date("2024-12-20"),
    grade: "جيد جداً",
    certificateNumber: "CERT-2024-045",
    skills: ["UI/UX Design", "Figma", "Adobe XD"],
    rating: 4.9,
  },
  {
    id: "3",
    courseTitle: "إدارة المشاريع الرقمية",
    courseId: "3",
    trainerName: "محمد حسن",
    instituteName: "جامعة الأعمال",
    completionDate: new Date("2024-11-10"),
    grade: "ممتاز",
    certificateNumber: "CERT-2024-023",
    skills: ["Project Management", "Agile", "Scrum"],
    rating: 4.7,
  },
]

export default function StudentCertificatesPage() {


  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">شهاداتي</h1>
        <p className="text-gray-600">
          جميع الشهادات التي حصلت عليها من إكمال الدورات التدريبية
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="me-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الشهادات</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {certificates.map((certificate) => (
             <div key={certificate.id} className="block h-full">
               <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                 <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                   <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{certificate.courseTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(certificate.completionDate)}
                      </CardDescription>
                    </div>
                  </div>

                </div>
              </CardHeader>

              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">المدرب</p>
                      <p className="font-medium">{certificate.trainerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">المعهد</p>
                      <p className="font-medium">{certificate.instituteName}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-2">رقم الشهادة</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {certificate.certificateNumber}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <div className="flex gap-2 w-full">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/student/courses/${certificate.courseId}?status=completed`}>
                          عرض الدورة
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => alert("جاري تحميل الشهادة...")}>
                        <Download className="me-2 h-4 w-4" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </div>
               </CardContent>
             </Card>
           </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد شهادات بعد
            </h3>
            <p className="text-gray-500 mb-6">
              أكمل دوراتك التدريبية للحصول على شهادات معتمدة
            </p>
            <Button asChild>
              <Link href="/courses">
                استعرض الدورات المتاحة
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}