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

export function formatTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date)
  return d.toLocaleTimeString('ar-SA-u-ca-gregory-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  })
}
