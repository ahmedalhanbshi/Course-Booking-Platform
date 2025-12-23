"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, Clock, ArrowRight, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

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
    return (
        <Card className="group overflow-hidden border-0 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col rounded-2xl">
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm shadow-sm dark:bg-slate-950/90 dark:text-primary-foreground">
                        {category}
                    </Badge>
                </div>

                {/* Wishlist Button (Visible on Hover) */}
                <button className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-red-500 transform translate-y-[-10px] group-hover:translate-y-0">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <CardContent className="p-5 flex-grow flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
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

                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border">
                        <Image src={instructor.avatar} alt={instructor.name} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{instructor.name}</span>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('en-US').format(price)} <span className="text-xs font-normal text-muted-foreground">ر.ي</span>
                    </span>
                </div>

                <Button size="sm" className="rounded-xl px-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link href={`${basePath}/${id}`}>
                        عرض التفاصيل
                        <ArrowRight className="w-4 h-4 mr-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
