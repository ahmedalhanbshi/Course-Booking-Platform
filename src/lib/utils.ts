import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  })
}

export function getFileUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  const trimmedPath = path.trim()
  if (trimmedPath.startsWith("http") || trimmedPath.startsWith("blob:")) return trimmedPath

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")
  const cleanPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`

  return `${apiBase}${cleanPath}`
}

export function formatTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date)
  return d.toLocaleTimeString('ar-SA-u-ca-gregory-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  })
}
