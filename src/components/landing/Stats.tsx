"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Users, BookOpen, GraduationCap, Award, Landmark } from "lucide-react"

interface StatItemProps {
  label: string
  value: number
  suffix?: string
  icon: any
  delay: number
}

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2
      const end = value
      const increment = end / (duration * 60)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

function StatItem({ label, value, suffix, icon: Icon, delay }: StatItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        <Icon className="w-8 h-8" />
      </div>
      <Counter value={value} suffix={suffix} />
      <p className="mt-2 text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase text-xs">{label}</p>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem icon={BookOpen} label="دورة تدريبية" value={1200} suffix="+" delay={0.1} />
          <StatItem icon={GraduationCap} label="مدرب خبير" value={350} suffix="+" delay={0.2} />
          <StatItem icon={Landmark} label="معهد شريك" value={90} suffix="+" delay={0.3} />
          <StatItem icon={Users} label="طالب نشط" value={10000} suffix="+" delay={0.4} />
        </div>
      </div>
    </section>
  )
}

