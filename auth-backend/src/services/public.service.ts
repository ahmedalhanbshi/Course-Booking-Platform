import prisma from '../config/database';

class PublicService {
    async getStats() {
        const [studentsCount, coursesCount, trainersCount, institutesCount] = await Promise.all([
            prisma.user.count({ where: { role: 'STUDENT', status: 'ACTIVE' } }),
            prisma.course.count({ where: { status: 'ACTIVE' } }),
            prisma.user.count({ where: { role: 'TRAINER', status: 'ACTIVE' } }),
            prisma.institute.count({ where: { user: { status: 'ACTIVE' } } }),
        ]);

        return {
            students: studentsCount,
            courses: coursesCount,
            trainers: trainersCount,
            institutes: institutesCount,
        };
    }

    async getCategories() {
        return prisma.courseCategory.findMany({
            include: {
                _count: {
                    select: { courses: { where: { status: 'ACTIVE' } } },
                },
            },
        });
    }

    async getFeaturedCourses() {
        return prisma.course.findMany({
            where: { status: 'ACTIVE' },
            take: 4,
            orderBy: {
                enrollments: { _count: 'desc' },
            },
            include: {
                category: true,
                trainer: {
                    select: { id: true, name: true, avatar: true },
                },
                institute: {
                    select: { id: true, name: true, logo: true },
                },
            },
        });
    }

    async getTags() {
        return prisma.tag.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async getExploreCourses() {
        let courses: any[] = [];
        try {
            courses = await prisma.course.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                include: {
                    trainer: { select: { name: true, avatar: true } },
                    institute: {
                        select: {
                            name: true,
                            logo: true,
                            user: { select: { avatar: true } },
                        },
                    },
                    category: { select: { name: true } },
                    enrollments: {
                        where: { status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT'] } },
                        select: { id: true },
                    },
                    sessions: { select: { id: true, type: true } },
                },
            });
        } catch (error: any) {
            // If the database is freshly provisioned / partially migrated, fail soft for explore endpoint.
            if (error?.code !== 'P2021') throw error;
            courses = [];
        }

        const allStaffIds = [
            ...new Set(courses.flatMap((course) => ((course as any).staffTrainerIds as string[] | undefined) ?? [])),
        ];

        const staffMap = new Map<string, { name: string }>();
        if (allStaffIds.length > 0) {
            const staffList = await prisma.instituteStaff.findMany({
                where: { id: { in: allStaffIds } },
                select: { id: true, name: true },
            });
            staffList.forEach((staff) => {
                staffMap.set(staff.id, staff);
            });
        }

        let categories: any[] = [];
        try {
            categories = await prisma.courseCategory.findMany({
                orderBy: { name: 'asc' },
            });
        } catch (error: any) {
            if (error?.code !== 'P2021') throw error;
            categories = [];
        }

        return {
            courses: courses.map((course) => {
                const staffTrainerIds = ((course as any).staffTrainerIds as string[] | undefined) ?? [];
                const staffTrainers = staffTrainerIds.map((id) => ({
                    name: staffMap.get(id)?.name ?? '—',
                }));

                return {
                    id: course.id,
                    title: course.title,
                    description: course.description ?? '',
                    shortDescription: course.shortDescription ?? '',
                    category: course.category?.name ?? 'عام',
                    image: course.image ?? null,
                    studentsCount: course.enrollments.length,
                    sessionsCount: course.sessions.length,
                    duration: `${course.duration} ساعة`,
                    trainer: {
                        name: course.trainer?.name ?? staffTrainers[0]?.name ?? course.institute?.name ?? '—',
                        avatar: course.trainer?.avatar ?? course.institute?.logo ?? course.institute?.user?.avatar ?? null,
                    },
                    staffTrainers,
                    price: Number(course.price),
                    deliveryType: course.sessions[0]?.type === 'ONLINE'
                        ? 'online'
                        : course.sessions[0]?.type === 'IN_PERSON'
                            ? 'in_person'
                            : course.sessions.length > 0
                                ? 'hybrid'
                                : 'online',
                    startDate: course.startDate,
                    createdAt: course.createdAt,
                };
            }),
            categories: [{ id: 'all', name: 'الكل' }, ...categories.map((category) => ({ id: category.id, name: category.name }))],
        };
    }

    async getPublicCourseById(courseId: string) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, status: 'ACTIVE' },
            include: {
                trainer: {
                    select: {
                        name: true,
                        avatar: true,
                        email: true,
                        phone: true,
                        trainerProfile: {
                            select: { bio: true, specialties: true },
                        },
                        bankAccounts: {
                            select: {
                                id: true,
                                bankName: true,
                                accountName: true,
                                accountNumber: true,
                                iban: true,
                                isActive: true,
                            },
                        },
                    },
                },
                category: { select: { name: true } },
                sessions: {
                    where: { status: { not: 'CANCELLED' } },
                    orderBy: { startTime: 'asc' },
                    include: { room: { select: { id: true, name: true, location: true } } },
                },
                enrollments: {
                    where: { status: { in: ['ACTIVE', 'PRELIMINARY', 'PENDING_PAYMENT'] } },
                    select: { id: true },
                },
                institute: {
                    select: {
                        name: true,
                        logo: true,
                        email: true,
                        phone: true,
                        description: true,
                        user: { select: { avatar: true } },
                        bankAccounts: {
                            where: { isActive: true },
                            select: {
                                id: true,
                                bankName: true,
                                accountName: true,
                                accountNumber: true,
                                iban: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            throw new Error('Course not found or inactive');
        }

        const staffTrainerIds = (course as any).staffTrainerIds as string[] | undefined;
        let staffTrainers: { id: string; name: string; bio: string | null; email: string | null; phone: string | null; specialties: string[] }[] = [];
        if (staffTrainerIds && staffTrainerIds.length > 0) {
            staffTrainers = await prisma.instituteStaff.findMany({
                where: { id: { in: staffTrainerIds } },
                select: { id: true, name: true, bio: true, email: true, phone: true, specialties: true },
            });
        }

        return {
            id: course.id,
            title: course.title,
            category: (course as any).category?.name ?? 'عام',
            shortDescription: course.shortDescription ?? '',
            description: course.description ?? '',
            image: course.image ?? null,
            price: Number(course.price),
            startDate: course.startDate,
            endDate: course.endDate,
            maxStudents: course.maxStudents,
            enrolledCount: (course as any).enrollments.length,
            prerequisites: course.prerequisites
                ? course.prerequisites.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
                : [],
            objectives: course.objectives,
            tags: course.tags,
            deliveryType: (course as any).sessions[0]?.type === 'ONLINE'
                ? 'online'
                : (course as any).sessions[0]?.type === 'IN_PERSON'
                    ? 'in_person'
                    : (course as any).sessions.length > 0
                        ? 'hybrid'
                        : 'online',
            sessions: (course as any).sessions.map((session: any) => ({
                id: session.id,
                topic: session.topic ?? null,
                startTime: session.startTime,
                endTime: session.endTime,
                type: session.type.toLowerCase(),
                status: session.status,
                meetingLink: session.meetingLink ?? null,
                location: session.location ?? null,
                roomId: session.roomId ?? null,
                room: session.room
                    ? { id: session.room.id, name: session.room.name, location: session.room.location ?? null }
                    : null,
            })),
            staffTrainers,
            institute: course.trainerId === null && (course as any).institute
                ? {
                    name: (course as any).institute.name,
                    logo: (course as any).institute.logo,
                    email: (course as any).institute.email,
                    phone: (course as any).institute.phone,
                    description: (course as any).institute.description,
                }
                : null,
            instructor: {
                name: (course as any).trainer?.name ?? (staffTrainers.length > 0 ? staffTrainers[0].name : ((course as any).institute?.name ?? 'مدرب')),
                avatar: (course as any).trainer?.avatar ?? ((course as any).institute?.logo ?? (course as any).institute?.user?.avatar ?? null),
                email: (course as any).trainer?.email ?? (staffTrainers.length > 0 ? staffTrainers[0].email : ((course as any).institute?.email ?? null)),
                phone: (course as any).trainer?.phone ?? (staffTrainers.length > 0 ? staffTrainers[0].phone : ((course as any).institute?.phone ?? null)),
                bio: (course as any).trainer?.trainerProfile?.bio ?? (staffTrainers.length > 0 ? staffTrainers[0].bio : ((course as any).institute?.description ?? null)),
                specialties: (course as any).trainer?.trainerProfile?.specialties ?? (staffTrainers.length > 0 ? staffTrainers[0].specialties : []),
                bankAccounts: (course as any).trainer?.bankAccounts ?? (course as any).institute?.bankAccounts ?? [],
            },
        };
    }

    async getHalls() {
        return prisma.room.findMany({
            where: { isActive: true },
            include: {
                institute: {
                    select: {
                        id: true,
                        name: true,
                        bankAccounts: {
                            where: { isActive: true },
                            select: { id: true, bankName: true, accountName: true, accountNumber: true, iban: true },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async getHallById(hallId: string) {
        const room = await prisma.room.findFirst({
            where: { id: hallId, isActive: true },
            include: {
                institute: {
                    include: {
                        user: { select: { avatar: true } },
                        bankAccounts: {
                            where: { isActive: true },
                            select: { id: true, bankName: true, accountName: true, accountNumber: true, iban: true },
                        },
                    },
                },
            },
        });

        if (!room) {
            throw new Error('Hall not found or inactive');
        }

        return {
            ...room,
            instituteName: room.institute?.name,
            instituteDescription: room.institute?.description,
            instituteLogo: room.institute?.logo || room.institute?.user?.avatar,
            bankAccounts: room.institute?.bankAccounts || [],
        };
    }

    async getHallAvailability(hallId: string) {
        const room = await prisma.room.findFirst({
            where: { id: hallId, isActive: true },
        });

        if (!room) {
            throw new Error('Hall not found or inactive');
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const activeRoomBookings = await prisma.roomBooking.findMany({
            where: {
                roomId: room.id,
                status: { not: 'CANCELLED' },
                endDate: { gte: yesterday },
            },
            select: { id: true, defaultStartTime: true, defaultEndTime: true, startDate: true, endDate: true },
        });

        const activeBookingIds = activeRoomBookings.map((booking) => booking.id);

        const sessions = await prisma.session.findMany({
            where: {
                status: { not: 'CANCELLED' },
                startTime: { gte: yesterday },
                OR: [
                    { roomId: room.id },
                    { roomBookingId: { in: activeBookingIds } },
                ],
            },
            select: { startTime: true, endTime: true },
        });

        const sessionBookingIds = new Set(
            (
                await prisma.session.findMany({
                    where: { roomBookingId: { in: activeBookingIds } },
                    select: { roomBookingId: true },
                })
            ).map((session) => session.roomBookingId)
        );

        const bookingsWithoutSessions = activeRoomBookings.filter((booking) => !sessionBookingIds.has(booking.id));

        const extraBlocked: { startTime: Date; endTime: Date }[] = [];
        for (const booking of bookingsWithoutSessions) {
            const cursor = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            while (cursor <= end) {
                const dateStr = cursor.toISOString().substring(0, 10);
                const startTime = booking.defaultStartTime.toISOString().substring(11, 16);
                const endTime = booking.defaultEndTime.toISOString().substring(11, 16);
                extraBlocked.push({
                    startTime: new Date(`${dateStr}T${startTime}:00`),
                    endTime: new Date(`${dateStr}T${endTime}:00`),
                });
                cursor.setDate(cursor.getDate() + 1);
            }
        }

        return {
            availability: (room as any).availability,
            bookedSessions: [...sessions, ...extraBlocked],
        };
    }
}

export default new PublicService();
