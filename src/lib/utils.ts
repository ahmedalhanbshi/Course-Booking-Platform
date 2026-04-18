import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isLoopbackHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

export function getApiBaseUrl() {
  const fallback = "http://localhost:5000"
  const envBase = process.env.NEXT_PUBLIC_API_URL?.trim() || fallback

  if (typeof window === "undefined") {
    return envBase
  }

  try {
    const apiUrl = new URL(envBase)
    const current = new URL(window.location.origin)

    if (isLoopbackHost(apiUrl.hostname) && !isLoopbackHost(current.hostname)) {
      apiUrl.hostname = current.hostname
      apiUrl.protocol = current.protocol
    }

    return apiUrl.toString().replace(/\/$/, "")
  } catch {
    return envBase.replace(/\/$/, "")
  }
}

export function normalizeCurrencyLabel(currency?: string) {
  if (!currency) return "ر.ي"

  const normalized = currency.trim().toUpperCase()

  if (normalized === "YER") return "ر.ي"
  if (normalized === "SAR") return "ر.س"
  if (normalized === "USD") return "$"
  if (normalized === "EUR") return "€"

  return currency
}

export function formatPriceValue(value: number | string) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      useGrouping: true,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return value.trim()
}

export function formatCurrencyText(
  value: number | string,
  options?: {
    currency?: string
    locale?: string
  }
) {
  const currency = normalizeCurrencyLabel(options?.currency)
  const formattedValue = formatPriceValue(value)

  return `\u2066${formattedValue}\u00A0\u2067${currency}\u2069\u2069`
}

export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return "تاريخ غير صالح"

  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", options ?? {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)
}

export function getFileUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  const trimmedPath = path.trim()
  if (trimmedPath.startsWith("http") || trimmedPath.startsWith("blob:")) return trimmedPath

  const apiBase = getApiBaseUrl()
  const cleanPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`

  return `${apiBase}${cleanPath}`
}

export function formatTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return "--:--"

  return d.toLocaleTimeString("ar-EG-u-nu-latn", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  })
}

export function formatTimeRange(range: string) {
  const [startRaw, endRaw] = range.split("-").map(part => part.trim())
  if (!startRaw || !endRaw) return range

  const parse = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return null
    return new Date(2000, 0, 1, h, m, 0, 0)
  }

  const start = parse(startRaw)
  const end = parse(endRaw)
  if (!start || !end) return range

  return `${formatTime(start)} - ${formatTime(end)}`
}
