"use client"

import * as React from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterOption {
  value: string
  label: string
}

export interface FilterSelect {
  id: string
  label?: string
  placeholder?: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

interface UnifiedFilterProps {
  // Search
  searchQuery?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string

  // Select Filters (Dropdowns)
  selectFilters?: FilterSelect[]

  // Results Count
  resultsCount?: number
  resultsLabel?: string

  // Sort By
  sortBy?: string
  onSortChange?: (val: string) => void
  sortOptions?: FilterOption[]
}

export function UnifiedFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "بحث...",
  selectFilters = [],
  resultsCount,
  resultsLabel = "عنصر",
  sortBy,
  onSortChange,
  sortOptions = [],
}: UnifiedFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-start items-center mb-6 gap-4">
      {/* Filters Group */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Search Bar */}
        {onSearchChange !== undefined && (
          <div className="relative w-full sm:w-[220px]">
             <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder={searchPlaceholder}
               value={searchQuery || ""}
               onChange={(e) => onSearchChange(e.target.value)}
               className="pr-9 bg-white/50 border-slate-200 w-full"
             />
          </div>
        )}

        {/* Dynamic Select Filters */}
        {selectFilters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/50 border-slate-200">
              <SelectValue placeholder={filter.placeholder || filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Sort By Dropdown */}
        {sortOptions.length > 0 && onSortChange && (
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/50 border-slate-200">
              <SelectValue placeholder="الترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Results Count */}
      {resultsCount !== undefined && (
        <p className="text-muted-foreground text-sm">
          تم العثور على <span className="font-bold text-foreground">{resultsCount}</span> {resultsLabel}
        </p>
      )}
    </div>
  )
}
