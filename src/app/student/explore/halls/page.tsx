"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Search, Users, Wifi, Projector, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const hallTypes = [
  "الكل",
  "قاعة محاضرات",
  "قاعة اجتماعات",
  "معمل"
]

const capacityOptions = [
  "كل السعات",
  "حتى 20",
  "21 - 40",
  "41 - 60",
  "أكثر من 60"
]

const locationOptions = [
  "كل المواقع",
  "الدور الأرضي",
  "الدور الأول",
  "الدور الثاني",
  "الجناح الشرقي",
  "الجناح الغربي"
]

const halls = [
  {
    id: "hall-1",
    name: "القاعة الرئيسية",
    type: "قاعة محاضرات",
    location: "الدور الأرضي • الجناح الشرقي",
    capacity: 80,
    hourlyRate: 18000,
    image: "https://images.unsplash.com/photo-1760121788536-9797394e210e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "projector", "screen"],
    description: "قاعة واسعة للمحاضرات والفعاليات الكبرى مع تجهيزات عرض متكاملة."
  },
  {
    id: "hall-2",
    name: "قاعة الاجتماعات الذكية",
    type: "قاعة اجتماعات",
    location: "الدور الأول • الجناح الغربي",
    capacity: 18,
    hourlyRate: 12000,
    image: "https://images.unsplash.com/photo-1766802981801-4b4a9a1d8f1c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "screen"],
    description: "مساحة مريحة لاجتماعات الفرق مع شاشة تفاعلية وإضاءة هادئة."
  },
  {
    id: "hall-3",
    name: "معمل الحاسب المتقدم",
    type: "معمل",
    location: "الدور الثاني • الجناح الشرقي",
    capacity: 30,
    hourlyRate: 15000,
    image: "https://images.unsplash.com/photo-1725274032244-9a8f0fa1e9a7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "projector", "computers"],
    description: "معمل مجهز لأعمال التدريب العملي مع أجهزة حديثة وشبكة قوية."
  },
  {
    id: "hall-4",
    name: "قاعة التدريب (ج)",
    type: "قاعة محاضرات",
    location: "الدور الأول • الجناح الشرقي",
    capacity: 40,
    hourlyRate: 14000,
    image: "https://images.unsplash.com/photo-1670348060135-d4c6662b4138?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    features: ["wifi", "projector"],
    description: "قاعة متوسطة مناسبة للدورات وورش العمل القصيرة."
  }
]

const featureMap: Record<string, { label: string; icon: JSX.Element }> = {
  wifi: { label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  projector: { label: "بروجكتر", icon: <Projector className="h-4 w-4" /> },
  screen: { label: "شاشة", icon: <Monitor className="h-4 w-4" /> },
  computers: { label: "أجهزة", icon: <Monitor className="h-4 w-4" /> }
}

type HallItem = (typeof halls)[number]

export default function ExploreHallsPage({
  hideTitle = false,
  basePath = "/student/explore/halls",
  actionLabel = "عرض التفاصيل",
  onSelectHall,
  hallsData,
  stickyHeader = false,
}: {
  hideTitle?: boolean
  basePath?: string
  actionLabel?: string
  onSelectHall?: (hallId: string) => void
  hallsData?: typeof halls
  stickyHeader?: boolean
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("الكل")
  const [selectedCapacity, setSelectedCapacity] = useState("كل السعات")
  const [selectedLocation, setSelectedLocation] = useState("كل المواقع")
  const searchParams = useSearchParams()
  const isSelectMode = searchParams.get("mode") === "select"
  const effectiveActionLabel = isSelectMode ? "اختيار القاعة" : actionLabel

  const sourceHalls = hallsData ?? halls

  const filteredHalls = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return sourceHalls.filter((hall) => {
      const matchesSearch =
        query.length === 0 ||
        hall.name.toLowerCase().includes(query) ||
        hall.description.toLowerCase().includes(query)

      const matchesType = selectedType === "الكل" || hall.type === selectedType

      const matchesLocation =
        selectedLocation === "كل المواقع" || hall.location.includes(selectedLocation)

      const matchesCapacity =
        selectedCapacity === "كل السعات" ||
        (selectedCapacity === "حتى 20" && hall.capacity <= 20) ||
        (selectedCapacity === "21 - 40" && hall.capacity >= 21 && hall.capacity <= 40) ||
        (selectedCapacity === "41 - 60" && hall.capacity >= 41 && hall.capacity <= 60) ||
        (selectedCapacity === "أكثر من 60" && hall.capacity > 60)

      return matchesSearch && matchesType && matchesLocation && matchesCapacity
    })
  }, [searchQuery, selectedCapacity, selectedLocation, selectedType, sourceHalls])

  const handleSelectHall = (hall: HallItem) => {
    if (isSelectMode) {
      if (typeof window === "undefined") return
      const message = {
        type: "hall-selected",
        payload: {
          id: hall.id,
          name: hall.name,
          type: hall.type,
          location: hall.location,
          capacity: hall.capacity,
          hourlyRate: hall.hourlyRate,
          image: hall.image,
          description: hall.description
        }
      }
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(message, window.location.origin)
      }
      window.close()
      return
    }

    if (onSelectHall) {
      onSelectHall(hall.id)
    }
  }

  const usesSelectButton = isSelectMode || Boolean(onSelectHall)

  return (
    <section dir="rtl" className="w-full text-right">
      {!hideTitle && (
        <div className="w-full max-w-[1200px] mr-0 ml-auto text-right">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-right leading-tight mb-1">
            دليل القاعات
          </h1>
        </div>
      )}

      <div className="w-full max-w-[1200px] mr-0 ml-auto mt-2 space-y-3">
        <div
          className={cn(
            "flex flex-wrap items-center justify-start gap-3 text-right border-b border-slate-100 pb-2",
            stickyHeader && "sticky top-0 z-20 bg-white/95 backdrop-blur-sm pt-3"
          )}
        >
          <div className="relative flex-1 min-w-[260px] max-w-[520px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث باسم القاعة..."
              className="h-11 rounded-full bg-white pr-4 pl-10 text-sm text-right"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="نوع القاعة" />
            </SelectTrigger>
            <SelectContent>
              {hallTypes.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="السعة" />
            </SelectTrigger>
            <SelectContent>
              {capacityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الموقع" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-slate-500 whitespace-nowrap text-right ml-auto flex-shrink-0">
            تم العثور على{" "}
            <span className="font-semibold text-slate-900">{filteredHalls.length}</span>{" "}
            قاعة
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 justify-items-end">
          {filteredHalls.map((hall) => (
            <div
              key={hall.id}
              dir="rtl"
              className="w-[592px] max-w-full h-[292px] justify-self-end rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] text-right flex items-start gap-5"
            >
              <div className="relative h-[260px] w-[260px] shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={hall.image}
                  alt={hall.name}
                  fill
                  sizes="260px"
                  className="h-full w-full object-cover"
                  style={{ display: "block" }}
                />
              </div>

              <div className="flex h-[260px] flex-1 min-w-0 flex-col text-right">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {hall.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {hall.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 min-h-[42px]">
                    {hall.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-start gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{hall.location}</span>
                </div>

                <div className="mt-2 flex items-center justify-start gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  <span>السعة: {hall.capacity} شخص</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-start gap-2 text-xs text-slate-600">
                  {hall.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"
                    >
                      {featureMap[feature]?.icon}
                      {featureMap[feature]?.label}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex w-full items-center justify-between pt-3">
                  <span className="inline-flex h-9 items-center rounded-full bg-blue-50 px-3 text-sm font-bold text-blue-700">
                    {hall.hourlyRate} ر.ي / ساعة
                  </span>
                  {usesSelectButton ? (
                    <Button
                      type="button"
                      onClick={() => handleSelectHall(hall)}
                      className="h-9 rounded-full bg-blue-600 px-5 text-sm text-white hover:bg-blue-700"
                    >
                      {effectiveActionLabel}
                    </Button>
                  ) : (
                    <Button asChild className="h-9 rounded-full bg-blue-600 px-5 text-sm text-white hover:bg-blue-700">
                      <Link href={`${basePath}/${hall.id}`}>{effectiveActionLabel}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHalls.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            لا توجد قاعات مطابقة لخيارات البحث الحالية.
          </div>
        )}
      </div>
    </section>
  )
}

