"use client"

import React from "react"
import { MapPin, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { Badge } from "@/components/ui/badge"
import { HallImage } from "./HallImage"
import { cn } from "@/lib/utils"

interface HallCardProps {
    hall: {
        id: string
        name: string
        type: string
        location?: string
        capacity: number
        hourlyRate: number | string
        image: string
        owner?: string
        description?: string
    }
    onSelect?: (id: string) => void
    actionLabel?: string
    className?: string
    showDescription?: boolean
}

export function HallCard({ 
    hall, 
    onSelect, 
    actionLabel = "اختيار القاعة", 
    className,
    showDescription = false 
}: HallCardProps) {
    return (
        <div 
            className={cn(
                "group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300",
                className
            )}
            dir="rtl"
        >
            {/* Image Section - Fixed Height 140px */}
            <div className="relative h-[140px] w-full bg-slate-50 overflow-hidden">
                <HallImage 
                    src={hall.image} 
                    alt={hall.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm text-[10px] px-2 py-0 border-none">
                        {hall.type}
                    </Badge>
                </div>
            </div>

            {/* Content Section - Compact Spacing */}
            <div className="p-3 flex flex-col text-right">
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1 mb-0.5">
                    {hall.name}
                </h4>
                
                <div className="flex flex-col gap-1 text-[11px] text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{hall.owner || "مقر المعهد"}</span>
                    </div>
                    {hall.location && (
                        <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">{hall.location}</span>
                        </div>
                    )}
                </div>

                {showDescription && hall.description && (
                    <p className="text-[10px] text-slate-400 line-clamp-1 mb-2">
                        {hall.description}
                    </p>
                )}

                {/* Info Row: Capacity Right, Price Left */}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-slate-600">
                        <Users className="h-3 w-3 text-slate-400" />
                        <span>السعة: {hall.capacity}</span>
                    </div>
                    <Price 
                        value={hall.hourlyRate} 
                        currency="ر.ي/ساعة" 
                        className="text-blue-600 font-bold" 
                    />
                </div>

                {/* Full Width Button - Directly below content */}
                <Button 
                    variant="outline" 
                    className="w-full h-9 mt-3 rounded-lg border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onSelect) onSelect(hall.id)
                    }}
                >
                    {actionLabel}
                </Button>
            </div>
        </div>
    )
}
