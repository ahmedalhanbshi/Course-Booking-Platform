"use client"

import { motion } from "framer-motion"
import { UserPlus, Compass, Zap } from "lucide-react"

const steps = [
  {
    title: "أنشئ حسابك",
    description: "عملية سهلة وسريعة للبدء في استخدام المنصة والحصول على كافة المميزات.",
    icon: UserPlus,
    color: "bg-blue-500"
  },
  {
    title: "اختر مسارك",
    description: "سواء كنت مدرباً، معهداً، أو طالباً، حدد هويتك وابدأ رحلتك الخاصة.",
    icon: Compass,
    color: "bg-indigo-500"
  },
  {
    title: "ابدأ الاستخدام مباشرة",
    description: "تمتع بكافة الأدوات المتاحة لبناء دورتك أو حجز قاعتك أو البدء بالتعلم.",
    icon: Zap,
    color: "bg-emerald-500"
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">كيف تعمل المنصة</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">ابدأ رحلتك التعليمية في ثلاث خطوات بسيطة ومباشرة</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-12 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className={`w-20 h-20 rounded-3xl ${step.color} text-white flex items-center justify-center mb-8 shadow-2xl shadow-${step.color.split('-')[1]}-500/20`}>
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
