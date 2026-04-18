"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Price } from "@/components/ui/price"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { instituteService } from "@/lib/institute-service"
import { getFileUrl } from "@/lib/utils"

type InstituteCourse = {
  id: string
  title: string
  image?: string | null
  category?: string
  price: number
  students?: number
  trainer?: {
    name: string
  }
}

type InstituteTrainer = {
  id: string
  name: string
  role?: string
  avatar?: string | null
}

type PublicInstituteDetails = {
  id: string
  name: string
  description?: string
  location?: string
  website?: string
  email?: string
  phone?: string
  logo?: string | null
  coverImage?: string | null
  features: string[]
  studentsCount: number
  coursesCount: number
  courses: InstituteCourse[]
  trainers?: InstituteTrainer[]
}

const withProtocol = (value?: string) => {
  if (!value) return ""
  const normalized = value.trim().replace(/^\/+/, "")
  if (!normalized) return ""
  return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`
}

const toDomainLabel = (value?: string) => {
  const href = withProtocol(value)
  if (!href) return ""
  try {
    return new URL(href).hostname.replace(/^www\./i, "")
  } catch {
    return value?.replace(/^\/+/, "").replace(/^https?:\/\//i, "") ?? ""
  }
}

const looksLikeUrl = (value?: string) => {
  if (!value) return false
  const testValue = value.trim()
  return /^https?:\/\//i.test(testValue) || /^www\./i.test(testValue) || /maps\.app|google\.com\/maps|goo\.gl\/maps|%2f|%3a/i.test(testValue)
}

const toMapLabel = (value?: string) => {
  if (!value) return ""
  const cleaned = value.trim()
  if (!cleaned) return ""
  if (looksLikeUrl(cleaned) || cleaned.length > 70) return "عرض موقع المعهد على الخريطة"
  return cleaned
}

const formatNumber = (value: number) => new Intl.NumberFormat("ar").format(value)

export default function StudentInstituteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [instituteData, setInstituteData] = useState<PublicInstituteDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    instituteService
      .getPublicInstituteById(id)
      .then((data: PublicInstituteDetails) => setInstituteData(data))
      .catch(() => setError("لم يتم العثور على المعهد"))
      .finally(() => setLoading(false))
  }, [id])

  const websiteHref = useMemo(() => withProtocol(instituteData?.website), [instituteData?.website])
  const websiteLabel = useMemo(() => toDomainLabel(instituteData?.website), [instituteData?.website])
  const locationHref = useMemo(
    () => (looksLikeUrl(instituteData?.location) ? withProtocol(instituteData?.location) : ""),
    [instituteData?.location]
  )
  const locationLabel = useMemo(() => toMapLabel(instituteData?.location), [instituteData?.location])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4" dir="rtl">
        <Card className="overflow-hidden rounded-3xl border-slate-200">
          <div className="h-28 animate-pulse bg-slate-200 dark:bg-slate-800" />
          <CardContent className="space-y-4 p-6">
            <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !instituteData) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center" dir="rtl">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">عذرًا</h2>
        <p className="mb-6 text-slate-500">{error || "هذا المعهد غير موجود"}</p>
      </div>
    )
  }

  const description = instituteData.description?.trim() || "لم تتم إضافة وصف للمعهد بعد"
  const hasLocation = Boolean(locationLabel)
  const hasWebsite = Boolean(websiteHref)
  const hasEmail = Boolean(instituteData.email)
  const hasPhone = Boolean(instituteData.phone)
  const trainers = instituteData.trainers ?? []

  return (
    <section dir="rtl" className="mx-auto w-full max-w-7xl space-y-6">
      <Card className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-28 w-full bg-gradient-to-l from-slate-100 via-blue-50 to-slate-100 dark:from-slate-800 dark:via-blue-950/40 dark:to-slate-800" />

        <CardContent className="relative p-5 pt-0 md:p-7 md:pt-0">
          <div className="absolute left-4 top-0 -translate-y-1/2 md:left-7">
            <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg dark:border-slate-900 dark:bg-slate-800 md:h-36 md:w-36">
              {instituteData.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getFileUrl(instituteData.logo)} alt={instituteData.name} className="h-full w-full object-contain p-0.5" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <Building2 className="h-7 w-7" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 pt-16 md:pt-6">
            <div className="pl-0 md:pl-44">
              <h1 className="text-2xl font-bold leading-tight text-slate-900 md:text-4xl dark:text-white">{instituteData.name}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">{description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-[11px] font-semibold text-slate-500">الدورات</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(instituteData.coursesCount || 0)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-[11px] font-semibold text-slate-500">المتدربون</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(instituteData.studentsCount || 0)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {hasLocation && (
                locationHref ? (
                  <a
                    href={locationHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{locationLabel}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <MapPin className="h-4 w-4" />
                    {locationLabel}
                  </span>
                )
              )}

              {hasWebsite && (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                >
                  <Globe className="h-4 w-4" />
                  <span dir="ltr">{websiteLabel || "الموقع الإلكتروني"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {hasEmail && (
                <a
                  href={`mailto:${instituteData.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                >
                  <Mail className="h-4 w-4" />
                  <span dir="ltr">{instituteData.email}</span>
                </a>
              )}

              {hasPhone && (
                <a
                  href={`tel:${instituteData.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                >
                  <Phone className="h-4 w-4" />
                  <span dir="ltr">{instituteData.phone}</span>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl border-slate-200 lg:col-span-2 dark:border-slate-800">
          <CardContent className="space-y-4 p-5 md:p-6">
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
                <TabsTrigger value="courses" className="rounded-xl py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100">
                  الدورات المتاحة
                </TabsTrigger>
                <TabsTrigger value="trainers" className="rounded-xl py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100">
                  المدربون
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="mt-4 space-y-3">
                <div className="mb-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {formatNumber(instituteData.courses?.length || 0)} دورة
                </div>

                {instituteData.courses?.length ? (
                  <div className="space-y-3">
                    {instituteData.courses.map((course) => (
                      <Card key={course.id} className="overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row-reverse md:items-stretch">
                          <div className="relative h-44 w-full shrink-0 bg-slate-100 md:h-auto md:w-52">
                            {course.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={getFileUrl(course.image)} alt={course.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Building2 className="h-9 w-9" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 p-4 text-right flex flex-col">
                            {course.category && (
                              <div className="mb-2">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-muted dark:text-slate-300">
                                  {course.category}
                                </span>
                              </div>
                            )}
                            <h3 className="line-clamp-2 text-base font-bold text-slate-900 dark:text-white">{course.title}</h3>
                            {course.trainer && (
                              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">المدرب: {course.trainer.name}</p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {course.students ?? 0} طالب
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                يبدأ قريبًا
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center gap-3 p-4 pt-0 md:w-[180px] md:border-r md:border-slate-100 md:p-4 dark:md:border-slate-800">
                            <div className="flex w-full justify-center">
                              {course.price === 0 ? (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-base font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  مجاني
                                </span>
                              ) : (
                                <Price
                                  value={course.price || 0}
                                  className="rounded-full bg-blue-50/80 px-4 py-1 text-base font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                />
                              )}
                            </div>
                            <Button asChild className="h-10 w-full rounded-full bg-slate-900 px-6 text-sm font-semibold shadow-sm hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white">
                              <Link href={`/student/courses/${course.id}`}>عرض الدورة</Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    لا توجد دورات متاحة حاليًا.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trainers" className="mt-4 space-y-3">
                <div className="mb-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {formatNumber(trainers.length)} مدرب
                </div>

                {trainers.length ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {trainers.map((trainer) => (
                      <Card key={trainer.id} className="rounded-2xl border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700">
                              <AvatarImage src={trainer.avatar ? getFileUrl(trainer.avatar) : undefined} alt={trainer.name} />
                              <AvatarFallback className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {trainer.name?.charAt(0) || "م"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 text-right">
                              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{trainer.name}</p>
                              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{trainer.role || "مدرب"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    لا يوجد مدربون معلنون حاليًا.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800">
          <CardContent className="space-y-4 p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">مميزات المعهد</h2>

            {instituteData.features?.length ? (
              <ul className="space-y-2.5">
                {instituteData.features.map((feature, index) => (
                  <li
                    key={`${feature}-${index}`}
                    className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                لا توجد مميزات معلنة حاليًا.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
