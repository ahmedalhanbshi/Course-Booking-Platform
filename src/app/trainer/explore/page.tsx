"use client"

import CoursesPage from "@/app/courses/page"

// This page renders the public Browse Courses view but inside the Trainer Dashboard Layout.
// It reuses the shared CoursesPage component.

export default function TrainerBrowseCoursesPage() {
    return (
        <div className="h-full w-full">
            {/* 
                Passing basePath="/courses" means clicking a card will take them to the public course details page.
                If we want them to stay in darkness (dashboard), we'd need to recreate the details page under /trainer/explore/course/[id].
                For now, we ensure the LIST layout is correct as requested. 
            */}
            <CoursesPage basePath="/trainer/courses" />
        </div>
    )
}
