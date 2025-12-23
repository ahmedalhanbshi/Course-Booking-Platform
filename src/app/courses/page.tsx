"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, Users, Clock, MapPin, Heart, BookOpen } from "lucide-react"
import { CourseCard } from "@/components/course-card"

// Mock data for courses
const mockCourses = [
  {
    id: "1",
    title: "تعلم React من الصفر",
    description: "دورة شاملة في تعلم React.js مع مشاريع عملية. ستتعلم أساسيات React، إدارة الحالة، التوجيه، والعديد من المفاهيم المتقدمة.",
    instructor: {
      name: "أحمد محمد",
      avatar: "/images/avatar-1.png"
    },
    price: 29900,
    duration: "40 ساعة",
    level: "مبتدئ",
    studentsCount: 1250,
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-03-15"),
    type: "أونلاين",
    category: "تطوير الويب",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop", // React
    rating: 4.8,
    reviewCount: 156,
    institute: "أكاديمية التكنولوجيا",
  },
  {
    id: "2",
    title: "تصميم واجهات المستخدم",
    description: "تعلم مبادئ التصميم وأدوات التصميم الحديثة. اكتشف أسرار تجربة المستخدم وكيفية تصميم واجهات جذابة وعملية.",
    instructor: {
      name: "فاطمة علي",
      avatar: "/images/avatar-2.png"
    },
    price: 39900,
    duration: "30 ساعة",
    level: "متوسط",
    studentsCount: 850,
    startDate: new Date("2025-02-15"),
    endDate: new Date("2025-03-30"),
    type: "حضوري",
    category: "التصميم",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=800&auto=format&fit=crop", // UI/UX
    rating: 4.9,
    reviewCount: 89,
    institute: "معهد التصميم الرقمي",
  },
  {
    id: "3",
    title: "إدارة المشاريع الرقمية",
    description: "تعلم إدارة المشاريع الرقمية باستخدام أدوات حديثة. منهجية Agile و Scrum وكيفية قيادة الفرق التقنية بنجاح.",
    instructor: {
      name: "محمد حسن",
      avatar: "/images/avatar-3.png"
    },
    price: 49900,
    duration: "50 ساعة",
    level: "متقدم",
    studentsCount: 2100,
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-04-30"),
    type: "حضور وأونلاين",
    category: "إدارة الأعمال",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop", // Project Management
    rating: 4.7,
    reviewCount: 203,
    institute: "جامعة الأعمال",
  },
  {
    id: "4",
    title: "تعلم Python للمبتدئين",
    description: "دورة شاملة في لغة Python مع تطبيقات عملية. ابدأ رحلتك في عالم البرمجة مع واحدة من أكثر اللغات طلباً.",
    instructor: {
      name: "سارة خالد",
      avatar: "/images/avatar-1.png"
    },
    price: 24900,
    duration: "35 ساعة",
    level: "مبتدئ",
    studentsCount: 1500,
    startDate: new Date("2025-02-10"),
    endDate: new Date("2025-03-25"),
    type: "أونلاين",
    category: "تطوير البرمجيات",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop", // Python
    rating: 4.6,
    reviewCount: 120,
    institute: "أكاديمية البرمجة",
  },
  {
    id: "5",
    title: "التسويق الرقمي الشامل",
    description: "استراتيجيات التسويق الرقمي وإدارة الحملات الإعلانية. تعلم SEO و SEM والتسويق عبر وسائل التواصل الاجتماعي.",
    instructor: {
      name: "عمر يوسف",
      avatar: "/images/avatar-2.png"
    },
    price: 34900,
    duration: "28 ساعة",
    level: "متوسط",
    studentsCount: 950,
    startDate: new Date("2025-02-20"),
    endDate: new Date("2025-03-20"),
    type: "حضوري",
    category: "التسويق",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", // Marketing
    rating: 4.5,
    reviewCount: 95,
    institute: "معهد التسويق الحديث",
  },
  {
    id: "6",
    title: "تحليل البيانات باستخدام SQL",
    description: "تعلم قواعد البيانات وتحليل البيانات باستخدام SQL. مهارة أساسية لكل محلل بيانات ومطور.",
    instructor: {
      name: "نورة عبدالله",
      avatar: "/images/avatar-3.png"
    },
    price: 19900,
    duration: "25 ساعة",
    level: "مبتدئ",
    studentsCount: 1100,
    startDate: new Date("2025-03-05"),
    endDate: new Date("2025-03-30"),
    type: "أونلاين",
    category: "قواعد البيانات",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop", // Data/SQL
    institute: "أكاديمية البيانات",
    rating: 4.8,
    reviewCount: 140
  },
]

const categories = ["جميع الفئات", "تطوير الويب", "التصميم", "إدارة الأعمال", "تطوير البرمجيات", "التسويق", "قواعد البيانات"]
const deliveryTypes = ["أونلاين", "حضوري", "حضور وأونلاين"]

interface CoursesPageProps {
  basePath?: string
}

export default function CoursesPage({ basePath = "/courses" }: CoursesPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات")
  const [selectedDeliveryTypes, setSelectedDeliveryTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState("newest")
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (courseId: string) => {
    if (favorites.includes(courseId)) {
      setFavorites(favorites.filter(id => id !== courseId))
    } else {
      setFavorites([...favorites, courseId])
    }
  }

  const toggleDeliveryType = (type: string) => {
    if (selectedDeliveryTypes.includes(type)) {
      setSelectedDeliveryTypes(selectedDeliveryTypes.filter(t => t !== type))
    } else {
      setSelectedDeliveryTypes([...selectedDeliveryTypes, type])
    }
  }

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "جميع الفئات" || course.category === selectedCategory
    const matchesDelivery = selectedDeliveryTypes.length === 0 || selectedDeliveryTypes.includes(course.type)
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesDelivery && matchesPrice
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "price-high": return b.price - a.price
      default: return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-muted/30 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">استكشف الدورات التدريبية</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            تصفح مئات الدورات التدريبية في مختلف المجالات واكتسب مهارات جديدة
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="glass-card p-6 rounded-xl sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">تصفية النتائج</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9 bg-white/50"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">الفئة</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`text-sm hover:text-primary transition-colors ${selectedCategory === category ? "text-primary font-bold" : "text-muted-foreground"
                          }`}
                      >
                        {category}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Type */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">نوع الحضور</h3>
                <div className="space-y-2">
                  {deliveryTypes.map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={selectedDeliveryTypes.includes(type)}
                        onCheckedChange={() => toggleDeliveryType(type)}
                      />
                      <label htmlFor={type} className="text-sm cursor-pointer select-none">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">السعر</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={0}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} ريال</span>
                  <span>{priceRange[1]} ريال</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                تم العثور على <span className="font-bold text-foreground">{sortedCourses.length}</span> دورة
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white/50">
                  <SelectValue placeholder="الترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">السعر: الأقل</SelectItem>
                  <SelectItem value="price-high">السعر: الأعلى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <CourseCard key={course.id} {...course} basePath={basePath} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
