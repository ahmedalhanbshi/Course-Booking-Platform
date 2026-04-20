"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden border-t border-slate-200 bg-[#0b1222] pt-14 text-slate-300"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-500/12 blur-[90px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-sky-400/10 blur-[90px]" />
      </div>

      <div className="container relative mx-auto max-w-[1320px] px-4">
        <div className="grid gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/images/logo.png" alt="منصة دال" fill className="object-contain" />
              </div>
              <span className="text-xl font-black text-white">منصة دال</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
              منصة عربية حديثة تساعد الطلاب على اكتشاف الدورات والتسجيل بسهولة في مكان واحد.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-white">المنصة</h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-400">
              <li>
                <Link href="/courses" className="transition hover:text-white">
                  تصفح الدورات
                </Link>
              </li>
              <li>
                <Link href="/institutes" className="transition hover:text-white">
                  المعاهد
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-black text-white">الدعم</h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-400">
              <li>
                <span className="transition cursor-default">
                  الأسئلة الشائعة
                </span>
              </li>
              <li>
                <span className="transition cursor-default">
                  الشروط والأحكام
                </span>
              </li>
              <li>
                <span className="transition cursor-default">
                  سياسة الخصوصية
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-black text-white">تواصل معنا</h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>hello@daal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-800 py-5 text-sm font-semibold text-slate-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} منصة دال. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
