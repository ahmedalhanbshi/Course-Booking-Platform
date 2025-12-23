"use client"

import CoursesPage from "@/app/courses/page"

// This page wraps the public CoursesPage but since it is inside /student/..., 
// it will inherit the StudentLayout (with Sidebar).
// We might need to make sure CoursesPage adjusts well if we reuse it.
// The CoursesPage has its own container classes, so it should flow fine into the main area.

export default function StudentCoursesPage() {
    return <CoursesPage basePath="/student/explore/course" />
}
