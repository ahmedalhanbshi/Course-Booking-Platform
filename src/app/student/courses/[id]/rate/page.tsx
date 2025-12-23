"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Star, Send, CheckCircle, User } from "lucide-react"
import { Review } from "@/types"
import { formatDate } from "@/lib/utils"

// Mock user data
const mockUser = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: 'student' as const,
}

// Mock course data
const mockCourse = {
  id: "1",
  title: "تعلم React من الصفر",
  trainer: {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: 'trainer' as const,
  },
  rating: 4.8,
  reviewCount: 156,
}

// Mock existing reviews
const mockReviews: Review[] = [
  {
    id: "1",
    courseId: "1",
    studentId: "2",
    rating: 5,
    comment: "دورة ممتازة ومفيدة جداً. المدرب يشرح بطريقة واضحة ومبسطة. أنصح بها للجميع.",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "2",
    courseId: "1",
    studentId: "3",
    rating: 4,
    comment: "محتوى الدورة غني والمشاريع عملية. أنصح بها للمبتدئين.",
    createdAt: new Date("2025-01-08"),
  },
  {
    id: "3",
    courseId: "1",
    studentId: "4",
    rating: 5,
    comment: "تجربة تعلم رائعة. اكتسبت مهارات جديدة وثقة في البرمجة.",
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "4",
    courseId: "1",
    studentId: "5",
    rating: 4,
    comment: "الدورة جيدة جداً. المدرب متمكن والشرح واضح.",
    createdAt: new Date("2025-01-03"),
  },
]

export default function CourseRatingPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // In real app, this would redirect or show success message
    setTimeout(() => {
      router.push(`/student/courses/${courseId}`)
    }, 2000)
  }



  const getStudentInitial = (studentId: string) => {
    // In real app, you'd get the student name from the review data
    return studentId.charAt(0).toUpperCase()
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                تم إرسال التقييم بنجاح!
              </h2>
              <p className="text-gray-600 mb-6">
                شكراً لك على تقييم الدورة. تقييمك يساعد الطلاب الآخرين في اتخاذ قراراتهم.
              </p>
              <Button asChild>
                <Link href={`/student/courses/${courseId}`}>
                  العودة للدورة
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/student/courses/${courseId}`}>
              ← العودة للدورة
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          تقييم الدورة
        </h1>
        <p className="text-gray-600">
          {mockCourse.title}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Form */}
        <Card>
          <CardHeader>
            <CardTitle>شارك رأيك</CardTitle>
            <CardDescription>
              ساعد الطلاب الآخرين من خلال مشاركة تجربتك مع الدورة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label className="text-base font-medium">التقييم العام</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    title={`قيم ${star} من 5 نجوم`}
                  >
                    <Star
                      className={`h-8 w-8 ${star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  تقييمك: {rating} من 5 نجوم
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">التعليق (اختياري)</Label>
              <Textarea
                id="comment"
                placeholder="شارك تجربتك مع الدورة..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500">
                {comment.length}/500 حرف
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                "جاري الإرسال..."
              ) : (
                <>
                  <Send className="me-2 h-4 w-4" />
                  إرسال التقييم
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Course Info & Recent Reviews */}
        <div className="space-y-6">
          {/* Course Summary */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الدورة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المدرب:</span>
                  <span className="font-medium">{mockCourse.trainer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">التقييم العام:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mockCourse.rating}</span>
                    <span className="text-gray-500">({mockCourse.reviewCount})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>آراء الطلاب الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {getStudentInitial(review.studentId)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Reviews Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>جميع التقييمات ({mockReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {getStudentInitial(review.studentId)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
