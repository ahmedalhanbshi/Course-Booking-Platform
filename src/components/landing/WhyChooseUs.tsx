"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, Globe, Heart } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "مناهج معتمدة موثوقة",
    desc: "نضمن لك الحصول على محتوى تعليمي محدث ومعتمد من كبرى المؤسسات الأكاديمية والتقنية عالمياً.",
    color: "bg-blue-500",
  },
  {
    icon: Zap,
    title: "تعلم تفاعلي فوري",
    desc: "نعتمد أحدث تقنيات التعليم النشط لضمان وصول المعلومة وتطبيقها بشكل عملي من اللحظة الأولى.",
    color: "bg-indigo-600",
  },
  {
    icon: Globe,
    title: "شهادات عالمية معترف بها",
    desc: "احصل على شهادات احترافية تدعم سيرتك الذاتية وتفتح لك آفاقاً جديدة في سوق العمل المحلي والدولي.",
    color: "bg-emerald-500",
  },
  {
    icon: Heart,
    title: "دعم ومتابعة مستمرة",
    desc: "فريقنا معك في كل خطوة، من حل المشكلات التقنية إلى تقديم التوجيه المهني حتى بعد إتمام الدورة.",
    color: "bg-rose-500",
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">لماذا منصة دال؟</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">نحن لا نقدم مجرد دورات، بل نصنع تجربة تعليمية متكاملة تهدف لنقلك إلى مستوى الاحتراف.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none text-right"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-${feature.color.split('-')[1]}-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-[1.8] text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
