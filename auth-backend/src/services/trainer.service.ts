import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';

class TrainerService {
    /**
     * Get dashboard stats + upcoming sessions + pending room bookings for a trainer
     */
    async getDashboard(userId: string) {
        const now = new Date();

        // All courses belonging to this trainer
        const courses = await prisma.course.findMany({
            where: { trainerId: userId },
            select: { id: true, title: true, status: true, maxStudents: true, startDate: true, endDate: true },
        });

        const courseIds = courses.map(c => c.id);

        const activeCourses = courses.filter(c => c.status === 'ACTIVE').length;

        // Total enrolled students across all trainer courses
        const totalStudents = await prisma.enrollment.count({
            where: {
                courseId: { in: courseIds },
                status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT'] },
            },
        });

        // Total sessions
        const totalSessions = await prisma.session.count({
            where: { courseId: { in: courseIds } },
        });

        // Upcoming sessions (scheduled, in the future)
        const upcomingSessionsRaw = await prisma.session.findMany({
            where: {
                courseId: { in: courseIds },
                status: 'SCHEDULED',
                startTime: { gte: now },
            },
            orderBy: { startTime: 'asc' },
            take: 5,
            include: {
                course: { select: { title: true, enrollments: { where: { status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT'] } }, select: { id: true } } } },
                room: { select: { name: true } },
            },
        });

        const upcomingSessions = upcomingSessionsRaw.map(s => ({
            id: s.id,
            title: s.topic || 'جلسة تدريبية',
            courseTitle: s.course.title,
            startTime: s.startTime,
            endTime: s.endTime,
            type: s.type.toLowerCase(),
            room: s.room?.name ?? null,
            meetingLink: s.meetingLink ?? null,
            enrolledStudents: s.course.enrollments.length,
        }));

        // Pending room bookings requested by this trainer
        const pendingBookingsRaw = await prisma.roomBooking.findMany({
            where: {
                requestedById: userId,
                status: { in: ['PENDING_APPROVAL', 'PENDING_PAYMENT'] },
            },
            orderBy: { startDate: 'asc' },
            include: {
                room: { select: { name: true } },
                course: { select: { title: true } },
                sessions: { take: 1, orderBy: { startTime: 'asc' }, select: { topic: true } },
            },
        });

        const pendingRoomBookings = pendingBookingsRaw.map(b => ({
            id: b.id,
            courseTitle: b.course?.title ?? '—',
            sessionTitle: b.sessions[0]?.topic ?? b.purpose ?? 'حجز قاعة',
            requestedDate: b.startDate,
            duration: (() => {
                const start = new Date(b.defaultStartTime);
                const end = new Date(b.defaultEndTime);
                return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
            })(),
            requestedRoom: b.room.name,
            status: b.status.toLowerCase(),
        }));

        return {
            stats: {
                activeCourses,
                totalStudents,
                totalSessions,
                upcomingSessions: upcomingSessions.length,
                pendingRoomBookings: pendingRoomBookings.length,
            },
            upcomingSessions,
            pendingRoomBookings,
        };
    }

    /**
     * Get publicly browsable active courses (for explore page)
     */
    async getExploreCourses() {
        const courses = await prisma.course.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            include: {
                trainer: { select: { name: true, avatar: true } },
                category: { select: { name: true } },
                enrollments: {
                    where: { status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT'] } },
                    select: { id: true },
                },
                sessions: { select: { id: true, type: true } },
            },
        });

        const categories = await prisma.courseCategory.findMany({
            orderBy: { name: 'asc' },
        });

        return {
            courses: courses.map(c => ({
                id: c.id,
                title: c.title,
                description: c.description ?? '',
                shortDescription: c.shortDescription ?? '',
                category: c.category?.name ?? 'عام',
                image: c.image ?? null,
                studentsCount: c.enrollments.length,
                sessionsCount: c.sessions.length,
                duration: `${c.duration} ساعة`,
                trainer: {
                    name: c.trainer?.name ?? '—',
                    avatar: c.trainer?.avatar ?? null,
                },
                price: Number(c.price),
                deliveryType: c.sessions[0]?.type === 'ONLINE' ? 'online'
                    : c.sessions[0]?.type === 'IN_PERSON' ? 'in_person'
                        : c.sessions.length > 0 ? 'hybrid' : 'online',
                startDate: c.startDate,
                createdAt: c.createdAt,
            })),
            categories: [{ id: 'all', name: 'الكل' }, ...categories.map(c => ({ id: c.id, name: c.name }))],
        };
    }

    /**
     * Get all courses created by this trainer
     */
    async getCourses(userId: string) {
        const courses = await prisma.course.findMany({
            where: { trainerId: userId },
            include: {
                category: { select: { name: true } },
                _count: { select: { enrollments: true } },
                roomBookings: {
                    select: { status: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return courses.map(c => {
            const latestBooking = c.roomBookings[0];
            let displayStatus = c.status.toLowerCase();
            if (latestBooking?.status === 'PENDING_PAYMENT') displayStatus = 'payment_required';
            else if (latestBooking?.status === 'PENDING_APPROVAL') displayStatus = 'pending_approval';

            return {
                id: c.id,
                title: c.title,
                shortDescription: c.shortDescription ?? '',
                description: c.description ?? '',
                image: c.image ?? null,
                price: Number(c.price),
                startDate: c.startDate,
                endDate: c.endDate,
                maxStudents: c.maxStudents,
                minStudents: c.minStudents,
                enrolledStudents: c._count.enrollments,
                status: displayStatus,
                category: c.category?.name ?? '—',
                createdAt: c.createdAt,
                prerequisites: c.prerequisites ? c.prerequisites.split('\n') : [],
                objectives: c.objectives ?? [],
                tags: c.tags ?? [],
            };
        });
    }

    /**
     * Get a single course by ID (must belong to this trainer)
     */
    async getTrainerCourseById(userId: string, courseId: string) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, trainerId: userId },
            include: {
                category: { select: { id: true, name: true } },
                _count: { select: { enrollments: true } },
            },
        });

        if (!course) throw new Error('الدورة غير موجودة أو لا تنتمي لهذا المدرب');

        return {
            id: course.id,
            title: course.title,
            shortDescription: course.shortDescription ?? '',
            description: course.description ?? '',
            image: course.image ?? null,
            price: Number(course.price),
            duration: course.duration,
            startDate: course.startDate,
            endDate: course.endDate,
            maxStudents: course.maxStudents,
            minStudents: course.minStudents,
            status: course.status.toLowerCase(),
            enrolledStudents: course._count.enrollments,
            category: course.category?.name ?? '',
            categoryId: course.categoryId ?? '',
            prerequisites: course.prerequisites ? course.prerequisites.split('\n').filter(Boolean) : [],
            objectives: course.objectives ?? [],
            tags: course.tags ?? [],
            createdAt: course.createdAt,
        };
    }

    /**
     * Update a course that belongs to this trainer
     */
    async updateTrainerCourse(userId: string, courseId: string, data: any) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, trainerId: userId },
        });
        if (!course) throw new Error('الدورة غير موجودة أو لا تنتمي لهذا المدرب');

        return prisma.course.update({
            where: { id: courseId },
            data: {
                title: data.title,
                description: data.description,
                shortDescription: data.shortDescription,
                price: Number(data.price),
                duration: Number(data.duration),
                maxStudents: Number(data.maxStudents),
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                categoryId: data.categoryId || null,
                objectives: data.objectives ?? [],
                prerequisites: data.prerequisites?.length ? data.prerequisites.join('\n') : null,
                tags: data.tags ?? [],
            },
        });
    }

    /**
     * Get all students enrolled in a course that belongs to this trainer
     */
    async getCourseStudents(userId: string, courseId: string) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, trainerId: userId },
            select: { id: true, title: true, maxStudents: true },
        });

        if (!course) throw new Error('الدورة غير موجودة أو لا تنتمي لهذا المدرب');

        const enrollments = await prisma.enrollment.findMany({
            where: { courseId, deletedAt: null },
            include: {
                student: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });

        return {
            course: { id: course.id, title: course.title, maxStudents: course.maxStudents },
            enrollments: enrollments.map(e => ({
                id: e.id,
                studentId: e.studentId,
                courseId: e.courseId,
                enrolledAt: e.enrolledAt,
                status: e.status.toLowerCase(),
                student: {
                    id: e.student.id,
                    name: e.student.name,
                    email: e.student.email,
                    phone: e.student.phone,
                },
            })),
        };
    }

    /**
     * Unenroll (cancel) a student from a trainer’s course
     */
    async unenrollStudent(userId: string, courseId: string, enrollmentId: string, reason: string) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, trainerId: userId },
        });
        if (!course) throw new Error('الدورة غير موجودة أو لا تنتمي لهذا المدرب');

        return prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                status: 'CANCELLED',
                cancellationReason: reason,
            },
        });
    }

    /**
     * Get a single ACTIVE course by ID for public viewing
     */
    async getPublicCourseById(courseId: string) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, status: 'ACTIVE' },
            include: {
                trainer: {
                    select: {
                        name: true,
                        avatar: true,
                        email: true,
                        trainerProfile: {
                            select: { bio: true, specialties: true }
                        }
                    }
                },
                category: { select: { name: true } },
                sessions: {
                    where: { status: { not: 'CANCELLED' } },
                    orderBy: { startTime: 'asc' },
                    include: { room: { select: { name: true, location: true } } },
                },
                enrollments: {
                    where: { status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT'] } },
                    select: { id: true },
                },
            }
        });

        if (!course) throw new Error('الدورة غير موجودة أو غير نشطة');

        return {
            id: course.id,
            title: course.title,
            category: course.category?.name ?? 'عام',
            shortDescription: course.shortDescription ?? '',
            description: course.description ?? '',
            image: course.image ?? null,
            price: Number(course.price),
            startDate: course.startDate,
            endDate: course.endDate,
            maxStudents: course.maxStudents,
            enrolledCount: course.enrollments.length,
            prerequisites: course.prerequisites
                ? course.prerequisites.split(/\n|,/).map(s => s.trim()).filter(Boolean)
                : [],
            objectives: course.objectives,
            tags: course.tags,
            deliveryType: course.sessions[0]?.type === 'ONLINE' ? 'online'
                : course.sessions[0]?.type === 'IN_PERSON' ? 'in_person'
                    : course.sessions.length > 0 ? 'hybrid' : 'online',
            sessions: course.sessions.map(s => ({
                id: s.id,
                topic: s.topic ?? null,
                startTime: s.startTime,
                endTime: s.endTime,
                type: s.type.toLowerCase(),
                status: s.status,
                meetingLink: s.meetingLink ?? null,
                location: s.location ?? null,
                room: s.room ? { name: s.room.name, location: s.room.location ?? null } : null,
            })),
            instructor: {
                name: course.trainer?.name ?? 'مدرب',
                avatar: course.trainer?.avatar ?? null,
                email: course.trainer?.email ?? null,
                bio: course.trainer?.trainerProfile?.bio ?? null,
                specialties: course.trainer?.trainerProfile?.specialties ?? [],
            },
        };
    }

    /**
     * Get all active halls across all institutes
     */
    async getHalls() {
        return prisma.room.findMany({
            where: { isActive: true },
            include: {
                institute: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    /**
     * Get a single hall by ID
     */
    async getHallById(hallId: string) {
        const room = await prisma.room.findFirst({
            where: { id: hallId, isActive: true },
            include: {
                institute: {
                    select: { id: true, name: true, phone: true, email: true, website: true, address: true }
                }
            }
        });

        if (!room) throw new Error("القاعة غير موجودة أو غير نشطة");
        return room;
    }

    /**
     * Get availability for a specific hall (no ownership check)
     * Returns:
     *   - availability: the hall's defined working hours schedule
     *   - bookedSessions: all time ranges that are already taken (from both Sessions and RoomBookings)
     */
    async getHallAvailability(hallId: string) {
        const room = await prisma.room.findFirst({
            where: { id: hallId, isActive: true },
        });

        if (!room) throw new Error("القاعة غير موجودة أو غير نشطة");

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // 1. Get all active RoomBookings for this room (any non-cancelled status)
        const activeRoomBookings = await prisma.roomBooking.findMany({
            where: {
                roomId: room.id,
                status: { not: 'CANCELLED' },
                endDate: { gte: yesterday },
            },
            select: { id: true, defaultStartTime: true, defaultEndTime: true, startDate: true, endDate: true }
        });

        const activeBookingIds = activeRoomBookings.map(rb => rb.id);

        // 2. Get all sessions tied directly to this room OR via a room booking
        const sessions = await prisma.session.findMany({
            where: {
                status: { not: 'CANCELLED' },
                startTime: { gte: yesterday },
                OR: [
                    { roomId: room.id },
                    { roomBookingId: { in: activeBookingIds } }
                ]
            },
            select: { startTime: true, endTime: true }
        });

        // 3. For RoomBookings that have NO sessions yet (e.g. PENDING_APPROVAL without sessions)
        //    we still block the booking's defaultStartTime..defaultEndTime on each day in range
        const sessionBookingIds = new Set(
            (await prisma.session.findMany({
                where: { roomBookingId: { in: activeBookingIds } },
                select: { roomBookingId: true }
            })).map(s => s.roomBookingId)
        );

        const bookingsWithoutSessions = activeRoomBookings.filter(rb => !sessionBookingIds.has(rb.id));

        // Expand bookings without sessions into a list of {startTime, endTime} per day in their range
        const extraBlocked: { startTime: Date; endTime: Date }[] = [];
        for (const rb of bookingsWithoutSessions) {
            const cursor = new Date(rb.startDate);
            const end = new Date(rb.endDate);
            while (cursor <= end) {
                const dateStr = cursor.toISOString().substring(0, 10);
                const sTime = rb.defaultStartTime.toISOString().substring(11, 16); // HH:MM
                const eTime = rb.defaultEndTime.toISOString().substring(11, 16);
                extraBlocked.push({
                    startTime: new Date(`${dateStr}T${sTime}:00`),
                    endTime: new Date(`${dateStr}T${eTime}:00`),
                });
                cursor.setDate(cursor.getDate() + 1);
            }
        }

        return {
            availability: (room as any).availability,
            bookedSessions: [...sessions, ...extraBlocked]
        };
    }


    /**
     * Create a new course (Trainer)
     * Handles standard courses, or "in_person" courses where a hall is booked and a payment receipt is required.
     */
    async createCourse(userId: string, data: any, paymentReceiptPath?: string) {
        // Validate Trainer
        const trainer = await prisma.user.findUnique({
            where: { id: userId, role: 'TRAINER' }
        });
        if (!trainer) throw new Error("لم يتم العثور على المدرب");

        const sessionType = data.deliveryType === "online" ? "ONLINE" : "IN_PERSON";

        const mappedSessions = (data.sessions || []).map((session: any) => ({
            startTime: new Date(`${session.date}T${session.startTime}`),
            endTime: new Date(`${session.date}T${session.endTime}`),
            type: sessionType,
            status: "SCHEDULED" as const,
            location: session.location,
            topic: session.topic || "",
        }));

        let finalStartDate = new Date(data.startDate || Date.now());
        let finalEndDate = new Date(data.endDate || Date.now());

        if (mappedSessions.length > 0) {
            const sortedSessions = [...mappedSessions].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
            finalStartDate = sortedSessions[0].startTime;
            finalEndDate = sortedSessions[sortedSessions.length - 1].endTime;
        }

        let instituteId = data.instituteId;
        if (!instituteId && data.hallId) {
            // Need to derive institute from the selected hall
            const room = await prisma.room.findUnique({ where: { id: data.hallId } });
            if (!room) throw new Error("القاعة المحددة غير موجودة");
            instituteId = room.instituteId;
        }

        // 1. Create Course
        const course = await prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                shortDescription: data.shortDescription,
                price: Number(data.price),
                duration: Number(data.duration),
                startDate: finalStartDate,
                endDate: finalEndDate,
                maxStudents: Number(data.maxStudents),
                minStudents: Number(data.minStudents) || 1,
                status: "DRAFT", // Course stays DRAFT until RoomBooking is APPROVED
                image: data.image,
                trainerId: trainer.id,
                instituteId: instituteId || null,
                categoryId: data.categoryId,
                objectives: data.objectives || [],
                prerequisites: data.prerequisites ? data.prerequisites.join('\n') : null,
                tags: data.tags || [],
                sessions: data.hallId ? undefined : {
                    create: mappedSessions
                }
            }
        });

        // 2. Create Room Booking & Payment (if physical hall selected)
        if (data.hallId && mappedSessions.length >= 0) {
            if (!paymentReceiptPath) {
                // Technically shouldn't happen due to frontend validation, but protecting backend
                throw new Error("يجب إرفاق إيصال الدفع لحجز القاعة");
            }

            const room = await prisma.room.findUnique({ where: { id: data.hallId } });
            if (!room) throw new Error("القاعة المحددة غير موجودة");

            const totalHours = mappedSessions.reduce((acc: number, session: any) => {
                const diffMs = session.endTime.getTime() - session.startTime.getTime();
                return acc + (diffMs / (1000 * 60 * 60));
            }, 0);

            const totalPrice = totalHours * Number(room.pricePerHour);

            const roomBooking = await prisma.roomBooking.create({
                data: {
                    bookingMode: "CUSTOM_TIME",
                    startDate: finalStartDate,
                    endDate: finalEndDate,
                    selectedDays: [],
                    defaultStartTime: mappedSessions[0]?.startTime || new Date(),
                    defaultEndTime: mappedSessions[0]?.endTime || new Date(),
                    status: "PENDING_APPROVAL", // Pending Institute Owner approval
                    totalPrice: totalPrice,
                    roomId: room.id,
                    requestedById: userId,
                    courseId: course.id,
                    purpose: `حجز لدورة المدرب: ${course.title}`
                }
            });

            // Create Payment Request
            await prisma.payment.create({
                data: {
                    amount: totalPrice,
                    currency: "YER", // Defaulting to Yemen Rial
                    depositSlipImage: paymentReceiptPath,
                    notes: `إيصال دفع لقيمة حجز قاعة (${room.name}) للدورة (${course.title})`,
                    status: "PENDING_REVIEW",
                    roomBookingId: roomBooking.id
                }
            });

            // Associate sessions with both Course and RoomBooking
            if (mappedSessions.length > 0) {
                await prisma.session.createMany({
                    data: mappedSessions.map((session: any) => ({
                        ...session,
                        courseId: course.id,
                        roomBookingId: roomBooking.id,
                        roomId: room.id
                    }))
                });
            }
        }

        return course;
    }

    /**
     * Get the trainer's own profile (user + trainerProfile)
     */
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                status: true,
                createdAt: true,
                trainerProfile: {
                    select: {
                        bio: true,
                        cvUrl: true,
                        specialties: true,
                        certificatesUrls: true,
                        verificationStatus: true,
                    },
                },
            },
        });

        if (!user) throw new Error('المستخدم غير موجود');

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            avatar: user.avatar ?? null,
            role: user.role.toLowerCase(),
            status: user.status.toLowerCase(),
            createdAt: user.createdAt,
            bio: user.trainerProfile?.bio ?? '',
            cvUrl: user.trainerProfile?.cvUrl ?? null,
            specialties: user.trainerProfile?.specialties ?? [],
            certificatesUrls: user.trainerProfile?.certificatesUrls ?? [],
            verificationStatus: user.trainerProfile?.verificationStatus ?? null,
        };
    }

    /**
     * Update the trainer's own profile (name, phone, bio, specialties)
     */
    async updateProfile(userId: string, data: { name?: string; phone?: string; bio?: string; specialties?: string[]; avatarPath?: string }) {
        // Update base user fields
        await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.avatarPath && { avatar: data.avatarPath }),
            },
        });

        // Update trainer profile fields
        await prisma.trainerProfile.upsert({
            where: { userId },
            create: {
                userId,
                bio: data.bio ?? '',
                specialties: data.specialties ?? [],
                certificatesUrls: [],
            },
            update: {
                ...(data.bio !== undefined && { bio: data.bio }),
                ...(data.specialties !== undefined && { specialties: data.specialties }),
            },
        });

        return this.getProfile(userId);
    }

    /**
     * Change password — validates old password before updating
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('المستخدم غير موجود');

        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) throw new Error('كلمة المرور الحالية غير صحيحة');

        const hashed = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed, failedLoginAttempts: 0, lockUntil: null },
        });

        return { message: 'تم تغيير كلمة المرور بنجاح' };
    }

    /**
     * Get all unique students enrolled in any of this trainer's courses
     */
    async getAllStudents(userId: string) {
        // Get all trainer course IDs
        const courses = await prisma.course.findMany({
            where: { trainerId: userId },
            select: { id: true, title: true },
        });
        const courseIds = courses.map(c => c.id);
        const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]));

        if (courseIds.length === 0) return { students: [], totalStudents: 0, totalEnrollments: 0 };

        // Get all active enrollments for these courses
        const enrollments = await prisma.enrollment.findMany({
            where: {
                courseId: { in: courseIds },
                status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT', 'COMPLETED'] },
            },
            select: {
                id: true,
                courseId: true,
                status: true,
                enrolledAt: true,
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });

        // Group enrollments by student
        const studentMap = new Map<string, {
            id: string; name: string; email: string; phone: string | null; avatar: string | null;
            enrolledCourses: { courseId: string; courseTitle: string; enrollmentId: string; status: string; enrolledAt: Date }[];
            lastActivity: Date;
        }>();

        for (const e of enrollments) {
            const s = e.student;
            if (!studentMap.has(s.id)) {
                studentMap.set(s.id, {
                    id: s.id,
                    name: s.name,
                    email: s.email,
                    phone: s.phone,
                    avatar: s.avatar,
                    enrolledCourses: [],
                    lastActivity: e.enrolledAt,
                });
            }
            const entry = studentMap.get(s.id)!;
            entry.enrolledCourses.push({
                courseId: e.courseId,
                courseTitle: courseMap[e.courseId] ?? '',
                enrollmentId: e.id,
                status: e.status.toLowerCase(),
                enrolledAt: e.enrolledAt,
            });
            if (e.enrolledAt > entry.lastActivity) entry.lastActivity = e.enrolledAt;
        }

        const students = Array.from(studentMap.values()).map(s => ({
            ...s,
            totalCourses: s.enrolledCourses.length,
        }));

        return {
            students,
            totalStudents: students.length,
            totalEnrollments: enrollments.length,
        };
    }

    /**
     * Get enrollments for courses owned by this trainer
     */
    async getEnrollments(trainerId: string) {
        return prisma.enrollment.findMany({
            where: {
                course: {
                    trainerId: trainerId
                }
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                },
                payments: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                enrolledAt: 'desc'
            }
        });
    }

    /**
     * Update enrollment status (Accept/Reject)
     */
    async updateEnrollmentStatus(trainerId: string, enrollmentId: string, status: 'ACTIVE' | 'CANCELLED', reason?: string) {
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                id: enrollmentId,
                course: {
                    trainerId: trainerId
                }
            },
            include: {
                payments: true
            }
        });

        if (!enrollment) {
            throw new Error('التسجيل غير موجود أو لا تنتمي لدوراتك');
        }

        const updateData: any = { status };
        if (reason) {
            updateData.cancellationReason = reason;
        }

        const updatedEnrollment = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: updateData
        });

        // If status is ACTIVE, approve the latest payment as well if it's pending review
        if (status === 'ACTIVE' && enrollment.payments.length > 0) {
            const latestPayment = enrollment.payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
            if (latestPayment.status === 'PENDING_REVIEW') {
                await prisma.payment.update({
                    where: { id: latestPayment.id },
                    data: {
                        status: 'APPROVED',
                        reviewedBy: trainerId,
                        reviewedAt: new Date(),
                        notes: 'تم القبول من قبل المدرب'
                    }
                });
            }
        }

        return updatedEnrollment;
    }

    /**
     * Get all room bookings requested by this trainer
     */
    async getRoomBookings(userId: string) {
        return prisma.roomBooking.findMany({
            where: { requestedById: userId },
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true,
                        type: true,
                        facilities: true,
                        image: true,
                        description: true,
                        location: true,
                        institute: { select: { name: true } }
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export default new TrainerService();
