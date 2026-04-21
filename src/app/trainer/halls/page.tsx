"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { cn, getFileUrl } from "@/lib/utils"
import { HallCard } from "@/components/halls/HallCard"
import { trainerService } from "@/lib/trainer-service"

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

type TrainerHallsPageProps = {
    hideTitle?: boolean
    basePath?: string
    actionLabel?: string
    onSelectHall?: (hallId: string) => void
    hallsData?: any[]
    stickyHeader?: boolean
}

function TrainerHallsPageContent({
    hideTitle = false,
    basePath = "/trainer/halls",
    actionLabel = "عرض التفاصيل",
    onSelectHall,
    hallsData,
    stickyHeader = false,
}: TrainerHallsPageProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("الكل")
    const [selectedCapacity, setSelectedCapacity] = useState("كل السعات")
    const [selectedLocation, setSelectedLocation] = useState("كل المواقع")
    const searchParams = useSearchParams()
    const isSelectMode = searchParams.get("mode") === "select"
    const effectiveActionLabel = isSelectMode ? "اختيار القاعة" : actionLabel

    const [dbHalls, setDbHalls] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (hallsData) return

        const fetchHalls = async () => {
            try {
                setLoading(true)
                const responseData = await trainerService.getHalls()
                const mapped = responseData.map((h: any) => ({
                    ...h,
                    id: h.id,
                    name: h.name,
                    type: h.type || "قاعة محاضرات",
                    location: h.location || "غير محدد",
                    capacity: h.capacity || 0,
                    hourlyRate: Number(h.pricePerHour || 0),
                    image: getFileUrl(h.image),
                    features: h.facilities || [],
                    description: h.description || "لا يوجد وصف",
                    owner: h.institute?.name || "معهد التدريب"
                }))
                setDbHalls(mapped)
            } catch (e) {
                console.error("Failed to fetch halls", e)
            } finally {
                setLoading(false)
            }
        }
        fetchHalls()
    }, [hallsData])

    const sourceHalls = hallsData ?? dbHalls

    const filteredHalls = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        return sourceHalls.filter((hall) => {
            const matchesSearch =
                query.length === 0 ||
                hall.name.toLowerCase().includes(query) ||
                hall.description?.toLowerCase().includes(query)

            const matchesType = selectedType === "الكل" || hall.type === selectedType

            const matchesLocation =
                selectedLocation === "كل المواقع" || hall.location?.includes(selectedLocation)

            const matchesCapacity =
                selectedCapacity === "كل السعات" ||
                (selectedCapacity === "حتى 20" && hall.capacity <= 20) ||
                (selectedCapacity === "21 - 40" && hall.capacity >= 21 && hall.capacity <= 40) ||
                (selectedCapacity === "41 - 60" && hall.capacity >= 41 && hall.capacity <= 60) ||
                (selectedCapacity === "أكثر من 60" && hall.capacity > 60)

            return matchesSearch && matchesType && matchesLocation && matchesCapacity
        })
    }, [searchQuery, selectedCapacity, selectedLocation, selectedType, sourceHalls])

    const handleSelectHall = (hall: any) => {
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

    if (loading && !hallsData) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <section dir="rtl" className="w-full text-right animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        "flex flex-wrap items-center justify-start gap-3 text-right border-b border-slate-100 pb-2 mb-6",
                        stickyHeader && "sticky top-0 z-20 bg-white/95 backdrop-blur-sm pt-3"
                    )}
                >
                    <div className="relative flex-1 min-w-[260px] max-w-[520px]">
                        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="ابحث باسم القاعة..."
                            className="h-11 rounded-full bg-white pr-10 pl-4 text-sm text-right"
                        />
                    </div>

                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-[180px] rounded-full h-11">
                            <SelectValue placeholder="نوع القاعة" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                            {hallTypes.map((option) => (
                                <SelectItem key={option} value={option} className="text-right">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                        <SelectTrigger className="w-[180px] rounded-full h-11">
                            <SelectValue placeholder="السعة" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                            {capacityOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-right">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                    {filteredHalls.map((hall) => (
                        <HallCard 
                            key={hall.id}
                            hall={hall}
                            onSelect={() => handleSelectHall(hall)}
                            actionLabel={effectiveActionLabel}
                            showDescription={true}
                        />
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

export default function TrainerHallsPage(props: TrainerHallsPageProps) {
    return (
        <Suspense fallback={null}>
            <TrainerHallsPageContent {...props} />
        </Suspense>
    )
}
