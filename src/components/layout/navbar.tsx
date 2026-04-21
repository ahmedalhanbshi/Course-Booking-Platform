"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Bell, LayoutDashboard, LogOut, Menu, Search, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { getFileUrl } from "@/lib/utils";
import { type UserRole } from "@/types";

interface NavbarProps {
  onMenuClick?: () => void;
}

const mainLinks = [
  { href: "/courses", label: "تصفح الدورات" },
  { href: "/institutes", label: "المعاهد" },
];

function roleLabel(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "طالب";
    case "TRAINER":
      return "مدرب";
    case "INSTITUTE_ADMIN":
      return "مسؤول معهد";
    case "PLATFORM_ADMIN":
      return "مسؤول منصة";
    default:
      return role;
  }
}

function dashboardLink(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student/dashboard";
    case "TRAINER":
      return "/trainer/dashboard";
    case "INSTITUTE_ADMIN":
      return "/institute/dashboard";
    case "PLATFORM_ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

function profileLink(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student/profile";
    case "TRAINER":
      return "/trainer/profile";
    case "INSTITUTE_ADMIN":
      return "/institute/profile";
    case "PLATFORM_ADMIN":
      return "/admin/profile";
    default:
      return "/";
  }
}

function notificationsLink(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student/notifications";
    case "TRAINER":
      return "/trainer/notifications";
    case "INSTITUTE_ADMIN":
      return "/institute/notifications";
    case "PLATFORM_ADMIN":
      return "/admin/announcements";
    default:
      return "/";
  }
}

// Inner component that calls useSearchParams – must be wrapped in Suspense
function NavSearch({ pathname, router }: { pathname: string | null; router: ReturnType<typeof useRouter> }) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const targetPath = pathname?.startsWith("/institutes") ? "/institutes" : "/courses";
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }
      router.push(`${targetPath}?${params.toString()}`);
    }
  };

  return (
    <div className="relative mx-2 hidden max-w-[260px] flex-1 group lg:flex xl:max-w-[300px]">
      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
      <input
        type="text"
        placeholder="ابحث عن دورة أو معهد..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/95 pr-10 pl-3 text-sm outline-none transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:shadow-[0_14px_34px_-22px_rgba(79,70,229,0.55)] motion-reduce:transform-none"
      />
    </div>
  );
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userDashboardHref = user?.role ? dashboardLink(user.role) : "/";

  return (
    <>
      <nav
        dir="rtl"
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 motion-reduce:transition-none ${
          scrolled
            ? "border-b border-slate-200/70 bg-white/78 py-2 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.52)] backdrop-blur-xl"
            : "border-b border-transparent bg-white/96 py-3.5"
        }`}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-2.5 px-4 md:px-6">
          {/* Right Cluster: Logo + Links */}
          <div className="flex items-center gap-4 lg:gap-5">
            <div className="lg:hidden">
              {onMenuClick ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onMenuClick}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setMobileOpen((prev) => !prev)}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
            </div>

            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative h-11 w-11 md:h-12 md:w-12">
                <Image src="/images/logo.png" alt="منصة دال" fill className="object-contain" priority />
              </div>
              <span className="hidden bg-gradient-to-l from-indigo-700 to-blue-500 bg-clip-text text-xl font-black text-transparent sm:block">
                منصة دال
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-700">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative rounded-full px-4 py-2 transition-colors duration-300 ${
                    pathname?.startsWith(link.href)
                      ? "text-indigo-700"
                      : "text-slate-700 hover:text-indigo-700"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute bottom-1 left-4 right-4 h-[2px] origin-right rounded-full bg-indigo-600 transition-transform duration-300 ${
                      pathname?.startsWith(link.href)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Search – wrapped in Suspense because NavSearch calls useSearchParams */}
          <Suspense fallback={<div className="relative mx-2 hidden max-w-[260px] flex-1 lg:flex xl:max-w-[300px]" />}>
            <NavSearch pathname={pathname} router={router} />
          </Suspense>

          {/* Left Cluster: Auth/User */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                <Button asChild variant="ghost" className="hidden rounded-full px-4 font-bold text-indigo-700 hover:bg-indigo-50 lg:inline-flex">
                  <Link href={userDashboardHref}>
                    <LayoutDashboard className="h-4 w-4" />
                    لوحة التحكم
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="icon" className="relative rounded-full">
                  <Link href={notificationsLink(user.role)}>
                    <Bell className="h-5 w-5 text-slate-700" />
                    {unreadCount > 0 ? (
                      <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                    ) : null}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto rounded-full px-1.5 py-1.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarImage src={getFileUrl(user.avatar)} alt={user.name} className="object-cover" />
                          <AvatarFallback className="bg-indigo-100 font-bold text-indigo-700">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden text-right md:block">
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs font-semibold text-indigo-600">{roleLabel(user.role)}</p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                    <DropdownMenuLabel className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
                      <Link href={profileLink(user.role)}>
                        <User className="h-4 w-4" />
                        الملف الشخصي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
                      <Link href={notificationsLink(user.role)}>
                        <Bell className="h-4 w-4" />
                        الإشعارات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem
                      className="rounded-xl px-3 py-2.5 font-bold text-red-600 focus:bg-red-50 focus:text-red-700"
                      onClick={() => logout()}
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden rounded-full px-5 font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 sm:inline-flex">
                  <Link href="/auth/login">تسجيل الدخول</Link>
                </Button>
                <Button asChild className="h-11 rounded-full bg-indigo-600 px-6 font-bold text-white hover:bg-indigo-700">
                  <Link href="/auth/register">حساب جديد</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!onMenuClick && mobileOpen ? (
          <div className="mt-3 border-t border-slate-200/70 px-4 pb-4 pt-3 lg:hidden">
            <div className="space-y-1.5">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!user ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    دخول
                  </Link>
                </Button>
                <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    حساب جديد
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </nav>
      <div aria-hidden className="h-[84px] md:h-[92px]" />
    </>
  );
}
