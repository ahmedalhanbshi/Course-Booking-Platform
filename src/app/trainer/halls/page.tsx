"use client"

import TrainerHallsView from "@/components/pages/trainer-halls-view"
import { Suspense } from "react"

export default function TrainerHallsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
      <TrainerHallsView basePath="/trainer/halls" />
    </Suspense>
  )
}
