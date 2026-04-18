"use client"

import Link from "next/link"
import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

export interface SharedNavLink {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  match?: string[]
}

interface SharedNavigationItemProps {
  link: SharedNavLink
  collapsed: boolean
  active: boolean
}

export function SharedNavigationItem({ link, collapsed, active }: SharedNavigationItemProps) {
  const Icon = link.icon

  return (
    <Link
      href={link.href}
      title={link.label}
      className={cn(
        "group rounded-xl transition-all duration-200",
        collapsed
          ? "mx-auto flex w-[68px] flex-col items-center justify-center gap-1.5 px-1 py-2.5"
          : "flex items-center justify-start gap-3 px-3 py-2.5",
        active
          ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          collapsed ? "h-[19px] w-[19px]" : "h-5 w-5",
          active
            ? "text-current"
            : "text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100"
        )}
      />
      <span
        className={cn(
          "font-medium",
          collapsed ? "max-w-full truncate text-[11px] leading-tight text-center" : "text-sm"
        )}
      >
        {link.label}
      </span>
    </Link>
  )
}

