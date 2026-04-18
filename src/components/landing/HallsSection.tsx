"use client"

import { motion } from "framer-motion"
import { MapPin, Users, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HallsSection() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                alt="Modern Hall"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Info Card */}
              <div className="absolute bottom-10 right-10 left-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">قاعة الابتكار</h4>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-bold">متاحة الآن</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-bold text-slate-500">40 مقعد</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-500">الرياض</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-xs font-bold text-slate-500">حجز مرن</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">احجز قاعتك <br />بكل سهولة</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12">
              تصفح القاعات المتاحة، اختر الوقت المناسب، وابدأ تدريبك بدون تعقيد. منصة دال توفر لك أفضل المساحات التدريبية في مكان واحد.
            </p>
            
            <Button 
              size="lg" 
              className="h-16 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-105 transition-all shadow-xl"
              asChild
            >
              <Link href="/institutes">
                <span>استعرض كافة القاعات</span>
                <ArrowLeft className="mr-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
