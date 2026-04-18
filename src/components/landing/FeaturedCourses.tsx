"use client"

import { motion } from "framer-motion"
import { FeaturedCourse } from "@/lib/public-service"
import Image from "next/image"
import Link from "next/link"
import { getFileUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Users } from "lucide-react"
import { Price } from "@/components/ui/price"

interface FeaturedCoursesProps {
  courses: FeaturedCourse[]
}

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  return (
    <section className="py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row-reverse justify-between items-end mb-16 gap-6">
          <div className="text-right">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">الدورات المختارة</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">استكشف مجموعة من الدورات الأكثر طلباً وتميزاً</p>
          </div>
          <Button variant="ghost" className="text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl px-6" asChild>
            <Link href="/courses">
              <span>تصفح كل الدورات</span>
              <ArrowLeft className="mr-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.length > 0 ? courses.slice(0, 8).map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          )) : (
            // Placeholder/Skeleton or Mock if empty
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 animate-pulse" />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function CourseCard({ course, index }: { course: FeaturedCourse; index: number }) {
  const instructorName = course.trainer?.name || course.institute?.name || "مدرب متميز"
  const categoryName = course.category?.name || "عام"
  const imageSrc = (course.image && course.image.length > 0) 
    ? getFileUrl(course.image) 
    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-600/10 dark:hover:shadow-blue-900/20 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative h-56 overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={course.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest border border-white/20">
          {categoryName}
        </div>
      </div>

      <div className="p-7 text-right">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <div className="flex flex-row-reverse items-center justify-between mb-6">
          <div className="flex flex-row-reverse items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
               {course.trainer?.avatar ? (
                 <Image src={getFileUrl(course.trainer.avatar)} alt={instructorName} width={32} height={32} />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-[10px] font-bold uppercase">
                   {instructorName.charAt(0)}
                 </div>
               )}
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{instructorName}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">120</span>
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <Price value={Number(course.price)} className="text-2xl font-black text-slate-900 dark:text-white" />
          <Button asChild variant="ghost" className="text-blue-600 p-0 hover:bg-transparent hover:text-blue-700 font-black text-sm">
            <Link href={`/courses/${course.id}`}>
               عرض الدورة <ArrowLeft className="mr-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
