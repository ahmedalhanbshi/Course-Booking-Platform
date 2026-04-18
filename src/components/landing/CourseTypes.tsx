"use client"

import { motion } from "framer-motion"
import { Globe, Users, RefreshCw } from "lucide-react"

const types = [
  {
    title: "أونلاين",
    description: "تعلم أو قدم تدريبك من أي مكان في العالم عبر منصات البث المباشر المتكاملة.",
    icon: Globe,
    color: "blue"
  },
  {
    title: "حضوري",
    description: "تجربة تعليمية تقليدية داخل أرقى المعاهد التدريبية المجهزة بأحدث الوسائل.",
    icon: Users,
    color: "indigo"
  },
  {
    title: "حجز مرن",
    description: "نموذج مبتكر يتيح للمدربين حجز القاعات بالساعة لتقليل التكاليف والمخاطر.",
    icon: RefreshCw,
    color: "emerald"
  }
]

export function CourseTypes() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">أنواع الدورات</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">مرونة كاملة في اختيار طريقة التعلم والتدريب التي تناسبك</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {types.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:bg-white dark:hover:bg-slate-950 hover:shadow-2xl transition-all duration-500 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-${type.color}-100 dark:bg-${type.color}-900/30 text-${type.color}-600 dark:text-${type.color}-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <type.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{type.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{type.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
