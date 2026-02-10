"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Calendar, Clock, Award, FileText, Download, X, CheckCircle, AlertCircle, Play, ArrowLeft, Users } from "lucide-react"
import { Course, Enrollment, User } from "@/types"
import { formatDate, formatTime } from "@/lib/utils"

const ENROLLMENTS_KEY = "myCoursesEnrollments"
type EnrollmentWithCourse = Enrollment & { course: Course & { image: string } }

const statusVariants = {
  active: {
    label: "سارية",
    activeClass: "bg-white text-slate-900 shadow-sm",
    inactiveClass: "text-slate-600 hover:text-slate-900"
  },
  completed: {
    label: "مكتملة",
    activeClass: "bg-white text-slate-900 shadow-sm",
    inactiveClass: "text-slate-600 hover:text-slate-900"
  },
  cancelled: {
    label: "ملغاة",
    activeClass: "bg-white text-slate-900 shadow-sm",
    inactiveClass: "text-slate-600 hover:text-slate-900"
  }
} as const

type StatusKey = keyof typeof statusVariants

function StatusPill({
  status,
  isActive,
  onClick
}: {
  status: StatusKey
  isActive: boolean
  onClick?: () => void
}) {
  const styles = statusVariants[status]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 w-full rounded-full px-4 text-sm font-medium text-center transition ${
        isActive ? styles.activeClass : styles.inactiveClass
      }`}
    >
      {styles.label}
    </button>
  )
}

// Mock user data
const mockUser: User = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: 'student' as const,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock enrolled courses with different statuses
const mockEnrollments: EnrollmentWithCourse[] = [
  {
    id: "1",
    studentId: "1",
    courseId: "1",
    enrolledAt: new Date("2025-01-15"),
    status: 'active',
    progress: 75,
    course: {
      id: "1",
      title: "تعلم React من الصفر",
      description: "دورة شاملة في تعلم React.js مع مشاريع عملية",
      shortDescription: "تعلم React من الصفر مع مشاريع عملية",
      trainerId: "1",
      trainer: {
        id: "1",
        name: "أحمد محمد",
        email: "ahmed@example.com",
        role: 'trainer' as const,
        status: 'active',
        avatar: "/images/avatar-1.png",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
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
      image: "/images/course-web.png",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  },
  {
    id: "4",
    studentId: "1",
    courseId: "4",
    enrolledAt: new Date("2025-02-10"),
    status: 'active',
    progress: 15,
    course: {
      id: "4",
      title: "مقدمة في الذكاء الاصطناعي",
      description: "فهم أساسيات الذكاء الاصطناعي وتعلم الآلة.",
      shortDescription: "فهم أساسيات الذكاء الاصطناعي وتعلم الآلة.",
      trainerId: "5",
      trainer: {
        id: "5",
        name: "خالد عمر",
        email: "khaled@example.com",
        role: 'trainer' as const,
        status: 'active',
        avatar: "/images/avatar-2.png",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      price: 15000,
      duration: 25,
      startDate: new Date("2025-02-20"),
      endDate: new Date("2025-03-20"),
      maxStudents: 60,
      enrolledStudents: 45,
      rating: 4.6,
      reviewCount: 90,
      status: 'active',
      category: "علوم البيانات",
      image: "/images/course-design.png",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  },
  {
    id: "2",
    studentId: "1",
    courseId: "2",
    enrolledAt: new Date("2024-11-01"),
    status: 'completed',
    progress: 100,
    course: {
      id: "2",
      title: "تصميم واجهات المستخدم",
      description: "تعلم مبادئ التصميم وأدوات التصميم الحديثة",
      shortDescription: "تعلم مبادئ التصميم وأدوات التصميم الحديثة",
      trainerId: "2",
      trainer: {
        id: "2",
        name: "فاطمة علي",
        email: "fatima@example.com",
        role: 'trainer' as const,
        status: 'active',
        avatar: "/images/avatar-2.png",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      price: 39900,
      duration: 30,
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-10-15"),
      maxStudents: 30,
      enrolledStudents: 25,
      rating: 4.9,
      reviewCount: 89,
      status: 'completed',
      category: "التصميم",
      image: "/images/course-design.png",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  },
  {
    id: "5",
    studentId: "1",
    courseId: "5",
    enrolledAt: new Date("2024-08-01"),
    status: 'completed',
    progress: 100,
    course: {
      id: "5",
      title: "أساسيات التسويق الرقمي",
      description: "كيف تبني استراتيجية تسويقية ناجحة.",
      shortDescription: "كيف تبني استراتيجية تسويقية ناجحة.",
      trainerId: "6",
      trainer: {
        id: "6",
        name: "سارة حسن",
        email: "sara@example.com",
        role: 'trainer' as const,
        status: 'active',
        avatar: "/images/avatar-3.png",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      price: 20000,
      duration: 20,
      startDate: new Date("2024-08-10"),
      endDate: new Date("2024-09-10"),
      maxStudents: 50,
      enrolledStudents: 48,
      rating: 4.7,
      reviewCount: 110,
      status: 'completed',
      category: "التسويق",
      image: "/images/course-web.png",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  },
  {
    id: "3",
    studentId: "1",
    courseId: "3",
    enrolledAt: new Date("2024-12-01"),
    status: 'cancelled',
    progress: 20,
    course: {
      id: "3",
      title: "إدارة المشاريع الرقمية",
      description: "تعلم إدارة المشاريع الرقمية باستخدام أدوات حديثة",
      shortDescription: "تعلم إدارة المشاريع الرقمية باستخدام أدوات حديثة",
      trainerId: "4",
      trainer: {
        id: "4",
        name: "محمد حسن",
        email: "mohamed@example.com",
        role: 'trainer' as const,
        status: 'active',
        avatar: "/images/avatar-4.png",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      price: 49900,
      duration: 50,
      startDate: new Date("2024-12-15"),
      endDate: new Date("2025-02-15"),
      maxStudents: 40,
      enrolledStudents: 15,
      rating: 4.7,
      reviewCount: 203,
      status: 'active',
      category: "إدارة الأعمال",
      image: "/images/course-web.png",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  },
  {
    id: "6",
    studentId: "1",
    courseId: "6",
    enrolledAt: new Date("2024-12-20"),
    status: 'cancelled',
    progress: 0,
    course: {
      id: "6",
      title: "مقدمة في الأمن السيبراني",
      description: "حماية الأنظمة والشبكات من الهجمات الرقمية.",
      shortDescription: "حماية الأنظمة والشبكات من الهجمات الرقمية.",
      trainerId: "7",
      trainer: {
        id: "7",
        name: "عمر خالد",
        email: "omar@example.com",
        role: 'trainer' as const,
        status: 'active',
        avatar: "/images/avatar-1.png",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      price: 35000,
      duration: 45,
      startDate: new Date("2025-01-05"),
      endDate: new Date("2025-02-25"),
      maxStudents: 40,
      enrolledStudents: 10,
      rating: 4.8,
      reviewCount: 50,
      status: 'active',
      category: "الأمن السيبراني",
      image: "/images/course-design.png",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  }
]

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>(mockEnrollments)

  const buildLocalEnrollment = (item: any): EnrollmentWithCourse => {
    const now = new Date()
    return {
      id: `local-${item.courseId}`,
      studentId: mockUser.id,
      courseId: item.courseId,
      enrolledAt: new Date(item.createdAt ?? now.toISOString()),
      status: 'active',
      progress: 0,
      course: {
        id: item.courseId,
        title: item.title,
        description: item.description || item.shortDescription || "",
        shortDescription: item.shortDescription || item.description || "",
        trainerId: "local-trainer",
        trainer: {
          id: "local-trainer",
          name: item.instructorName || "مدرب الدورة",
          email: "trainer@example.com",
          role: 'trainer' as const,
          status: 'active',
          avatar: item.instructorAvatar || "/images/avatar-1.png",
          createdAt: now,
          updatedAt: now,
        },
        price: item.price || 0,
        duration: 0,
        startDate: item.startDate ? new Date(item.startDate) : now,
        endDate: item.endDate ? new Date(item.endDate) : now,
        maxStudents: item.maxStudents || 0,
        enrolledStudents: 0,
        rating: 0,
        reviewCount: 0,
        status: 'active',
        category: item.category || "",
        image: item.image || "/images/course-web.png",
        createdAt: now,
        updatedAt: now,
      }
    }
  }

  useEffect(() => {
    const loadLocalEnrollments = () => {
      if (typeof window === "undefined") return
      try {
        const stored = window.localStorage.getItem(ENROLLMENTS_KEY)
        const list = stored ? (JSON.parse(stored) as any[]) : []
        const localEnrollments = list.map(buildLocalEnrollment)
        const merged = [
          ...localEnrollments,
          ...mockEnrollments.filter(
            (enrollment) => !localEnrollments.some((item) => item.courseId === enrollment.courseId)
          )
        ]
        setEnrollments(merged)
      } catch {
        setEnrollments(mockEnrollments)
      }
    }

    loadLocalEnrollments()
    if (typeof window === "undefined") return

    window.addEventListener("enrollments-updated", loadLocalEnrollments)
    window.addEventListener("storage", loadLocalEnrollments)
    return () => {
      window.removeEventListener("enrollments-updated", loadLocalEnrollments)
      window.removeEventListener("storage", loadLocalEnrollments)
    }
  }, [])

  const getEnrollmentsByStatus = (status: Enrollment['status']) => {
    return enrollments.filter(enrollment => enrollment.status === status)
  }

  const handleCancelEnrollment = (courseId: string) => {
    setSelectedCourse(courseId)
    setShowCancelDialog(true)
  }

  const confirmCancellation = () => {
    // In real app, this would make an API call
    console.log('Cancelling enrollment for course:', selectedCourse)
    setShowCancelDialog(false)
    setSelectedCourse(null)
  }

  const renderCourseCard = (enrollment: Enrollment & { course: Course & { image: string } }) => {
    const nextSession = new Date() // Mock next session
    const courseLink = `/student/courses/${enrollment.course.id}${enrollment.status === 'completed' ? '?status=completed' : enrollment.status === 'cancelled' ? '?status=cancelled' : ''}`
    const nextSessionLabel =
      enrollment.status === 'active'
        ? `${formatDate(nextSession)} • ${formatTime(nextSession)}`
        : 'لا توجد جلسات قادمة'

    return (
      <Card key={enrollment.id} className="w-full overflow-hidden border border-border/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row-reverse gap-6 items-stretch">
            <Link
              href={courseLink}
              className="group relative w-full aspect-square md:w-[240px] md:h-[240px] rounded-xl overflow-hidden bg-muted shrink-0"
            >
              <Image
                src={enrollment.course.image}
                alt={enrollment.course.title}
                fill
                sizes="(min-width: 768px) 240px, 100vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            <div className="flex-1 flex flex-col gap-4 text-right">
              <div className="space-y-2">
                <Link href={courseLink} className="hover:text-primary transition-colors">
                  <h3 className="text-lg sm:text-xl font-bold leading-snug">{enrollment.course.title}</h3>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {enrollment.course.shortDescription || enrollment.course.description}
                </p>
                <p className="text-muted-foreground text-sm flex items-center justify-end gap-2">
                  <Users className="h-4 w-4" />
                  المدرب: {enrollment.course.trainer.name}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm space-y-1">
                <div className="flex items-center justify-end gap-2 text-primary">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">الدرس القادم</span>
                </div>
                <p className="text-foreground">{nextSessionLabel}</p>
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-2 pt-1">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href={courseLink}>تفاصيل الدورة</Link>
                </Button>

                {enrollment.status === 'active' && (
                  <Dialog open={showCancelDialog && selectedCourse === enrollment.course.id} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancelEnrollment(enrollment.course.id)}
                      >
                        <X className="ml-2 h-4 w-4" />
                        إلغاء
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تأكيد إلغاء التسجيل</DialogTitle>
                        <DialogDescription>
                          هل أنت متأكد من رغبتك في إلغاء تسجيلك في دورة {enrollment.course.title}؟
                          سيتم استرداد المبلغ وفقًا لسياسة الاسترداد.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 justify-end mt-4">
                        <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                          تراجع
                        </Button>
                        <Button variant="destructive" onClick={confirmCancellation}>
                          تأكيد الإلغاء
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeCourses = getEnrollmentsByStatus('active')
  const completedCourses = getEnrollmentsByStatus('completed')
  const cancelledCourses = getEnrollmentsByStatus('cancelled')

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">دوراتي التعليمية</h1>
        <p className="text-muted-foreground">
          تابع تقدمك في الدورات وقم بإدارة رحلتك التعليمية
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Play className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">دورات سارية</p>
              <p className="text-2xl font-bold">{activeCourses.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">دورات مكتملة</p>
              <p className="text-2xl font-bold">{completedCourses.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">دورات ملغاة</p>
              <p className="text-2xl font-bold">{cancelledCourses.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="grid w-full grid-cols-3 gap-2 rounded-full bg-muted/50 p-1 mb-8">
          <StatusPill
            status="active"
            isActive={activeTab === "active"}
            onClick={() => setActiveTab("active")}
          />
          <StatusPill
            status="completed"
            isActive={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          />
          <StatusPill
            status="cancelled"
            isActive={activeTab === "cancelled"}
            onClick={() => setActiveTab("cancelled")}
          />
        </div>

        <TabsContent value="active" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeCourses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="لا توجد دورات سارية"
              description="لم تقم بالتسجيل في أي دورة حالياً. ابدأ رحلتك التعليمية اليوم!"
              actionLabel="استعراض الدورات"
              actionLink="/courses"
            />
          ) : (
            activeCourses.map(renderCourseCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {completedCourses.length === 0 ? (
            <EmptyState
              icon={Award}
              title="لا توجد دورات مكتملة"
              description="أكمل دوراتك لتحصل على الشهادات وتطور مهاراتك."
            />
          ) : (
            completedCourses.map(renderCourseCard)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {cancelledCourses.length === 0 ? (
            <EmptyState
              icon={X}
              title="لا توجد دورات ملغاة"
              description="سجل الدورات الملغاة سيظهر هنا."
            />
          ) : (
            cancelledCourses.map(renderCourseCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }: any) {
  return (
    <Card className="glass-card border-dashed border-2 border-muted-foreground/20">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          {description}
        </p>
        {actionLabel && (
          <Button asChild>
            <Link href={actionLink}>{actionLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}


