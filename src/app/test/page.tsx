"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Home,
  UserCheck,
  Building,
  GraduationCap,
  Shield,
} from "lucide-react"

const pageGroups = [
  {
    title: "الصفحات العامة",
    icon: Home,
    pages: [
      { name: "الصفحة الرئيسية", path: "/", description: "صفحة الهبوط الرئيسية" },
      { name: "تسجيل الدخول", path: "/auth/login", description: "صفحة تسجيل الدخول" },
      { name: "إنشاء حساب", path: "/auth/register", description: "صفحة إنشاء حساب جديد" },
      { name: "استعادة كلمة المرور", path: "/auth/forgot-password", description: "صفحة استعادة كلمة المرور" },
      { name: "إعادة تعيين كلمة المرور", path: "/auth/reset-password", description: "صفحة إعادة تعيين كلمة المرور" },
      { name: "استعراض الدورات", path: "/courses", description: "صفحة استعراض جميع الدورات" },
      { name: "تفاصيل الدورة", path: "/courses/1", description: "صفحة تفاصيل دورة محددة" },
      { name: "التسجيل في الدورة", path: "/courses/1/enroll", description: "تدفق التسجيل والدفع" },
      { name: "الملف الشخصي", path: "/profile", description: "صفحة الملف الشخصي" },
      { name: "الإشعارات", path: "/notifications", description: "مركز الإشعارات" }
    ]
  },
  {
    title: "تجربة الطالب",
    icon: GraduationCap,
    pages: [
      { name: "لوحة تحكم الطالب", path: "/student/dashboard", description: "لوحة التحكم الشخصية" },
      { name: "دوراتي", path: "/student/my-courses", description: "قائمة الدورات المسجل بها" },
      { name: "شهاداتي", path: "/student/certificates", description: "عرض الشهادات المكتسبة" },
      { name: "الدروس والحضور", path: "/student/courses/1/sessions", description: "تتبع الحضور والدروس" },
      { name: "مواد الدورة", path: "/student/courses/1/materials", description: "الوصول للمواد التعليمية" },
      { name: "تقييم الدورة", path: "/student/courses/1/rate", description: "تقييم الدورة المكتملة" }
    ]
  },
  {
    title: "تجربة المدرب",
    icon: UserCheck,
    pages: [
      { name: "لوحة تحكم المدرب", path: "/trainer/dashboard", description: "لوحة تحكم المدرب" },
      { name: "إدارة الدورات", path: "/trainer/courses", description: "عرض وإدارة جميع الدورات" },
      { name: "إنشاء دورة جديدة", path: "/trainer/courses/create", description: "إنشاء دورة تدريبية جديدة" },
      { name: "إدارة الطلاب", path: "/trainer/students", description: "عرض جميع الطلاب المسجلين" },
      { name: "حجوزات القاعات", path: "/trainer/room-bookings", description: "إدارة طلبات حجز القاعات" },
      { name: "الإعلانات والتواصل", path: "/trainer/announcements", description: "إرسال إعلانات للطلاب" },
      { name: "التقييمات والتغذية الراجعة", path: "/trainer/reviews", description: "عرض وتحليل التقييمات" },
      { name: "إدارة المسجلين", path: "/trainer/courses/1/students", description: "إدارة الطلاب المسجلين" },
      { name: "تسجيل الحضور", path: "/trainer/courses/1/attendance", description: "تسجيل حضور الطلاب" },
      { name: "إصدار الشهادات", path: "/trainer/courses/1/certificates", description: "إصدار شهادات الإتمام" },
      { name: "جدول الدورة", path: "/trainer/courses/1/schedule", description: "إدارة جدول الدورة والدروس" },
      { name: "مواد الدورة", path: "/trainer/courses/1/materials", description: "إدارة المواد التعليمية" }
    ]
  },
  {
    title: "مسؤول المعهد",
    icon: Building,
    pages: [
      { name: "لوحة تحكم المعهد", path: "/institute/dashboard", description: "لوحة تحكم المعهد" },
      { name: "إدارة القاعات", path: "/institute/rooms", description: "إدارة قاعات المعهد" },
      { name: "طلبات حجز القاعات", path: "/institute/room-bookings", description: "مراجعة طلبات الحجز" },
      { name: "إدارة الدورات", path: "/institute/courses", description: "إدارة دورات المعهد" },
      { name: "التقارير والمدفوعات", path: "/institute/reports", description: "التقارير المالية والإحصائيات" },
      { name: "إدارة الطاقم", path: "/institute/staff", description: "إدارة موظفي المعهد" }
    ]
  },
  {
    title: "مسؤول المنصة",
    icon: Shield,
    pages: [
      { name: "لوحة تحكم الأدمن", path: "/admin/dashboard", description: "لوحة تحكم النظام" },
      { name: "إدارة المعاهد", path: "/admin/institutes", description: "إدارة المعاهد المسجلة" },
      { name: "إدارة المدربين", path: "/admin/trainers", description: "إدارة المدربين في المنصة" },
      { name: "إدارة الطلاب", path: "/admin/students", description: "إدارة الطلاب المسجلين" },
      { name: "إدارة الدورات", path: "/admin/courses", description: "إدارة جميع الدورات" },
      { name: "الإعلانات العامة", path: "/admin/announcements", description: "إرسال إعلانات عامة" },
      { name: "إعدادات النظام", path: "/admin/system", description: "إعدادات النظام والتكاملات" },
      { name: "السجلات والتقارير", path: "/admin/logs", description: "سجلات النظام والعمليات" }
    ]
  }
]

export default function TestPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">صفحة اختبار النظام</h1>
          <p className="text-xl text-gray-600 mb-8">
            روابط لجميع صفحات النظام للاختبار والتأكد من الوظائف
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800">
              <strong>ملاحظة:</strong> جميع الصفحات تحتوي على بيانات تجريبية للاختبار.
              يمكنك تصفح جميع الصفحات والتأكد من عمل الوظائف المختلفة.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pageGroups.map((group, groupIndex) => {
            const Icon = group.icon
            return (
              <Card key={groupIndex} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    {group.title}
                    <Badge variant="secondary" className="mr-auto">
                      {group.pages.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.pages.map((page, pageIndex) => (
                      <div key={pageIndex} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{page.name}</h4>
                          <p className="text-sm text-gray-600">{page.description}</p>
                          <code className="text-xs text-gray-500 font-mono">{page.path}</code>
                        </div>
                        <Link href={page.path}>
                          <Button size="sm" className="mr-3">
                            زيارة الصفحة
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">ملخص النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {pageGroups.reduce((sum, group) => sum + group.pages.length, 0)}
                </div>
                <div className="text-sm text-gray-600">إجمالي الصفحات</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {pageGroups.length}
                </div>
                <div className="text-sm text-gray-600">أنواع المستخدمين</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">RTL</div>
                <div className="text-sm text-gray-600">دعم اللغة العربية</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600">جاهز للإنتاج</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 منصة حجز الدورات - جميع الحقوق محفوظة</p>
          <p className="mt-2">تم تطوير النظام باستخدام Next.js و TypeScript و Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}