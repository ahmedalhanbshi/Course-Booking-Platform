"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Users, BookOpen, Star, Building2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"

// Mock data for institutes
const institutes = [
    {
        id: "1",
        name: "معهد المستقبل للتقنية",
        description: "معهد رائد في مجال التكنولوجيا والبرمجة، يقدم دورات متقدمة في تطوير الويب والذكاء الاصطناعي.",
        logo: "/logos/future-tech.png", // Placeholder
        location: "الرياض، المملكة العربية السعودية",
        rating: 4.8,
        studentsCount: 1200,
        coursesCount: 25,
        categories: ["برمجة", "ذكاء اصطناعي", "أمن سيبراني"],
        coverImage: "https://placehold.co/600x200/2563eb/ffffff?text=Future+Tech"
    },
    {
        id: "2",
        name: "أكاديمية الإبداع للتصميم",
        description: "وجهتك الأولى لتعلم فنون التصميم الجرافيكي وتجربة المستخدم، مع مدربين عالميين.",
        logo: "/logos/creative-design.png", // Placeholder
        location: "جدة، المملكة العربية السعودية",
        rating: 4.6,
        studentsCount: 850,
        coursesCount: 18,
        categories: ["تصميم جرافيك", "UI/UX", "موشن جرافيك"],
        coverImage: "https://placehold.co/600x200/16a34a/ffffff?text=Creative+Design"
    },
    {
        id: "3",
        name: "معهد اللغات الحديثة",
        description: "تعلم اللغات الحية بأساليب مبتكرة وتفاعلية. دورات في الإنجليزية، الفرنسية، والإسبانية.",
        logo: "/logos/languages.png", // Placeholder
        location: "الدمام، المملكة العربية السعودية",
        rating: 4.5,
        studentsCount: 2000,
        coursesCount: 30,
        categories: ["لغات", "تطوير ذات", "مهارات تواصل"],
        coverImage: "https://placehold.co/600x200/ca8a04/ffffff?text=Modern+Languages"
    },
    {
        id: "4",
        name: "مركز رواد الأعمال",
        description: "برامج تدريبية متخصصة في إدارة الأعمال، التسويق، والقيادة لرواد الأعمال الطموحين.",
        logo: "/logos/business.png", // Placeholder
        location: "الرياض، المملكة العربية السعودية",
        rating: 4.9,
        studentsCount: 500,
        coursesCount: 12,
        categories: ["إدارة أعمال", "تسويق", "قيادة"],
        coverImage: "https://placehold.co/600x200/9333ea/ffffff?text=Business+Leaders"
    }
]

export default function InstitutesPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredInstitutes = institutes.filter(institute =>
        institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institute.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <Navbar />

            <main className="container mx-auto max-w-7xl px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">المعاهد المعتمدة</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        تصفح أفضل المعاهد والمراكز التدريبية المعتمدة لدينا، واختر المكان الأنسب لبدء رحلتك التعليمية.
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto mb-12 relative">
                    <div className="relative">
                        <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="ابحث عن معهد..."
                            className="pr-12 h-12 text-lg shadow-sm border-gray-200 focus:border-primary focus:ring-primary rounded-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Institutes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredInstitutes.length > 0 ? (
                        filteredInstitutes.map((institute) => (
                            <Card key={institute.id} className="group overflow-hidden border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                {/* Cover Image */}
                                <div className="h-32 bg-gray-100 relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={institute.coverImage}
                                        alt={institute.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                <CardHeader className="relative pt-0 pb-4 px-6">
                                    {/* Logo */}
                                    <div className="absolute -top-10 right-6">
                                        <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-md border border-gray-100">
                                            <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center text-primary">
                                                <Building2 className="h-8 w-8" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {institute.name}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs font-bold text-yellow-700">{institute.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {institute.location}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-6 flex-1">
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                        {institute.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {institute.categories.slice(0, 3).map((cat) => (
                                            <Badge key={cat} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-normal">
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="h-4 w-4 text-primary/70" />
                                            <span>{institute.studentsCount} طالب</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BookOpen className="h-4 w-4 text-primary/70" />
                                            <span>{institute.coursesCount} دورة</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="px-6 pb-6 pt-0">
                                    <Button className="w-full bg-gray-900 hover:bg-primary text-white transition-colors" asChild>
                                        <Link href={`/institutes/${institute.id}`}>
                                            عرض التفاصيل
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
                            <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
