"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, MapPin, Heart, BookOpen, Trash2 } from "lucide-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

// Mock wishlist data
const initialWishlistCourses = [
    {
        id: "4",
        title: "تعلم Python للمبتدئين",
        description: "دورة شاملة في لغة Python مع تطبيقات عملية. ابدأ رحلتك في عالم البرمجة مع واحدة من أكثر اللغات طلباً.",
        trainer: {
            name: "سارة خالد",
        },
        price: 24900,
        duration: 35,
        type: "أونلاين",
        category: "تطوير البرمجيات",
        image: "/images/course-web.png", // Placeholder
        rating: 4.6,
        reviewCount: 120,
        institute: "أكاديمية البرمجة",
    },
    {
        id: "6",
        title: "تحليل البيانات باستخدام SQL",
        description: "تعلم قواعد البيانات وتحليل البيانات باستخدام SQL. مهارة أساسية لكل محلل بيانات ومطور.",
        trainer: {
            name: "نورة عبدالله",
        },
        price: 19900,
        duration: 25,
        type: "أونلاين",
        category: "قواعد البيانات",
        image: "/images/course-web.png", // Placeholder
        rating: 4.8,
        reviewCount: 110,
        institute: "أكاديمية البيانات",
    }
]

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState(initialWishlistCourses)
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const confirmDelete = () => {
        if (courseToDelete) {
            setWishlist(prev => prev.filter(course => course.id !== courseToDelete))
            setCourseToDelete(null)
            setIsDialogOpen(false)
        }
    }

    const handleDeleteClick = (id: string) => {
        setCourseToDelete(id)
        setIsDialogOpen(true)
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">قائمة الرغبات</h1>
                <p className="text-gray-600">
                    الدورات التي قمت بحفظها للرجوع إليها لاحقاً
                </p>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                            <div className="aspect-video relative overflow-hidden">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                                    {course.category}
                                </Badge>

                                <button
                                    onClick={() => handleDeleteClick(course.id)}
                                    className="absolute top-3 left-3 p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors z-10"
                                    title="إزالة من المفضلة"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-xs">
                                        {course.type}
                                    </Badge>
                                </div>

                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {course.title}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <Users className="h-4 w-4" />
                                    <span className="truncate">{course.trainer.name}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="text-lg font-bold text-primary">
                                        {new Intl.NumberFormat('en-US').format(course.price)} ريال
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/courses/${course.id}`}>
                                            عرض التفاصيل
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            قائمة الرغبات فارغة
                        </h3>
                        <p className="text-gray-500 mb-6">
                            لم تقم بإضافة أي دورات إلى قائمة الرغبات بعد
                        </p>
                        <Button asChild>
                            <Link href="/courses">
                                تصفح الدورات
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في إزالة هذه الدورة من قائمة الرغبات؟
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline">إلغاء</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={confirmDelete}>
                            حذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
