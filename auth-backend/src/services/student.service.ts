import prisma from '../config/database';

class StudentService {
    /**
     * Get dashboard data for the student
     */
    async getDashboard(userId: string) {
        // 1. Get user with profile details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, avatar: true },
        });

        if (!user) throw new Error("المستخدم غير موجود");

        // 2. Get active enrollments for the student
        const enrollments = await prisma.enrollment.findMany({
            where: {
                studentId: userId,
                status: { in: ['ACTIVE', 'COMPLETED'] },
                deletedAt: null
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        shortDescription: true,
                        image: true,
                        category: { select: { name: true } },
                        trainer: { select: { name: true } }
                    }
                }
            },
            take: 4, // Show up to 4 current courses
            orderBy: { enrolledAt: 'desc' }
        });

        const currentCourses = enrollments.map(e => ({
            id: e.course.id,
            title: e.course.title,
            shortDescription: e.course.shortDescription || '',
            trainer: e.course.trainer?.name || 'مدرب',
            image: e.course.image,
            category: e.course.category?.name || 'عام',
        }));

        // 3. Get recent notifications
        const recentNotificationsRaw = await prisma.notification.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const recentNotifications = recentNotificationsRaw.map(n => {
            let title = 'إشعار جديد';
            let message = 'لديك إشعار جديد في المنصة';
            let type = 'info';

            switch (n.type) {
                case 'COURSE_ENROLLMENT':
                    title = 'تسجيل ناجح';
                    message = 'تم تسجيلك بنجاح في الدورة';
                    type = 'success';
                    break;
                case 'PAYMENT_APPROVED':
                    title = 'تم قبول الدفع';
                    message = 'تم تأكيد الدفعة بنجاح';
                    type = 'success';
                    break;
                case 'PAYMENT_REJECTED':
                    title = 'تم رفض الدفع';
                    message = 'يرجى مراجعة إيصال الدفع والمحاولة مرة أخرى';
                    type = 'warning';
                    break;
                case 'SESSION_REMINDER':
                    title = 'تذكير بالدرس';
                    message = 'لديك درس قريب، يرجى الاستعداد';
                    type = 'reminder';
                    break;
                case 'NEW_ANNOUNCEMENT':
                    title = 'إعلان جديد';
                    message = 'تم نشر إعلان جديد في إحدى دوراتك';
                    type = 'material';
                    break;
            }

            return {
                id: n.id,
                title,
                message,
                time: n.createdAt,
                type,
                isRead: n.isRead
            };
        });

        // 4. Get wishlisted course IDs
        const wishlists = await prisma.wishlist.findMany({
            where: { studentId: userId },
            select: { courseId: true }
        });

        const favoriteIds = wishlists.map(w => w.courseId);

        // 5. Get some stats
        const activeCoursesCount = await prisma.enrollment.count({
            where: {
                studentId: userId,
                status: 'ACTIVE',
                deletedAt: null
            }
        });

        const completedCoursesCount = await prisma.enrollment.count({
            where: {
                studentId: userId,
                status: 'COMPLETED',
                deletedAt: null
            }
        });

        return {
            user,
            currentCourses,
            recentNotifications,
            favoriteIds,
            stats: {
                activeCourses: activeCoursesCount,
                completedCourses: completedCoursesCount
            }
        };
    }

    async getMyCourses(userId: string) {
        const now = new Date();
        const enrollments = await prisma.enrollment.findMany({
            where: {
                studentId: userId,
                deletedAt: null
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        shortDescription: true,
                        description: true,
                        image: true,
                        category: { select: { name: true } },
                        trainer: { select: { id: true, name: true, avatar: true } },
                        startDate: true,
                        endDate: true,
                        price: true,
                        sessions: {
                            where: {
                                status: 'SCHEDULED',
                                startTime: { gte: now }
                            },
                            orderBy: {
                                startTime: 'asc'
                            },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        return enrollments.map(e => ({
            id: e.id,
            status: e.status, // Map this correctly in frontend if needed
            progress: 0, // Placeholder
            enrolledAt: e.enrolledAt,
            course: {
                id: e.course.id,
                title: e.course.title,
                shortDescription: e.course.shortDescription || '',
                description: e.course.description || '',
                trainer: {
                    id: e.course.trainer?.id || 'unknown',
                    name: e.course.trainer?.name || 'مدرب الخبير',
                    avatar: e.course.trainer?.avatar || null
                },
                image: e.course.image,
                category: e.course.category?.name || 'عام',
                startDate: e.course.startDate,
                endDate: e.course.endDate,
                price: e.course.price
            },
            nextSession: e.course.sessions[0] ? {
                id: e.course.sessions[0].id,
                topic: e.course.sessions[0].topic,
                startTime: e.course.sessions[0].startTime,
                endTime: e.course.sessions[0].endTime,
                type: e.course.sessions[0].type
            } : null
        }));
    }

    /**
     * Get the student's enrollment status for a specific course
     */
    async getEnrollmentStatus(userId: string, courseId: string) {
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            },
            include: {
                payments: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!enrollment || enrollment.deletedAt) {
            return { status: 'NONE' };
        }

        // Map database status to frontend expected status
        if (enrollment.status === 'PRELIMINARY') {
            return { status: 'PENDING_APPROVAL' };
        }

        if (enrollment.status === 'PENDING_PAYMENT') {
            // Check if there is a payment under review
            const latestPayment = enrollment.payments[0];
            if (latestPayment && latestPayment.status === 'PENDING_REVIEW') {
                return { status: 'PAYMENT_CONFIRMED' }; // Meaning they submitted the receipt, waiting for trainer
            } else if (latestPayment && latestPayment.status === 'REJECTED') {
                return { status: 'PAYMENT_REJECTED' };
            }
            return { status: 'APPROVED' }; // Wait for payment upload (frontend expects 'APPROVED' to show payment step)
        }

        if (enrollment.status === 'ACTIVE' || enrollment.status === 'COMPLETED') {
            return { status: 'ENROLLED' };
        }

        if (enrollment.status === 'CANCELLED') {
            return { status: 'REJECTED' };
        }

        return { status: 'NONE' };
    }

    /**
     * Pre-register a student to a course (initial application)
     */
    async preRegisterCourse(userId: string, courseId: string, fullName: string, email: string, phone: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("المستخدم غير موجود");

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new Error("الدورة غير موجودة");

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            }
        });

        if (existingEnrollment && !existingEnrollment.deletedAt) {
            throw new Error("أنت مسجل بالفعل في هذه الدورة");
        }

        // Optionally update the user's profile info if provided
        if (fullName || phone) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    name: fullName || user.name,
                    phone: phone || user.phone
                }
            });
        }

        // Upsert the enrollment
        const enrollment = await prisma.enrollment.upsert({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            },
            update: {
                status: 'PRELIMINARY',
                deletedAt: null
            },
            create: {
                studentId: userId,
                courseId: courseId,
                status: 'PRELIMINARY'
            }
        });

        // Trigger notification for the trainer (simplified here, you might have a notification service)
        if (course.trainerId) {
            await prisma.notification.create({
                data: {
                    userId: course.trainerId,
                    type: 'COURSE_ENROLLMENT',
                    relatedEntityId: enrollment.id,
                }
            })
        }

        return {
            status: 'PENDING_APPROVAL',
            enrollmentId: enrollment.id
        };
    }

    /**
     * Submit payment proof (receipt image) for an enrollment
     */
    async submitPaymentProof(userId: string, courseId: string, imagePath: string) {
        // Verify enrollment exists and is in correct state
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            },
            include: { course: true }
        });

        if (!enrollment || enrollment.deletedAt) {
            throw new Error("لا يوجد تسجيل مسبق في هذه الدورة");
        }

        // Only allow upload if status allows
        if (enrollment.status !== 'PENDING_PAYMENT') {
            throw new Error("حالة التسجيل لا تسمح بإرفاق سند دفع حالياً");
        }

        // Create the payment record
        await prisma.payment.create({
            data: {
                amount: enrollment.course.price,
                currency: "YER", // Default or fetch from course context
                depositSlipImage: imagePath,
                status: 'PENDING_REVIEW',
                enrollmentId: enrollment.id
            }
        });

        return {
            status: 'PAYMENT_CONFIRMED'
        };
    }

    /**
     * Get detailed information for a specific course for the student
     */
    async getCourseDetails(userId: string, courseId: string) {
        // 1. Verify enrollment and access
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            },
            include: {
                course: {
                    include: {
                        trainer: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                email: true,
                                phone: true
                            }
                        },
                        category: true,
                        sessions: {
                            orderBy: { startTime: 'asc' },
                            include: { room: true }
                        },
                        announcements: {
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                }
            }
        });

        if (!enrollment || enrollment.deletedAt) {
            throw new Error("لم يتم العثور على التسجيل أو لا تملك صلاحية الوصول");
        }

        const course = enrollment.course;
        const now = new Date();

        // Find next upcoming session
        const nextSession = course.sessions.find(s =>
            s.status === 'SCHEDULED' && s.startTime >= now
        );

        // Derive delivery type and platform
        const primarySession = course.sessions[0];
        const deliveryType = primarySession?.type === 'ONLINE' ? 'أونلاين'
            : primarySession?.type === 'IN_PERSON' ? 'حضوري'
                : course.sessions.length > 0 ? 'هجين' : 'أونلاين';

        const onlinePlatform = primarySession?.type === 'ONLINE'
            ? (primarySession.meetingLink?.includes('zoom') ? 'Zoom' : primarySession.meetingLink?.includes('meet.google') ? 'Google Meet' : 'أونلاين')
            : (primarySession?.room?.name || primarySession?.location || '—');

        return {
            id: course.id,
            title: course.title,
            category: course.category?.name || 'عام',
            shortDescription: course.shortDescription || '',
            description: course.description || '',
            image: course.image,
            locationName: primarySession?.room?.name || primarySession?.location || null,
            deliveryType,
            onlinePlatform,
            enrollmentStatus: enrollment.status,
            nextSession: nextSession ? {
                id: nextSession.id,
                topic: nextSession.topic,
                startTime: nextSession.startTime,
                endTime: nextSession.endTime,
                type: nextSession.type,
                meetingLink: nextSession.meetingLink
            } : null,
            instructor: {
                id: course.trainer?.id,
                name: course.trainer?.name || 'مدرب',
                role: 'مدرب الدورة',
                avatar: course.trainer?.avatar,
                email: course.trainer?.email,
                phone: course.trainer?.phone
            },
            sessions: course.sessions.map(s => ({
                id: s.id,
                topic: s.topic,
                startTime: s.startTime,
                endTime: s.endTime,
                status: s.status,
                type: s.type,
                meetingLink: s.meetingLink
            })),
            announcements: course.announcements.map(a => ({
                id: a.id,
                title: a.title,
                content: a.message,
                createdAt: a.createdAt,
                publishedAt: a.createdAt
            }))
        };
    }

    /**
     * Get the student's wishlist
     */
    async getWishlist(userId: string) {
        const wishlists = await prisma.wishlist.findMany({
            where: { studentId: userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        shortDescription: true,
                        image: true,
                        price: true,
                        category: { select: { name: true } },
                        trainer: { select: { id: true, name: true, avatar: true } },
                        sessions: { select: { id: true, type: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return wishlists.map(w => {
            const course = w.course;
            return {
                id: course.id,
                title: course.title,
                shortDescription: course.shortDescription || '',
                image: course.image,
                price: Number(course.price),
                category: course.category?.name || 'عام',
                trainer: {
                    name: course.trainer?.name || 'مدرب',
                },
                type: course.sessions[0]?.type === 'ONLINE' ? 'أونلاين' : (course.sessions.length > 0 ? 'حضوري' : 'أونلاين')
            };
        });
    }

    /**
     * Remove a course from the student's wishlist
     */
    async removeFromWishlist(userId: string, courseId: string) {
        return prisma.wishlist.deleteMany({
            where: {
                studentId: userId,
                courseId: courseId
            }
        });
    }

    /**
     * Toggle a course in the student's wishlist (add if not exists, remove if exists)
     */
    async toggleWishlist(userId: string, courseId: string) {
        const existing = await prisma.wishlist.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            }
        });

        if (existing) {
            await prisma.wishlist.delete({
                where: {
                    studentId_courseId: {
                        studentId: userId,
                        courseId: courseId
                    }
                }
            });
            return { added: false };
        } else {
            await prisma.wishlist.create({
                data: {
                    studentId: userId,
                    courseId: courseId
                }
            });
            return { added: true };
        }
    }

    /**
     * Get details for a specific hall (room)
     */
    async getHallById(hallId: string) {
        const room = await prisma.room.findFirst({
            where: { id: hallId, isActive: true },
            include: {
                institute: {
                    include: {
                        user: { select: { avatar: true } },
                        bankAccounts: {
                            where: { isActive: true },
                            select: { id: true, bankName: true, accountName: true, accountNumber: true, iban: true }
                        }
                    }
                }
            }
        });

        if (!room) throw new Error("القاعة غير موجودة أو غير نشطة");

        return {
            ...room,
            instituteName: room.institute?.name,
            instituteDescription: room.institute?.description,
            instituteLogo: room.institute?.logo || room.institute?.user?.avatar,
            bankAccounts: room.institute?.bankAccounts || [],
        };
    }

    /**
     * Get the student's schedule (all sessions for their courses)
     */
    async getSchedule(userId: string) {
        // 1. Get all active or completed enrollments for the student
        const enrollments = await prisma.enrollment.findMany({
            where: {
                studentId: userId,
                status: { in: ['ACTIVE', 'COMPLETED'] },
                deletedAt: null
            },
            select: { courseId: true }
        });

        const courseIds = enrollments.map(e => e.courseId);

        if (courseIds.length === 0) return [];

        // 2. Get all sessions for these courses
        const sessions = await prisma.session.findMany({
            where: {
                courseId: { in: courseIds },
                status: { not: 'CANCELLED' }
            },
            include: {
                room: { select: { name: true } },
                course: {
                    select: {
                        title: true,
                        trainer: { select: { name: true } }
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });

        return sessions.map(s => ({
            id: s.id,
            topic: s.topic || 'جلسة تدريبية',
            courseTitle: s.course.title,
            trainerName: s.course.trainer?.name || 'مدرب',
            startTime: s.startTime,
            endTime: s.endTime,
            type: s.type.toLowerCase(),
            status: s.status.toLowerCase(),
            meetingLink: s.meetingLink,
            location: s.room?.name || s.location || (s.type === 'ONLINE' ? 'أونلاين' : 'غير محدد'),
            roomId: s.roomId ?? null
        }));
    }

    /**
     * Cancel an enrollment
     */
    async cancelEnrollment(userId: string, enrollmentId: string) {
        // 1. Verify enrollment belongs to the student
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                id: enrollmentId,
                studentId: userId,
                deletedAt: null
            }
        });

        if (!enrollment) {
            throw new Error("التسجيل غير موجود");
        }

        // 2. Check if the current status allows cancellation
        if (enrollment.status === 'CANCELLED') {
            throw new Error("التسجيل ملغى بالفعل");
        }

        if (enrollment.status === 'COMPLETED') {
            throw new Error("لا يمكن إلغاء دورة مكتملة");
        }

        // 3. Update status to CANCELLED
        return prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { status: 'CANCELLED' }
        });
    }
}

export default new StudentService();
