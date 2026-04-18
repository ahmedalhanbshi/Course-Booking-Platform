"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-slate-950 pt-24 pb-12 border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-right">
          
          <div className="lg:col-span-1">
            <Link href="/" className="text-3xl font-black text-slate-900 dark:text-white mb-6 block">دال</Link>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
              المنصة العربية المتكاملة لإدارة وتقديم الدورات التدريبية بأحدث المعايير التقنية.
            </p>
          </div>

          <div>
             <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">المنصة</h4>
             <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
               <li><Link href="/courses" className="hover:text-blue-600 transition-colors">كافة الدورات</Link></li>
               <li><Link href="/institutes" className="hover:text-blue-600 transition-colors">المعاهد الشريكة</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">الدعم</h4>
             <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
               <li><Link href="/faq" className="hover:text-blue-600 transition-colors">الأسئلة الشائعة</Link></li>
               <li><Link href="/contact" className="hover:text-blue-600 transition-colors">اتصل بنا</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">تواصل معنا</h4>
             <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
               <li className="flex flex-row-reverse items-center gap-3">
                 <Mail className="w-4 h-4 text-blue-500" />
                 <span>info@daal.sa</span>
               </li>
               <li className="flex flex-row-reverse items-center gap-3">
                 <Twitter className="w-4 h-4 text-blue-400" />
                 <span>@DalPlatform</span>
               </li>
             </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-sm font-bold text-slate-400">
          <p>© {new Date().getFullYear()} منصة دال. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-600 transition-colors">الشروط والأحكام</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

