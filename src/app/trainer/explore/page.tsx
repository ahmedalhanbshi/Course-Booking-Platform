import { Suspense } from "react"

import StudentExplorePage from "@/app/student/courses/page"

export default function TrainerExplorePage() {
  return (
    <Suspense fallback={null}>
      <StudentExplorePage basePath="/trainer/explore/course" />
    </Suspense>
  )
}
