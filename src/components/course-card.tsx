"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, type MouseEvent } from "react"
import { Users, Clock, ArrowRight, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const FAVORITES_KEY = "courseFavorites"

export interface CourseCardProps {
    id: string
    title: string
    description: string
    price: number
    studentsCount: number
    duration: string
    level: string
    image: string
    instructor: {
        name: string
        avatar: string
    }
    category: string
    basePath?: string
}

export function CourseCard({
    id,
    title,
    description,
    price,
    studentsCount,
    duration,
    level,
    image,
    instructor,
    category,
    basePath = "/courses"
}: CourseCardProps) {
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const sync = () => {
            if (typeof window === "undefined") return
            try {
                const stored = window.localStorage.getItem(FAVORITES_KEY)
                const list = stored ? (JSON.parse(stored) as string[]) : []
                setIsFavorite(list.includes(id))
            } catch {
                setIsFavorite(false)
            }
        }

        sync()
        if (typeof window === "undefined") return

        const handleUpdate = () => sync()
        window.addEventListener("favorites-updated", handleUpdate)
        window.addEventListener("storage", handleUpdate)
        return () => {
            window.removeEventListener("favorites-updated", handleUpdate)
            window.removeEventListener("storage", handleUpdate)
        }
    }, [id])

    const toggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if (typeof window === "undefined") return
        const stored = window.localStorage.getItem(FAVORITES_KEY)
        const list = stored ? (JSON.parse(stored) as string[]) : []
        const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event("favorites-updated"))
        setIsFavorite(next.includes(id))
    }

    return (
        <Card
            dir="rtl"
            className="group w-full max-w-[300px] overflow-hidden border-0 bg-white text-right shadow-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col rounded-2xl"
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square sm:w-[300px] sm:h-[300px] overflow-hidden rounded-2xl">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ display: "block" }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm shadow-sm dark:bg-slate-950/90 dark:text-primary-foreground">
                        {category}
                    </Badge>
                </div>

                {/* Wishlist Button */}
                <button
                    type="button"
                    aria-label="إضافة إلى المفضلة"
                    aria-pressed={isFavorite}
                    onClick={toggleFavorite}
                    className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-slate-200 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:text-white"
                >
                    <Heart className={`w-5 h-5 transition-transform duration-200 ${isFavorite ? "fill-current text-red-500 scale-110" : ""}`} />
                </button>
            </div>

            {/* Content */}
            <CardContent className="p-5 flex-grow flex flex-col gap-3 text-right">
                <div className="flex items-center justify-start gap-2 text-xs text-muted-foreground mb-1">
                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                        <Users className="w-3 h-3" />
                        <span>{studentsCount}</span>
                    </div>
                </div>

                <Link href={`${basePath}/${id}`} className="group-hover:text-primary transition-colors">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1">
                        {title}
                    </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[42px] mb-2">
                    {description}
                </p>

                {/* Instructor */}
                <div className="flex items-center justify-start gap-2 mt-auto pt-3 border-t border-border/50">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border">
                        <Image src={instructor.avatar} alt={instructor.name} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{instructor.name}</span>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4 pt-0 flex w-full items-center justify-between text-right">
                <Button size="sm" className="rounded-xl px-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link href={`${basePath}/${id}`}>
                        عرض التفاصيل
                        <ArrowRight className="w-4 h-4 mr-1" />
                    </Link>
                </Button>

                <div className="flex flex-col">
                    <span className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('en-US').format(price)} <span className="text-xs font-normal text-muted-foreground">ر.ي</span>
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}
