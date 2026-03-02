import prisma from "../config/database";

class InstituteService {
    /**
     * Get institute dashboard data for the logged-in institute admin
     */
    async getDashboardData(userId: string) {
        // Get institute by userId
        const institute = await prisma.institute.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        // Get stats in parallel
        const [
            activeCourses,
            totalCourses,
            rooms,
            todayBookings,
            totalStudents,
            monthlyRevenue,
            recentBookings,
            upcomingCourses,
        ] = await Promise.all([
            // Active courses count
            prisma.course.count({
                where: { instituteId: institute.id, status: "ACTIVE", trainerId: null },
            }),
            // Total courses count
            prisma.course.count({
                where: { instituteId: institute.id, trainerId: null },
            }),
            // Rooms count
            prisma.room.count({
                where: { instituteId: institute.id, isActive: true },
            }),
            // Today's room bookings
            prisma.roomBooking.count({
                where: {
                    room: { instituteId: institute.id },
                    startDate: {
                        lte: new Date(),
                    },
                    endDate: {
                        gte: new Date(),
                    },
                },
            }),
            // Total unique students enrolled in institute courses
            prisma.enrollment.findMany({
                where: {
                    course: { instituteId: institute.id },
                    status: { in: ["ACTIVE", "COMPLETED", "PRELIMINARY"] },
                },
                select: { studentId: true },
                distinct: ["studentId"],
            }),
            // Monthly revenue from enrollments
            prisma.payment.aggregate({
                where: {
                    status: "APPROVED",
                    enrollment: {
                        course: { instituteId: institute.id },
                    },
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                _sum: { amount: true },
            }),
            // Recent room bookings
            prisma.roomBooking.findMany({
                where: {
                    room: { instituteId: institute.id },
                },
                include: {
                    room: { select: { name: true } },
                    course: { select: { title: true } },
                    requestedBy: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            }),
            // Upcoming courses
            prisma.course.findMany({
                where: {
                    instituteId: institute.id,
                    status: { in: ["ACTIVE", "DRAFT"] },
                    startDate: { gte: new Date() },
                    trainerId: null,
                },
                include: {
                    trainer: { select: { name: true } },
                    staffTrainer: { select: { name: true } },
                    _count: { select: { enrollments: true } },
                },
                orderBy: { startDate: "asc" },
                take: 5,
            }),
        ]);

        return {
            institute: {
                id: institute.id,
                name: institute.name,
                adminName: institute.user.name,
                verificationStatus: institute.verificationStatus,
            },
            stats: {
                activeCourses,
                totalCourses,
                rooms,
                roomBookingsToday: todayBookings,
                totalStudents: totalStudents.length,
                monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
            },
            recentBookings: recentBookings.map((b) => ({
                id: b.id,
                courseTitle: b.course?.title || "حجز مباشر",
                trainer: b.requestedBy?.name || "-",
                room: b.room.name,
                startDate: b.startDate,
                endDate: b.endDate,
                status: b.status.toLowerCase(),
            })),
            upcomingCourses: upcomingCourses.map((c) => ({
                id: c.id,
                title: c.title,
                trainer: c.staffTrainer?.name || c.trainer?.name || "غير محدد",
                startDate: c.startDate,
                enrolledStudents: c._count.enrollments,
                maxStudents: c.maxStudents,
            })),
        };
    }

    // =====================================================
    // PROFILE MANAGEMENT
    // =====================================================

    /**
     * Get institute profile data
     */
    async getInstituteProfile(userId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true },
                },
            },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        return {
            id: institute.id,
            name: institute.user.name,
            email: institute.user.email,
            phone: institute.user.phone,
            avatar: institute.user.avatar,
            role: "institute_admin",
            instituteName: institute.name,
            instituteLogo: institute.logo,
            instituteAddress: institute.address,
            instituteWebsite: institute.website,
            instituteDescription: institute.description,
            verificationStatus: institute.verificationStatus,
        };
    }

    /**
     * Update institute profile data
     */
    async updateInstituteProfile(
        userId: string,
        data: {
            name?: string;
            phone?: string;
            instituteName?: string;
            instituteAddress?: string;
            instituteWebsite?: string;
            instituteDescription?: string;
            avatar?: string;
            logo?: string;
        }
    ) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        // Update User info
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name !== undefined ? data.name : undefined,
                phone: data.phone !== undefined ? data.phone : undefined,
                avatar: data.avatar !== undefined ? data.avatar : undefined,
            },
        });

        // Update Institute info
        const updatedInstitute = await prisma.institute.update({
            where: { id: institute.id },
            data: {
                name: data.instituteName !== undefined ? data.instituteName : undefined,
                address: data.instituteAddress !== undefined ? data.instituteAddress : undefined,
                website: data.instituteWebsite !== undefined ? data.instituteWebsite : undefined,
                description: data.instituteDescription !== undefined ? data.instituteDescription : undefined,
                logo: data.logo !== undefined ? data.logo : undefined,
            },
        });

        return {
            id: updatedInstitute.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
            role: "institute_admin",
            instituteName: updatedInstitute.name,
            instituteLogo: updatedInstitute.logo,
            instituteAddress: updatedInstitute.address,
            instituteWebsite: updatedInstitute.website,
            instituteDescription: updatedInstitute.description,
            verificationStatus: updatedInstitute.verificationStatus,
        };
    }

    // =====================================================
    // STUDENT MANAGEMENT
    // =====================================================

    /**
     * Get all unique students enrolled in any course of this institute
     */
    async getInstituteStudents(userId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        // Fetch all enrollments for institute courses
        const enrollments = (await prisma.enrollment.findMany({
            where: {
                course: { instituteId: institute.id },
                status: { in: ["ACTIVE", "COMPLETED", "PRELIMINARY"] },
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        status: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        trainer: { select: { name: true } },
                    },
                },
            },
            orderBy: { enrolledAt: "desc" },
        })) as any[];

        // Group by student — one row per student
        const studentsMap = new Map<
            string,
            {
                id: string;
                name: string;
                email: string;
                phone: string | null;
                status: string;
                enrolledCourses: string[];
                trainerNames: string[];
                enrollmentStatuses: string[];
            }
        >();

        for (const enrollment of enrollments) {
            const s = enrollment.student;
            if (!studentsMap.has(s.id)) {
                studentsMap.set(s.id, {
                    id: s.id,
                    name: s.name,
                    email: s.email,
                    phone: s.phone,
                    status: s.status.toLowerCase(),
                    enrolledCourses: [],
                    trainerNames: [],
                    enrollmentStatuses: [],
                });
            }
            const entry = studentsMap.get(s.id)!;
            entry.enrolledCourses.push(enrollment.course.title);
            entry.trainerNames.push(enrollment.course.trainer?.name ?? "");
            entry.enrollmentStatuses.push(enrollment.status.toLowerCase());
        }

        return Array.from(studentsMap.values());
    }

    // =====================================================
    // COURSE MANAGEMENT
    // =====================================================

    /**
     * Get all courses for the institute
     */
    async getInstituteCourses(userId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const courses = await prisma.course.findMany({
            where: {
                instituteId: institute.id,
                trainerId: null
            },
            include: {
                trainer: {
                    select: { id: true, name: true, email: true },
                },
                staffTrainer: {
                    select: { id: true, name: true, email: true },
                },
                category: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return courses.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            shortDescription: c.shortDescription,
            image: c.image,
            price: Number(c.price),
            duration: c.duration,
            startDate: c.startDate,
            endDate: c.endDate,
            maxStudents: c.maxStudents,
            enrolledStudents: c._count.enrollments,
            status: c.status.toLowerCase(),
            trainerId: c.staffTrainerId || c.trainerId,
            trainer: {
                id: c.staffTrainer?.id || c.trainer?.id,
                name: c.staffTrainer?.name || c.trainer?.name,
                email: c.staffTrainer?.email || c.trainer?.email,
            },
            category: c.category?.name || "-",
            categoryId: c.categoryId,
            createdAt: c.createdAt,
            prerequisites: c.prerequisites ? c.prerequisites.split('\n') : [],
        }));
    }

    /**
     * Delete a course belonging to this institute
     */
    async deleteCourse(userId: string, courseId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, instituteId: institute.id, trainerId: null },
        });

        if (!course) {
            throw new Error("الدورة غير موجودة أو لا تنتمي لهذا المعهد");
        }

        await prisma.course.delete({
            where: { id: courseId },
        });

        return { message: "تم حذف الدورة بنجاح" };
    }

    /**
     * Change the trainer for a course belonging to this institute
     */
    async changeTrainer(userId: string, courseId: string, newTrainerId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, instituteId: institute.id, trainerId: null },
        });

        if (!course) {
            throw new Error("الدورة غير موجودة أو لا تنتمي لهذا المعهد");
        }

        // Verify new trainer exists in InstituteStaff
        const staffTrainer = await prisma.instituteStaff.findFirst({
            where: { id: newTrainerId, instituteId: institute.id, status: "ACTIVE" },
        });

        if (!staffTrainer) {
            throw new Error("المدرب غير موجود أو غير نشط في طاقم المعهد");
        }

        await prisma.course.update({
            where: { id: courseId },
            data: { staffTrainerId: newTrainerId, trainerId: null },
        });

        return { message: "تم تغيير المدرب بنجاح" };
    }

    /**
     * Get list of available trainers (active trainers)
     */
    async getAvailableTrainers() {
        const trainers = await prisma.user.findMany({
            where: {
                role: "TRAINER",
                status: "ACTIVE",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        coursesAsTrainer: {
                            where: { status: "ACTIVE" },
                        },
                    },
                },
            },
            orderBy: { name: "asc" },
        });

        return trainers.map((t) => ({
            id: t.id,
            name: t.name,
            email: t.email,
            phone: t.phone,
            status: t.status.toLowerCase(),
            createdAt: t.createdAt,
            activeCourses: (t as any)._count?.coursesAsTrainer ?? 0,
        }));
    }

    /**
     * Get all staff members for this institute
     */
    async getInstituteStaff(userId: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        return prisma.instituteStaff.findMany({
            where: { instituteId: institute.id },
            orderBy: { joinedAt: "desc" },
        });
    }

    /**
     * Get trainers (staff) for course creation dropdown
     */
    async getInstituteTrainers(userId: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        return prisma.instituteStaff.findMany({
            where: { instituteId: institute.id, status: "ACTIVE" },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                specialties: true,
            },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Add a trainer to this institute's staff roster (standalone — no User account needed)
     */
    async addInstituteStaff(
        userId: string,
        data: {
            name: string;
            email?: string;
            phone?: string;
            bio?: string;
            specialties?: string[];
            notes?: string;
        },
    ) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");
        if (!data.name) throw new Error("اسم المدرب مطلوب");

        return prisma.instituteStaff.create({
            data: {
                instituteId: institute.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                bio: data.bio,
                specialties: data.specialties ?? [],
                notes: data.notes,
            },
        });
    }

    /**
     * Remove a staff member from this institute
     */
    async removeInstituteStaff(userId: string, staffId: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const staff = await prisma.instituteStaff.findFirst({
            where: { id: staffId, instituteId: institute.id },
        });
        if (!staff) throw new Error("لم يتم العثور على عضو الطاقم");

        await prisma.instituteStaff.delete({ where: { id: staffId } });
    }

    /**
     * Toggle staff status ACTIVE ↔ INACTIVE
     */
    async updateInstituteStaffStatus(
        userId: string,
        staffId: string,
        status: "ACTIVE" | "INACTIVE",
    ) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const staff = await prisma.instituteStaff.findFirst({
            where: { id: staffId, instituteId: institute.id },
        });
        if (!staff) throw new Error("لم يتم العثور على عضو الطاقم");

        return prisma.instituteStaff.update({
            where: { id: staffId },
            data: { status },
        });
    }

    /**
     * Update basic info of a staff member
     */
    async updateInstituteStaff(
        userId: string,
        staffId: string,
        data: {
            name?: string;
            email?: string | null;
            phone?: string | null;
            bio?: string | null;
            notes?: string | null;
        },
    ) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const staff = await prisma.instituteStaff.findFirst({
            where: { id: staffId, instituteId: institute.id },
        });
        if (!staff) throw new Error("لم يتم العثور على المدرب");

        return prisma.instituteStaff.update({
            where: { id: staffId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                email: data.email,
                phone: data.phone,
                bio: data.bio,
                notes: data.notes,
            },
        });
    }

    // =====================================================
    // HALLS (ROOMS) MANAGEMENT
    // =====================================================

    /**
     * Get all active halls for an institute
     */
    async getInstituteHalls(userId: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const halls = await prisma.room.findMany({
            where: { instituteId: institute.id, isActive: true },
            orderBy: { name: "asc" },
        });

        return halls.map(hall => ({
            ...hall,
            institute: { name: institute.name }
        }));
    }

    /**
     * Get availability for a specific hall (owner check via userId)
     */
    async getInstituteHallAvailability(userId: string, hallId: string, dateStr?: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const room = await prisma.room.findFirst({
            where: { id: hallId, instituteId: institute.id },
        });

        if (!room) throw new Error("القاعة غير موجودة");

        const query: any = { roomId: room.id, status: { not: "CANCELLED" } };

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        query.startTime = { gte: yesterday };

        const bookedSessions = await prisma.session.findMany({
            where: query,
            select: { startTime: true, endTime: true }
        });

        return {
            availability: (room as any).availability,
            bookedSessions: bookedSessions
        };
    }

    /**
     * Get availability for a specific hall by hallId only (no ownership check)
     * Used by trainers and students who don't own the hall
     */
    async getHallAvailabilityPublic(hallId: string, dateStr?: string) {
        const room = await prisma.room.findFirst({
            where: { id: hallId, isActive: true },
        });

        if (!room) throw new Error("القاعة غير موجودة أو غير نشطة");

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // 1. All non-cancelled RoomBookings for this room
        const activeRoomBookings = await prisma.roomBooking.findMany({
            where: {
                roomId: room.id,
                status: { not: 'CANCELLED' },
                endDate: { gte: yesterday },
            },
            select: { id: true, defaultStartTime: true, defaultEndTime: true, startDate: true, endDate: true }
        });

        const activeBookingIds = activeRoomBookings.map(rb => rb.id);

        // 2. Sessions tied to this room directly OR via any active RoomBooking
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

        // 3. Expand RoomBookings that have NO sessions yet into per-day blocked ranges
        const sessionBookingIds = new Set(
            (await prisma.session.findMany({
                where: { roomBookingId: { in: activeBookingIds } },
                select: { roomBookingId: true }
            })).map(s => s.roomBookingId)
        );

        const extraBlocked: { startTime: Date; endTime: Date }[] = [];
        for (const rb of activeRoomBookings.filter(rb => !sessionBookingIds.has(rb.id))) {
            const cursor = new Date(rb.startDate);
            const end = new Date(rb.endDate);
            while (cursor <= end) {
                const dateStr = cursor.toISOString().substring(0, 10);
                const sTime = rb.defaultStartTime.toISOString().substring(11, 16);
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
     * Add a new hall
     */
    async addInstituteHall(
        userId: string,
        data: {
            name: string;
            capacity: number;
            location?: string;
            locationUrl?: string;
            type?: string;
            description?: string;
            pricePerHour: number;
            facilities: string[];
            image?: string;
            availability?: any;
        },
    ) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        return prisma.room.create({
            data: {
                ...data,
                instituteId: institute.id,
            },
        });
    }

    /**
     * Update an existing hall
     */
    async updateInstituteHall(
        userId: string,
        hallId: string,
        data: Partial<{
            name: string;
            capacity: number;
            location: string | null;
            locationUrl: string | null;
            type: string;
            description: string | null;
            pricePerHour: number;
            facilities: string[];
            image: string | null;
            isActive: boolean;
            availability?: any;
        }>,
    ) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const hall = await prisma.room.findFirst({
            where: { id: hallId, instituteId: institute.id },
        });
        if (!hall) throw new Error("لم يتم العثور على القاعة");

        return prisma.room.update({
            where: { id: hallId },
            data,
        });
    }

    /**
     * Delete a hall
     */
    async removeInstituteHall(userId: string, hallId: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const hall = await prisma.room.findFirst({
            where: { id: hallId, instituteId: institute.id },
        });
        if (!hall) throw new Error("لم يتم العثور على القاعة");

        // Check if there are active bookings
        const count = await prisma.roomBooking.count({
            where: { roomId: hallId },
        });

        if (count > 0) {
            // Soft delete by setting isActive to false if there are bookings
            return prisma.room.update({
                where: { id: hallId },
                data: { isActive: false },
            });
        }

        return prisma.room.delete({
            where: { id: hallId },
        });
    }

    /**
     * Get all room bookings for an institute's halls
     */
    async getInstituteRoomBookings(userId: string) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        return prisma.roomBooking.findMany({
            where: {
                room: {
                    instituteId: institute.id,
                },
            },
            include: {
                room: {
                    select: { id: true, name: true },
                },
                course: {
                    select: { id: true, title: true },
                },
                requestedBy: {
                    select: { id: true, name: true, email: true },
                },
                approvedBy: {
                    select: { id: true, name: true },
                },
                payments: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    /**
     * Update room booking status (Approve/Reject)
     */
    async updateRoomBookingStatus(
        userId: string,
        bookingId: string,
        data: {
            status: "APPROVED" | "REJECTED";
            notes?: string;
            adminId: string;
            roomId?: string;
        },
    ) {
        const institute = await prisma.institute.findUnique({ where: { userId } });
        if (!institute) throw new Error("لم يتم العثور على المعهد");

        const booking = await prisma.roomBooking.findFirst({
            where: {
                id: bookingId,
                room: {
                    instituteId: institute.id,
                },
            },
            include: { payments: true }
        });

        if (!booking) throw new Error("لم يتم العثور على طلب الحجز");

        const updateData: any = {
            status: data.status,
            approvedById: data.adminId, // Track who approved/rejected it
        };

        if (data.notes && data.status === "REJECTED") {
            updateData.rejectionReason = data.notes;
        } else if (data.notes) {
            updateData.notes = data.notes;
        }

        if (data.roomId && data.status === "APPROVED") {
            // Allow changing the room when approving
            updateData.roomId = data.roomId;
        }

        const updatedBooking = await prisma.roomBooking.update({
            where: { id: bookingId },
            data: updateData,
            include: {
                room: { select: { id: true, name: true } },
                requestedBy: { select: { id: true, name: true } },
                payments: true
            },
        });

        // Cascade approval to Payment and Course if APPROVED
        if (data.status === "APPROVED") {
            if (updatedBooking.payments && updatedBooking.payments.length > 0) {
                for (const payment of updatedBooking.payments) {
                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: "APPROVED",
                            reviewedBy: data.adminId,
                            reviewedAt: new Date(),
                            notes: data.notes
                        }
                    });
                }
            }
            if (booking.courseId) {
                await prisma.course.update({
                    where: { id: booking.courseId },
                    data: { status: "ACTIVE" } // Publish course
                });
            }

            await prisma.session.updateMany({
                where: { roomBookingId: bookingId },
                data: { status: "SCHEDULED" }
            });
        }

        return updatedBooking;
    }

    // =====================================================
    // COURSE STUDENTS MANAGEMENT
    // =====================================================

    /**
     * Get course details and enrolled students for an institute's course
     */
    async getCourseStudents(userId: string, courseId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, instituteId: institute.id, trainerId: null },
            include: {
                trainer: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!course) {
            throw new Error("الدورة غير موجودة أو لا تنتمي لهذا المعهد");
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                courseId,
                deletedAt: null,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: { enrolledAt: "desc" },
        });

        return {
            course: {
                id: course.id,
                title: course.title,
                maxStudents: course.maxStudents,
                trainer: course.trainer,
            },
            enrollments: enrollments.map((e) => ({
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
     * Unenroll a student from a course (set status to CANCELLED)
     */
    async unenrollStudent(
        userId: string,
        courseId: string,
        enrollmentId: string,
        reason: string,
    ) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, instituteId: institute.id },
        });

        if (!course) {
            throw new Error("الدورة غير موجودة أو لا تنتمي لهذا المعهد");
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: { id: enrollmentId, courseId },
        });

        if (!enrollment) {
            throw new Error("التسجيل غير موجود");
        }

        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                status: "CANCELLED",
                cancellationReason: reason,
            },
        });

        return { message: "تم إلغاء تسجيل الطالب بنجاح" };
    }

    /**
     * Get course details by ID
     */
    async getCourseById(userId: string, courseId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, instituteId: institute.id, trainerId: null },
            include: {
                trainer: {
                    select: { id: true, name: true, email: true },
                },
                staffTrainer: {
                    select: { id: true, name: true, email: true },
                },
                category: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
        });

        if (!course) {
            throw new Error("الدورة غير موجودة أو لا تنتمي لهذا المعهد");
        }

        return {
            ...course,
            price: Number(course.price),
            enrolledStudents: course._count.enrollments,
            trainer: {
                id: course.staffTrainer?.id || course.trainer?.id,
                name: course.staffTrainer?.name || course.trainer?.name,
                email: course.staffTrainer?.email || course.trainer?.email,
            },
            category: course.category?.name || "-",
            prerequisites: course.prerequisites ? course.prerequisites.split('\n') : [],
        };
    }

    /**
     * Update course details
     */
    async updateCourse(userId: string, courseId: string, data: any) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, instituteId: institute.id, trainerId: null },
        });

        if (!course) {
            throw new Error("الدورة غير موجودة أو لا تنتمي لهذا المعهد");
        }

        // Validate trainer if changing against InstituteStaff
        if (data.trainerId) {
            const staffTrainer = await prisma.instituteStaff.findFirst({
                where: { id: data.trainerId, instituteId: institute.id, status: "ACTIVE" },
            });
            if (!staffTrainer) {
                throw new Error("المدرب غير موجود أو غير نشط في قائمة مدربي المعهد");
            }
        }

        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                title: data.title,
                description: data.description,
                shortDescription: data.shortDescription,
                image: data.image,
                price: data.price,
                duration: Number(data.duration),
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                maxStudents: Number(data.maxStudents),
                minStudents: Number(data.minStudents),
                status: data.status,
                staffTrainerId: data.trainerId,
                trainerId: null, // Clear platform trainer reference if using staff
                categoryId: data.categoryId,
                bookingTrigger: data.bookingTrigger,
                objectives: data.objectives,
                prerequisites: data.prerequisites ? data.prerequisites.join('\n') : null,
                tags: data.tags,
            },
        });

        return updatedCourse;
    }

    /**
     * Get all course categories
     */
    async getCategories() {
        return prisma.courseCategory.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Create a new category (if it doesn't already exist)
     */
    async createCategory(name: string) {
        if (!name || !name.trim()) throw new Error("اسم التصنيف مطلوب");
        const trimmed = name.trim();
        const existing = await prisma.courseCategory.findFirst({
            where: { name: { equals: trimmed, mode: "insensitive" } },
        });
        if (existing) return existing;
        // Auto-generate unique slug from name (e.g. "تطوير الويب" → "twyr-ob-1234")
        const base = trimmed
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\u0600-\u06FF-]/g, "")
            .substring(0, 40);
        const slug = `${base}-${Date.now()}`;
        return prisma.courseCategory.create({
            data: { name: trimmed, slug },
            select: { id: true, name: true },
        });
    }

    /**
     * Get all halls (rooms) for the institute
     */
    async getHalls(userId: string) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        return prisma.room.findMany({
            where: {
                instituteId: institute.id,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                capacity: true,
                pricePerHour: true,
                image: true,
                facilities: true,
            },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Create a new course
     */
    async createCourse(userId: string, data: any) {
        const institute = await prisma.institute.findUnique({
            where: { userId },
        });

        if (!institute) {
            throw new Error("لم يتم العثور على المعهد");
        }

        // Validate trainer from InstituteStaff
        const staffTrainer = await prisma.instituteStaff.findFirst({
            where: { id: data.trainerId, instituteId: institute.id, status: "ACTIVE" },
        });

        if (!staffTrainer) {
            throw new Error("المدرب غير موجود أو غير نشط في طاقم المعهد");
        }

        // Create course
        const sessionType = data.deliveryType === "online" ? "ONLINE" : "IN_PERSON";

        // Provide a robust fallback for creating nested sessions
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
                status: "DRAFT",
                image: data.image,
                staffTrainerId: data.trainerId,
                trainerId: null,
                instituteId: institute.id,
                categoryId: data.categoryId,
                objectives: data.objectives || [],
                prerequisites: data.prerequisites ? data.prerequisites.join('\n') : null,
                tags: data.tags || [],
                // We will create sessions separately if there's a hall to link them to RoomBooking
                sessions: data.hallId ? undefined : {
                    create: mappedSessions
                }
            },
        });

        if (data.hallId && mappedSessions.length > 0) {
            const room = await prisma.room.findUnique({ where: { id: data.hallId } });
            if (!room) throw new Error("القاعة المحددة غير موجودة");

            // Calculate total hours to exact decimal (e.g., 2.5 hours)
            const totalHours = mappedSessions.reduce((acc: number, session: any) => {
                const diffMs = session.endTime.getTime() - session.startTime.getTime();
                return acc + (diffMs / (1000 * 60 * 60));
            }, 0);

            const totalPrice = totalHours * Number(room.pricePerHour);

            // Determine unique dates to extract DayOfWeek (Optional depending on strictly how the enum is used)
            // For now, CUSTOM_TIME mode handles diverse session windows.
            const roomBooking = await prisma.roomBooking.create({
                data: {
                    bookingMode: "CUSTOM_TIME",
                    startDate: finalStartDate,
                    endDate: finalEndDate,
                    selectedDays: [], // Can be populated if needed
                    defaultStartTime: mappedSessions[0].startTime,
                    defaultEndTime: mappedSessions[0].endTime,
                    status: "PENDING_PAYMENT",
                    totalPrice: totalPrice,
                    roomId: room.id,
                    requestedById: userId,
                    courseId: course.id,
                    purpose: `حجز لدورة: ${course.title}`
                }
            });

            // Create explicitly linked sessions using createMany
            await prisma.session.createMany({
                data: mappedSessions.map((session: any) => ({
                    ...session,
                    courseId: course.id,
                    roomBookingId: roomBooking.id,
                    roomId: room.id
                }))
            });
        }

        // If hall is selected, handling room booking would go here
        // For now, we return the course and let the frontend/user manage bookings separately
        // or we could implement it if data.hallId is present.
        // Given complexity, let's keep it simple: Course created.

        return course;
    }
}

export default new InstituteService();
