"use client"

import { useParams } from "next/navigation"
import CourseStudentsManager from "@/components/courses/course-students-manager"

export default function TrainerCourseStudentsPage() {
  const params = useParams()
  const courseId = params.id as string

  return (
    <CourseStudentsManager 
      courseId={courseId} 
      backLink={`/trainer/courses/${courseId}`}
      backText="العودة للدورة"
    />
  )
}
