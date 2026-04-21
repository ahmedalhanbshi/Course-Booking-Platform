"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BookOpen, Building2, MapPin, Users, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { instituteService } from "@/lib/institute-service"
import { getFileUrl } from "@/lib/utils"

type PublicInstitute = {
  id: string
  name: string
  description?: string
  location?: string
  logo?: string | null
  coverImage?: string | null
  categories: string[]
  studentsCount: number
  coursesCount: number
  staffCount?: number
}

const formatNumber = (value: number) => new Intl.NumberFormat("ar").format(value)

function InstitutesContent() {
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get("search")?.trim() ?? ""
  const [institutes, setInstitutes] = useState<PublicInstitute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    instituteService
      .getPublicInstitutes()
      .then((data: PublicInstitute[]) => setInstitutes(data))
      .catch((error) => console.error("Failed to fetch institutes:", error))
      .finally(() => setLoading(false))
  }, [])

  const filteredInstitutes = useMemo(() => {
    const query = searchFromUrl.toLowerCase()
    if (!query) return institutes

    return institutes.filter((institute) => {
      const name = institute.name?.toLowerCase() ?? ""
      const description = institute.description?.toLowerCase() ?? ""
      const location = institute.location?.toLowerCase() ?? ""
      return name.includes(query) || description.includes(query) || location.includes(query)
    })
  }, [institutes, searchFromUrl])

  const summary = useMemo(() => {
    return filteredInstitutes.reduce(
      (acc, institute) => {
        acc.courses += institute.coursesCount || 0
        acc.students += institute.studentsCount || 0
        return acc
      },
      { courses: 0, students: 0 }
    )
  }, [filteredInstitutes])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950" dir="rtl">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
        {/* Literal copy of student institutes header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-l from-slate-50 via-white to-blue-50 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
          <div className="pointer-events-none absolute -top-16 left-0 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/20" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">استكشف المعاهد المعتمدة</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                اختر الجهة التدريبية المناسبة حسب عدد الدورات، عدد المتدربين، ومجالات التخصص المتاحة.
              </p>
              {searchFromUrl && (
                <p className="mt-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                  نتائج البحث عن: <span className="font-bold">{searchFromUrl}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-[11px] font-semibold text-slate-500">المعاهد المعروضة</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(filteredInstitutes.length)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-[11px] font-semibold text-slate-500">إجمالي الدورات</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(summary.courses)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-[11px] font-semibold text-slate-500">إجمالي المتدربين</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">{formatNumber(summary.students)}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="overflow-hidden rounded-3xl border-slate-200">
                <div className="h-24 animate-pulse bg-slate-200 dark:bg-slate-800" />
                <CardContent className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredInstitutes.length > 0 ? (
              filteredInstitutes.map((institute) => {
                const description = institute.description?.trim() || "لم تتم إضافة وصف للمعهد بعد"
                const categories = institute.categories?.filter(Boolean) ?? []
                const primaryImage = institute.logo || institute.coverImage

                return (
                  <Card
                    key={institute.id}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
                  >
                    <div className="relative h-24 overflow-hidden border-b border-slate-100 bg-gradient-to-l from-slate-100 via-blue-50 to-slate-100 dark:border-slate-800 dark:from-slate-800 dark:via-blue-950/40 dark:to-slate-800">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_55%)]" />
                    </div>

                    <div className="absolute right-4 top-12 z-10 h-20 w-20 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md dark:border-slate-900 dark:bg-slate-800">
                      {primaryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getFileUrl(primaryImage)}
                          alt={institute.name}
                          className="h-full w-full object-contain p-1.5"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Building2 className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <CardContent className="space-y-4 p-5 pt-10">
                      <div className="space-y-2">
                        <h3 className="line-clamp-2 pl-24 text-xl font-black leading-tight text-slate-900 dark:text-slate-100">
                          {institute.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="line-clamp-1">{institute.location || "غير محدد"}</span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                          <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="text-[11px] font-semibold">الدورات</span>
                          </div>
                          <p className="text-lg font-black text-slate-900 dark:text-slate-100">{formatNumber(institute.coursesCount || 0)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                          <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                            <Users className="h-4 w-4 text-emerald-600" />
                            <span className="text-[11px] font-semibold">المتدربون</span>
                          </div>
                          <p className="text-lg font-black text-slate-900 dark:text-slate-100">{formatNumber(institute.studentsCount || 0)}</p>
                        </div>
                      </div>

                      <div className="flex min-h-[34px] flex-wrap gap-1.5">
                        {categories.length > 0 ? (
                          <>
                            {categories.slice(0, 3).map((category) => (
                              <Badge key={category} variant="secondary" className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                                {category}
                              </Badge>
                            ))}
                            {categories.length > 3 && (
                              <Badge variant="secondary" className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                +{categories.length - 3}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <Badge variant="secondary" className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            بدون تصنيفات معلنة
                          </Badge>
                        )}
                      </div>

                      <Button asChild className="h-11 w-full rounded-2xl bg-slate-950 text-sm font-bold hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
                        <Link href={`/institutes/${institute.id}`} className="inline-flex items-center justify-center">
                          عرض التفاصيل الكاملة
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">لا توجد نتائج مطابقة</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">جرب تعديل كلمات البحث أو إزالة الفلتر الحالي.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function InstitutesPage() {
  return (
    <Suspense fallback={null}>
      <InstitutesContent />
    </Suspense>
  )
}
