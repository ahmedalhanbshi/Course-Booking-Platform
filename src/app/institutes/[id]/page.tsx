"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, BookOpen, Star, Building2, Globe, Mail, Phone, Calendar, CheckCircle2 } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for a specific institute
const instituteData = {
    id: "1",
    name: "معهد المستقبل للتقنية",
    description: "معهد رائد في مجال التكنولوجيا والبرمجة، تأسس عام 2015 بهدف تمكين الشباب العربي من مهارات المستقبل. نقدم بيئة تعليمية متكاملة تجمع بين النظرية والتطبيق العملي.",
    logo: "/logos/future-tech.png",
    coverImage: "https://placehold.co/1200x300/2563eb/ffffff?text=Future+Tech+Institute",
    location: "الرياض، حي العليا، طريق الملك فهد",
    rating: 4.8,
    reviewCount: 156,
    studentsCount: 1200,
    coursesCount: 25,
    website: "www.future-tech.edu.sa",
    email: "info@future-tech.edu.sa",
    phone: "+966 11 123 4567",
    features: [
        "شهادات معتمدة محلياً ودولياً",
        "مدربين خبراء من كبرى الشركات",
        "معامل حاسوب مجهزة بأحدث التقنيات",
        "دعم وظيفي بعد التخرج"
    ],
    trainers: [
        { id: 1, name: "أحمد محمد", role: "كبير مدربي React", avatar: null },
        { id: 2, name: "سارة علي", role: "خبيرة UI/UX", avatar: null },
        { id: 3, name: "خالد عمر", role: "مهندس برمجيات", avatar: null },
    ],
    courses: [
        {
            id: "1",
            title: "تعلم React من الصفر",
            price: 500,
            rating: 4.9,
            students: 120,
            image: "https://placehold.co/600x400/2563eb/ffffff?text=React",
            category: "برمجة"
        },
        {
            id: "2",
            title: "تصميم واجهات المستخدم UI/UX",
            price: 450,
            rating: 4.7,
            students: 85,
            image: "https://placehold.co/600x400/16a34a/ffffff?text=UI/UX",
            category: "تصميم"
        },
        {
            id: "3",
            title: "أساسيات بايثون وتحليل البيانات",
            price: 600,
            rating: 4.8,
            students: 200,
            image: "https://placehold.co/600x400/ca8a04/ffffff?text=Python",
            category: "بيانات"
        }
    ]
}

export default function InstituteDetailsPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-64 md:h-80 bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={instituteData.coverImage}
                    alt={instituteData.name}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 container mx-auto max-w-7xl px-4 pb-8">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-white p-1 shadow-xl -mb-12 md:-mb-16 relative z-10">
                            <div className="h-full w-full bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                                <Building2 className="h-12 w-12" />
                            </div>
                        </div>

                        <div className="flex-1 text-white mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{instituteData.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {instituteData.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-white">{instituteData.rating}</span>
                                    <span className="text-gray-400">({instituteData.reviewCount} تقييم)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-2">
                            <Button className="bg-primary hover:bg-primary/90">تواصل معنا</Button>
                            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">مشاركة</Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Right Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>عن المعهد</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600 leading-relaxed">
                                    {instituteData.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    {instituteData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs: Courses & Trainers */}
                        <Tabs defaultValue="courses" className="w-full">
                            <TabsList className="w-full justify-start h-12 bg-white p-1 border border-gray-200 rounded-xl mb-6">
                                <TabsTrigger value="courses" className="flex-1 md:flex-none px-8 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">الدورات المتاحة</TabsTrigger>
                                <TabsTrigger value="trainers" className="flex-1 md:flex-none px-8 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">المدربين</TabsTrigger>
                                <TabsTrigger value="reviews" className="flex-1 md:flex-none px-8 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">التقييمات</TabsTrigger>
                            </TabsList>

                            <TabsContent value="courses" className="space-y-4">
                                {instituteData.courses.map((course) => (
                                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="w-full md:w-48 h-40 bg-gray-100 relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                                <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800 hover:bg-white">{course.category}</Badge>
                                            </div>
                                            <div className="flex-1 p-5 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h3>
                                                        <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                            {course.rating}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            {course.students} طالب
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            يبدأ قريباً
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="text-lg font-bold text-primary">{course.price} ر.ي</span>
                                                    <Button size="sm" asChild>
                                                        <Link href={`/courses/${course.id}`}>التفاصيل والتسجيل</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="trainers">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {instituteData.trainers.map((trainer) => (
                                        <Card key={trainer.id}>
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <Avatar className="h-14 w-14 border border-gray-100">
                                                    <AvatarImage src={trainer.avatar || undefined} />
                                                    <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{trainer.name}</h4>
                                                    <p className="text-sm text-gray-500">{trainer.role}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>

                    </div>

                    {/* Left Column: Sidebar Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">معلومات التواصل</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                    <a href={`https://${instituteData.website}`} target="_blank" className="hover:text-primary transition-colors">{instituteData.website}</a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <a href={`mailto:${instituteData.email}`} className="hover:text-primary transition-colors">{instituteData.email}</a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <span dir="ltr">{instituteData.phone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">إحصائيات المعهد</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary mb-1">{instituteData.studentsCount}</div>
                                    <div className="text-xs text-gray-500">طالب متخرج</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary mb-1">{instituteData.coursesCount}</div>
                                    <div className="text-xs text-gray-500">دورة تدريبية</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    )
}
