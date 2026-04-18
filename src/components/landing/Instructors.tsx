"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockInstructors = [
  {
    id: 1,
    name: "د. طارق السعيد",
    role: "خبير علم البيانات والذكاء الاصطناعي",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    rating: 4.9,
    students: "12K+",
  },
  {
    id: 2,
    name: "سارة أحمد",
    role: "مستشارة التسويق الرقمي",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    rating: 4.8,
    students: "8K+",
  },
  {
    id: 3,
    name: "م. خالد يوسف",
    role: "مهندس برمجيات أول",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    rating: 4.9,
    students: "15K+",
  },
  {
    id: 4,
    name: "ليلى عبدالجبار",
    role: "مديرة تصميم المنتجات",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    rating: 4.7,
    students: "6K+",
  }
]

export function Instructors() {
  return (
    <section className="py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row-reverse justify-between items-end mb-20 gap-6">
          <div className="text-right">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">نخبة المدربين</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">تعلم من أفضل الخبراء في مجالاتهم</p>
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-200 dark:border-slate-800 font-bold px-8 h-12" asChild>
            <Link href="/trainers">انضم كمدرب</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockInstructors.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-8 mx-auto w-48 h-48 lg:w-56 lg:h-56">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border border-slate-100 dark:border-slate-800 group-hover:scale-110 group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-all duration-500" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-500/20 group-hover:rotate-45 transition-transform duration-1000" />
                
                <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl">
                  <Image 
                    src={inst.avatar} 
                    alt={inst.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Badge */}
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-xl group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{inst.name}</h3>
              <p className="text-sm font-bold text-blue-500 mb-6">{inst.role}</p>
              
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Button variant="ghost" className="text-blue-600 font-black text-sm p-0 hover:bg-transparent" asChild>
                  <Link href={`/trainers/${inst.id}`}>
                    عرض الملف الشخصي <ArrowLeft className="mr-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
