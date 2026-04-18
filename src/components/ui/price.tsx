import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, formatPriceValue, normalizeCurrencyLabel } from "@/lib/utils"

const priceVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap text-right",
  {
    variants: {
      variant: {
        default: "rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        plain: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type PriceProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof priceVariants> & {
  value: number | string
  currency?: string
  locale?: string
  className?: string
  numberClassName?: string
  currencyClassName?: string
}

export function Price({
  value,
  currency = "ر.ي",
  locale = "en-US",
  variant,
  className,
  numberClassName,
  currencyClassName,
  ...props
}: PriceProps) {
  void locale
  const formattedValue = formatPriceValue(value)
  const currencyLabel = normalizeCurrencyLabel(currency)

  return (
    <span
      {...props}
      className={cn(priceVariants({ variant }), className)}
      dir="rtl"
    >
      <span className={numberClassName}>{formattedValue}</span>
      <span className={currencyClassName}>{currencyLabel}</span>
    </span>
  )
}
