"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  "الكل",
  "إدارة أعمال",
  "برمجة وتطوير",
  "تسويق إلكتروني",
  "تصميم وجرافيك",
  "لغات وترجمة",
]

const courses = [
  {
    id: "1",
    title: "أساسيات برمجة الويب الحديثة",
    description: "تعلم بناء مواقع تفاعلية باستخدام أحدث أدوات تطوير الويب بخطوات عملية.",
    category: "برمجة وتطوير",
    image: "/images/course-web.png",
    studentsCount: 0,
    duration: "غير محدد",
    trainer: {
      name: "Admin Trainer",
      avatar: "/images/avatar-1.png",
    },
    price: 30000,
    type: "أونلاين",
    createdAt: "2025-12-05",
  },
  {
    id: "2",
    title: "تصميم واجهات المستخدم الاحترافية",
    description: "خطوات عملية لتصميم واجهات جذابة ومتوافقة مع تجربة المستخدم.",
    category: "برمجة وتطوير",
    image: "/images/course-design.png",
    studentsCount: 0,
    duration: "غير محدد",
    trainer: {
      name: "Admin Trainer",
      avatar: "/images/avatar-2.png",
    },
    price: 50000,
    type: "أونلاين",
    createdAt: "2025-11-20",
  },
  {
    id: "3",
    title: "أساسيات تحليل البيانات",
    description: "تعلم تحليل البيانات وبناء تقارير تساعد على اتخاذ قرارات أفضل.",
    category: "إدارة أعمال",
    image: "/images/course-web.png",
    studentsCount: 0,
    duration: "غير محدد",
    trainer: {
      name: "محمد علي",
      avatar: "/images/avatar-3.png",
    },
    price: 18000,
    type: "مدمج",
    createdAt: "2025-12-01",
  },
  {
    id: "4",
    title: "إدارة المشاريع بأسلوب عملي",
    description: "من التخطيط إلى التنفيذ، تعلم إدارة المشاريع خطوة بخطوة.",
    category: "إدارة أعمال",
    image: "/images/course-abstract.svg",
    studentsCount: 0,
    duration: "غير محدد",
    trainer: {
      name: "ليلى حسن",
      avatar: "/images/avatar-2.png",
    },
    price: 22000,
    type: "أونلاين",
    createdAt: "2025-12-10",
  },
  {
    id: "6",
    title: "تحليل البيانات باستخدام SQL",
    description: "دورة عملية تركز على مهارات SQL الأساسية والمتقدمة لتحليل البيانات وبناء التقارير.",
    category: "إدارة أعمال",
    image: "/images/course-web.png",
    studentsCount: 0,
    duration: "غير محدد",
    trainer: {
      name: "أحمد محمد",
      avatar: "/images/avatar-1.png",
    },
    price: 19900,
    type: "أونلاين",
    createdAt: "2025-12-15",
  },
]

const sortOptions = ["الأحدث", "الأقدم"]
const priceOptions = [
  "كل الأسعار",
  "أقل من 25,000 ر.ي",
  "25,000 - 50,000 ر.ي",
  "50,000 - 100,000 ر.ي",
  "أعلى من 100,000 ر.ي",
]

export default function StudentCoursesPage({
  basePath = "/student/explore/course"
}: {
  basePath?: string
} = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [selectedSort, setSelectedSort] = useState("الأحدث")
  const [selectedPrice, setSelectedPrice] = useState("كل الأسعار")
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  const formatPrice = (value: number) =>
    `${new Intl.NumberFormat("en-US").format(value)} ر.ي`

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return courses.filter((course) => {
      const matchesSearch =
        query.length === 0 ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)

      const matchesCategory =
        selectedCategory === "الكل" || course.category === selectedCategory


      const matchesPrice =
        selectedPrice === "كل الأسعار" ||
        (selectedPrice === "أقل من 25,000 ر.ي" && course.price < 25000) ||
        (selectedPrice === "25,000 - 50,000 ر.ي" &&
          course.price >= 25000 &&
          course.price <= 50000) ||
        (selectedPrice === "50,000 - 100,000 ر.ي" &&
          course.price >= 50000 &&
          course.price <= 100000) ||
        (selectedPrice === "أعلى من 100,000 ر.ي" && course.price > 100000)

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchQuery, selectedCategory, selectedPrice])

  const visibleCourses = useMemo(() => {
    const sorted = [...filteredCourses]
    if (selectedSort === "الأحدث") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    }
    return sorted
  }, [filteredCourses, selectedSort])

  return (
    <section dir="rtl" className="w-full text-right">
      <div className="w-full max-w-[1200px] mr-0 ml-auto text-right">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-right leading-tight mb-1">
          استكشف الدورات التدريبية
        </h1>
      </div>

      <div className="w-full max-w-[1200px] mr-0 ml-auto mt-2 space-y-3">
        <div className="flex flex-wrap items-center justify-start gap-3 text-right border-b border-slate-100 pb-2">
          <div className="relative flex-1 min-w-[260px] max-w-[520px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث عن دورة أو مهارة..."
              className="h-11 rounded-full bg-white pr-4 pl-10 text-sm text-right"
            />
          </div>

          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الأحدث" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="كل الفئات" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPrice} onValueChange={setSelectedPrice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="كل الأسعار" />
            </SelectTrigger>
            <SelectContent>
              {priceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-slate-500 whitespace-nowrap text-right ml-auto flex-shrink-0">
            تم العثور على{" "}
            <span className="font-semibold text-slate-900">
              {visibleCourses.length}
            </span>{" "}
            دورة
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 justify-items-end">
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              dir="rtl"
              className="w-[592px] max-w-full h-[292px] justify-self-end rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] text-right flex items-start gap-5"
            >
              <div className="relative h-[260px] w-[260px] shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="260px"
                  className="h-full w-full object-cover"
                  style={{ display: "block" }}
                />
                <button
                  type="button"
                  onClick={() => toggleFavorite(course.id)}
                  aria-label="إضافة إلى المفضلة"
                  className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm ring-1 ring-slate-200/60 transition-transform duration-150 ${
                    favoriteIds.includes(course.id)
                      ? "text-red-600 scale-105"
                      : "hover:text-red-600"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-opacity ${
                      favoriteIds.includes(course.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex h-[260px] flex-1 min-w-0 flex-col text-right">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {course.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 min-h-[42px]">
                    {course.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-start gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border border-slate-200">
                    <Image
                      src={course.trainer.avatar}
                      alt={course.trainer.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {course.trainer.name}
                  </span>
                </div>

                <div className="mt-auto flex w-full flex-wrap items-center justify-start gap-2 pt-3">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                    {formatPrice(course.price)}
                  </span>
                  <Button
                    asChild
                    className="h-9 rounded-full bg-blue-600 px-5 text-sm text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Link href={`${basePath}/${course.id}`}>
                      <span>
                        {"\u0639\u0631\u0636 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644"}
                      </span>
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

