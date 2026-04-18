"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Rocket } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 md:p-24 text-center"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
              ابدأ الآن مع منصة دال
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 leading-relaxed max-w-2xl mx-auto">
              سواء كنت طالباً طموحاً، مدرباً خبيراً، أو معهداً تدريبياً متميزاً، دال توفر لك كل ما تحتاجه للنجاح.
            </p>
            
            <div className="flex flex-col md:flex-row-reverse justify-center gap-4">
              <Button 
                size="lg" 
                className="h-16 px-8 rounded-2xl bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg shadow-2xl shadow-blue-600/20 transition-all hover:scale-[1.05]"
                asChild
              >
                <Link href="/auth/register?role=student">إنشاء حساب كطالب</Link>
              </Button>
              <Button 
                size="lg" 
                className="h-16 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg transition-all hover:scale-[1.05]"
                asChild
              >
                <Link href="/auth/register?role=trainer">التسجيل كمدرب</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 px-8 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold text-lg transition-all hover:scale-[1.05]"
                asChild
              >
                <Link href="/auth/register?role=institute">التسجيل كمعهد</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

