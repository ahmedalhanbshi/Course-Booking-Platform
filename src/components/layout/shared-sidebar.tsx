"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SharedNavLink, SharedNavigationItem } from "@/components/layout/shared-navigation-item"

interface SharedSidebarProps {
  collapsed: boolean
  links: SharedNavLink[]
}

export function SharedSidebar({ collapsed, links }: SharedSidebarProps) {
  const pathname = usePathname()

  const isActive = (matchers: string[] | undefined, href: string): boolean => {
    if (!matchers || matchers.length === 0) return pathname === href

    return matchers.some((matcher) => {
      if (matcher.startsWith("exact:")) return pathname === matcher.replace("exact:", "")
      if (matcher.startsWith("starts:")) return pathname.startsWith(matcher.replace("starts:", ""))
      return false
    })
  }

  return (
    <aside className="h-full bg-white dark:bg-slate-900">
      <nav className={cn("h-full overflow-y-auto px-2 py-3", collapsed ? "space-y-2" : "space-y-1.5")}>
        {links.map((link) => (
          <SharedNavigationItem
            key={link.href}
            link={link}
            collapsed={collapsed}
            active={isActive(link.match, link.href)}
          />
        ))}
      </nav>
    </aside>
  )
}
