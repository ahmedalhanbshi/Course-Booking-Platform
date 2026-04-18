"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, MapPin, Users, Info, Building2, Loader2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { cn, getFileUrl } from "@/lib/utils"
import { HallCard } from "@/components/halls/HallCard"
// For the trainer section, we can use the generic apiClient or trainerService.
// Using trainerService since we verified its getHalls is unrestricted.
import { trainerService } from "@/lib/trainer-service"
import { useRouter } from "next/navigation"

const hallTypes = [
    "الكل",
    "قاعة محاضرات",
    "قاعة اجتماعات",
    "معمل",
    "ورشة عمل"
]

export default function GenericExploreHalls({
    hideTitle,
    basePath = "/trainer/halls",
    actionLabel = "التفاصيل",
    onSelectHall,
    hallsData
}: {
    hideTitle?: boolean;
    basePath?: string;
    actionLabel?: string;
    onSelectHall?: (id: string) => void;
    hallsData?: any[];
}) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("الكل")
    const [dbHalls, setDbHalls] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (hallsData) return

        const fetchHalls = async () => {
            try {
                setLoading(true)
                const responseData = await trainerService.getHalls()
                const mapped = responseData.map((h: any) => ({
                    id: h.id,
                    name: h.name,
                    type: h.type || "قاعة",
                    location: h.location || "مقر المعهد",
                    capacity: h.capacity,
                    hourlyRate: Number(h.pricePerHour || 0),
                    image: getFileUrl(h.image),
                    features: h.facilities || [],
                    description: h.description || "",
                    owner: h.institute?.name || "معهد غير معروف"
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
                hall.location?.toLowerCase().includes(query)

            const matchesType =
                selectedType === "الكل" || hall.type === selectedType

            return matchesSearch && matchesType
        })
    }, [searchQuery, selectedType, sourceHalls])

    const handleSelectHall = (id: string) => {
        if (onSelectHall) {
            onSelectHall(id)
        } else {
            router.push(`${basePath}/${id}`)
        }
    }

    return (
        <div className="space-y-6" dir="rtl">
            {!hideTitle && (
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">
                        استكشاف القاعات
                    </h1>
                    <p className="mt-2 text-gray-500">
                        تصفح القاعات المتاحة في المعاهد واحجز ما يناسبك
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="ابحث عن قاعة..."
                        className="pl-4 pr-10 h-12 w-full text-right"
                        dir="rtl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                >
                    <SelectTrigger className="w-full sm:w-[200px] h-12" dir="rtl">
                        <SelectValue placeholder="نوع القاعة" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                        {hallTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500 font-medium">جاري تحميل القاعات...</p>
                </div>
            ) : filteredHalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد قاعات</h3>
                    <p className="text-gray-500 max-w-sm">
                        لم نتمكن من العثور على قاعات مطابقة للبحث أو لا توجد قاعات متاحة حالياً.
                    </p>
                    {(searchQuery || selectedType !== "الكل") && (
                        <Button
                            variant="link"
                            className="mt-4 text-blue-600 font-medium"
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedType("الكل")
                            }}
                        >
                            مسح الفلاتر
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {filteredHalls.map((hall) => (
                        <HallCard 
                            key={hall.id}
                            hall={hall}
                            onSelect={handleSelectHall}
                            actionLabel={actionLabel}
                            showDescription={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
