"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, PlayCircle, Sparkles } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-48 overflow-hidden bg-white dark:bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>مستقبل التدريب في مكان واحد</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.15] mb-8 tracking-tight">
              منصة دال لتقديم وإدارة <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-600 to-indigo-600">
                الدورات بمرونة كاملة
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
              أنشئ دورتك، احجز قاعتك، وابدأ التدريب بسهولة من مكان واحد مع منصة دال المتكاملة.
            </p>

            <div className="flex flex-col sm:flex-row-reverse gap-4 justify-center">
              <Button 
                size="lg" 
                className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link href="/auth/register">
                  ابدأ الآن
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 px-12 rounded-2xl border-slate-200 dark:border-slate-800 font-bold text-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                asChild
              >
                <Link href="/courses">
                  استعرض الدورات
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Visual UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative w-full aspect-[16/9] max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent z-10" />
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                alt="Platform Mockup"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
          
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}

