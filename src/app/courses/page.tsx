"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, BookOpen, Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { studentService } from "@/lib/student-service"
import { ExploreCourse, trainerService } from "@/lib/trainer-service"
import { getFileUrl } from "@/lib/utils"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const sortOptions = ["الأحدث", "الأقدم", "الأعلى سعراً", "الأقل سعراً"]
const priceOptions = [
  "كل الأسعار",
  "أقل من 25,000 ر.ي",
  "25,000 - 50,000 ر.ي",
  "50,000 - 100,000 ر.ي",
  "أعلى من 100,000 ر.ي",
]

function resolveImage(src: string | null): string {
  return getFileUrl(src) || "/images/course-web.png"
}

interface CoursesPageProps {
  basePath?: string
}

export default function CoursesPage({ basePath = "/courses" }: CoursesPageProps) {
  const searchParams = useSearchParams()
  const { user } = useAuth() ?? {}

  const [courses, setCourses] = useState<ExploreCourse[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([{ id: "all", name: "الكل" }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchFromUrl = searchParams.get("search")?.trim() ?? ""
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [selectedSort, setSelectedSort] = useState("الأحدث")
  const [selectedPrice, setSelectedPrice] = useState("كل الأسعار")
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    trainerService
      .getExploreCourses({ search: searchFromUrl })
      .then((data) => {
        setCourses(data.courses)
        setCategories(data.categories)
      })
      .catch(() => setError("فشل تحميل الدورات. يرجى المحاولة مرة أخرى."))
      .finally(() => setLoading(false))
  }, [searchFromUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!user?.id) {
        setFavoriteIds([])
        return
    }
    studentService
      .getWishlist()
      .then((data: Array<{ id: string }>) => {
        setFavoriteIds(data.map((item) => item.id))
      })
      .catch(() => {})
  }, [user?.id])

  const toggleFavorite = async (id: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!user?.id) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    try {
      const result = await studentService.toggleWishlist(id)
      setFavoriteIds((prev) => (result.added ? [...prev, id] : prev.filter((item) => item !== id)))
      toast.success(result.added ? "تمت إضافة الدورة إلى قائمة الرغبات" : "تمت إزالة الدورة من قائمة الرغبات")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء تحديث قائمة الرغبات"
      toast.error(message)
    }
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === "الكل" || course.category === selectedCategory

      const matchesPrice =
        selectedPrice === "كل الأسعار" ||
        (selectedPrice === "أقل من 25,000 ر.ي" && course.price < 25000) ||
        (selectedPrice === "25,000 - 50,000 ر.ي" && course.price >= 25000 && course.price <= 50000) ||
        (selectedPrice === "50,000 - 100,000 ر.ي" && course.price >= 50000 && course.price <= 100000) ||
        (selectedPrice === "أعلى من 100,000 ر.ي" && course.price > 100000)

      return matchesCategory && matchesPrice
    })
  }, [courses, selectedCategory, selectedPrice])

  const visibleCourses = useMemo(() => {
    const sorted = [...filteredCourses]
    if (selectedSort === "الأحدث") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (selectedSort === "الأقدم") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (selectedSort === "الأعلى سعراً") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (selectedSort === "الأقل سعراً") {
      sorted.sort((a, b) => a.price - b.price)
    }
    return sorted
  }, [filteredCourses, selectedSort])

  return (
    <section dir="rtl" className="w-full text-right pt-2 pb-12">
      <div className="w-full max-w-7xl mx-auto space-y-3 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-start gap-3 text-right border-b border-slate-100 pb-4 dark:border-border">
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
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
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

          {!loading && (
            <span className="ml-auto flex-shrink-0 whitespace-nowrap text-right text-sm text-slate-500">
              تم العثور على <span className="font-semibold text-slate-900 dark:text-white">{visibleCourses.length}</span> دورة
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span className="text-lg">جاري تحميل الدورات...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-red-500">
            <AlertCircle className="h-10 w-10" />
            <p>{error}</p>
            <Button variant="outline" onClick={fetchData}>
              إعادة المحاولة
            </Button>
          </div>
        )}

        {!loading && !error && visibleCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
            <BookOpen className="h-12 w-12" />
            <p className="text-lg">{searchFromUrl || selectedCategory !== "الكل" ? "لا توجد نتائج تطابق بحثك" : "لا توجد دورات نشطة حالياً"}</p>
          </div>
        )}

        {!loading && !error && visibleCourses.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visibleCourses.map((course) => (
              <article
                key={course.id}
                dir="rtl"
                className="flex w-full items-start gap-5 rounded-2xl border border-slate-100 bg-white p-4 text-right shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-md dark:border-border dark:bg-card"
              >
                <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={resolveImage(course.image)}
                    alt={course.title}
                    fill
                    sizes="200px"
                    className="h-full w-full object-cover"
                    unoptimized
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/images/course-web.png"
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(course.id, e)}
                    aria-label="إضافة إلى المفضلة"
                    className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm ring-1 ring-slate-200/60 transition-transform duration-150 ${
                      favoriteIds.includes(course.id) ? "scale-105 text-red-600" : "hover:text-red-600"
                    }`}
                  >
                    <Heart className={`h-4 w-4 transition-opacity ${favoriteIds.includes(course.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="flex h-[200px] min-w-0 flex-1 flex-col text-right">
                  <div className="space-y-1">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-muted dark:text-slate-300">
                      {course.category}
                    </span>
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900 dark:text-white">
                      <Link href={`${basePath}/${course.id}`} className="hover:text-blue-600 transition-colors">
                        {course.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-2 text-sm text-slate-500">{course.shortDescription || course.description}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      {course.trainer.avatar ? (
                        <Image
                          src={resolveImage(course.trainer.avatar)}
                          alt={course.trainer.name}
                          fill
                          sizes="24px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500">{course.trainer.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{course.trainer.name}</span>
                  </div>

                  <div className="mt-auto flex w-full flex-wrap items-center justify-start gap-2 pt-3">
                    {course.price === 0 ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        مجاني
                      </span>
                    ) : (
                      <Price
                        data-testid="course-price-badge"
                        value={course.price}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      />
                    )}
                    <Button asChild className="h-9 rounded-full bg-blue-600 px-5 text-sm text-white hover:bg-blue-700">
                      <Link href={`${basePath}/${course.id}`} className="inline-flex items-center gap-2">
                        <span>عرض التفاصيل</span>
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
