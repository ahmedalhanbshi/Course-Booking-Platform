"use client"

import { motion } from "framer-motion"
import { School, Building2, GraduationCap, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    title: "للمدربين",
    icon: School,
    color: "blue",
    features: ["إنشاء الدورات", "إدارة الجداول", "حجز القاعات"]
  },
  {
    title: "للمعاهد",
    icon: Building2,
    color: "indigo",
    features: ["عرض القاعات", "تحديد الأسعار", "إدارة الحجوزات"]
  },
  {
    title: "للطلاب",
    icon: GraduationCap,
    color: "emerald",
    features: ["استعراض الدورات", "التسجيل بسهولة", "تعلم حسب احتياجك"]
  }
]

export function MainCategories() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">الفئات الرئيسية</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium font-sans">حلول متكاملة مصممة خصيصاً لكل طرف في العملية التعليمية</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-3xl bg-${cat.color}-50 dark:bg-${cat.color}-900/30 text-${cat.color}-600 dark:text-${cat.color}-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">{cat.title}</h3>
                  <ul className="space-y-4 w-full">
                    {cat.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                        <CheckCircle2 className={`w-5 h-5 text-${cat.color}-500 shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
