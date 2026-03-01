import prisma from '../config/database';
import { hashPassword } from '../utils/password';

export class AdminService {
    /**
     * Get all pending verifications (trainers and institutes)
     */
    async getPendingVerifications() {
        // Get pending trainers
        const pendingTrainers = await prisma.trainerProfile.findMany({
            where: {
                verificationStatus: 'PENDING',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
        });

        // Get pending institutes
        const pendingInstitutes = await prisma.institute.findMany({
            where: {
                verificationStatus: 'PENDING',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
        });

        return {
            trainers: pendingTrainers,
            institutes: pendingInstitutes,
        };
    }

    /**
     * Approve trainer verification
     */
    async approveTrainer(trainerId: string) {
        const trainerProfile = await prisma.trainerProfile.findUnique({
            where: { id: trainerId },
            include: { user: true },
        });

        if (!trainerProfile) {
            throw new Error('الملف الشخصي للمدرب غير موجود');
        }

        // Update trainer profile verification status
        await prisma.trainerProfile.update({
            where: { id: trainerId },
            data: {
                verificationStatus: 'APPROVED',
                rejectionReason: null,
            },
        });

        // Update user status to ACTIVE
        await prisma.user.update({
            where: { id: trainerProfile.userId },
            data: {
                status: 'ACTIVE',
            },
        });

        return { message: 'تم قبول المدرب بنجاح' };
    }

    /**
     * Reject trainer verification
     */
    async rejectTrainer(trainerId: string, reason: string) {
        const trainerProfile = await prisma.trainerProfile.findUnique({
            where: { id: trainerId },
            include: { user: true },
        });

        if (!trainerProfile) {
            throw new Error('الملف الشخصي للمدرب غير موجود');
        }

        // Update trainer profile verification status
        await prisma.trainerProfile.update({
            where: { id: trainerId },
            data: {
                verificationStatus: 'REJECTED',
                rejectionReason: reason,
            },
        });

        // Keep user status as PENDING_VERIFICATION (they can re-apply)
        // Or optionally suspend the account

        return { message: 'تم رفض المدرب' };
    }

    /**
     * Approve institute verification
     */
    async approveInstitute(instituteId: string) {
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
            include: { user: true },
        });

        if (!institute) {
            throw new Error('الجهة التدريبية غير موجودة');
        }

        // Update institute verification status
        await prisma.institute.update({
            where: { id: instituteId },
            data: {
                verificationStatus: 'APPROVED',
                rejectionReason: null,
            },
        });

        // Update user status to ACTIVE
        await prisma.user.update({
            where: { id: institute.userId },
            data: {
                status: 'ACTIVE',
            },
        });

        return { message: 'تم قبول الجهة التدريبية بنجاح' };
    }

    /**
     * Reject institute verification
     */
    async rejectInstitute(instituteId: string, reason: string) {
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
            include: { user: true },
        });

        if (!institute) {
            throw new Error('الجهة التدريبية غير موجودة');
        }

        // Update institute verification status
        await prisma.institute.update({
            where: { id: instituteId },
            data: {
                verificationStatus: 'REJECTED',
                rejectionReason: reason,
            },
        });

        // Keep user status as PENDING_VERIFICATION (they can re-apply)
        // Or optionally suspend the account

        return { message: 'تم رفض الجهة التدريبية' };
    }
    /**
     * Get dashboard stats and recent activity
     */
    async getDashboardStats() {
        // 1. Counts
        const totalUsers = await prisma.user.count();
        const totalInstitutes = await prisma.institute.count();
        const totalCourses = await prisma.course.count();

        // 2. Revenue (Mock for now or sum verified payments)
        // const totalRevenue = await prisma.payment.aggregate({
        //    _sum: { amount: true },
        //    where: { status: 'APPROVED' }
        // });
        const totalRevenue = 450000; // Placeholder matching mock data

        // 3. Pending Approvals (Count)
        const pendingTrainersCount = await prisma.trainerProfile.count({ where: { verificationStatus: 'PENDING' } });
        const pendingInstitutesCount = await prisma.institute.count({ where: { verificationStatus: 'PENDING' } });
        const pendingApprovals = pendingTrainersCount + pendingInstitutesCount;

        // 4. Pending Items (List for card)
        const pendingTrainers = await prisma.trainerProfile.findMany({
            where: { verificationStatus: 'PENDING' },
            take: 3,
            orderBy: { user: { createdAt: 'desc' } }, // Approximate
            include: { user: { select: { id: true, name: true, createdAt: true } } }
        });

        const pendingInstitutes = await prisma.institute.findMany({
            where: { verificationStatus: 'PENDING' },
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true } } }
        });

        // Combine and sort
        const pendingItems = [
            ...pendingTrainers.map(t => ({
                id: t.id,
                userId: t.user.id, // For key or linking
                type: 'trainer',
                title: t.user.name,
                description: 'طلب التحقق من مدرب',
                date: t.user.createdAt
            })),
            ...pendingInstitutes.map(i => ({
                id: i.id,
                userId: i.user.id,
                type: 'institute',
                title: i.name, // Institute name
                description: 'طلب اعتماد معهد جديد',
                date: i.createdAt
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        // 5. Recent Activity (Mock or from Users/Courses)
        // Let's get recent users and recent institutes
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { name: true, role: true, createdAt: true }
        });

        const recentActivity = recentUsers.map(u => ({
            action: 'تسجيل جديد',
            details: `انضم ${u.name} كـ ${u.role}`,
            time: u.createdAt
        }));

        return {
            stats: {
                totalUsers,
                totalInstitutes,
                totalCourses,
                totalRevenue,
                pendingApprovals
            },
            pendingItems,
            recentActivity
        };
    }

    /**
     * Get all trainers
     */
    async getAllTrainers() {
        const trainers = await prisma.trainerProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                user: {
                    createdAt: 'desc',
                },
            },
        });

        // Map to flat structure for easier consumption
        return trainers.map(trainer => ({
            ...trainer,
            verificationStatus: trainer.verificationStatus.toLowerCase(),
            status: trainer.user.status === 'SUSPENDED' ? 'suspended' : trainer.verificationStatus.toLowerCase(),
            email: trainer.user.email,
            phone: trainer.user.phone,
            name: trainer.user.name,
            createdAt: trainer.user.createdAt
        }));
    }

    /**
     * Get all institutes
     */
    async getAllInstitutes() {
        const institutes = await prisma.institute.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Map to flat structure if needed, or ensuring status is present
        return institutes.map(inst => ({
            ...inst,
            verificationStatus: inst.verificationStatus.toLowerCase(),
            status: inst.user.status === 'SUSPENDED' ? 'suspended' : inst.verificationStatus.toLowerCase(),
            email: inst.email || inst.user.email,
            phone: inst.phone || inst.user.phone,
            name: inst.name || inst.user.name
        }));
    }

    /**
     * Suspend institute
     */
    async suspendInstitute(instituteId: string, reason: string) {
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
            include: { user: true },
        });

        if (!institute) {
            throw new Error('المعهد غير موجود');
        }

        // Update institute status
        await prisma.institute.update({
            where: { id: instituteId },
            data: {
                rejectionReason: reason, // Using rejectionReason field to store suspension reason for now
            },
        });

        // Update user status
        await prisma.user.update({
            where: { id: institute.userId },
            data: {
                status: 'SUSPENDED',
            },
        });

        return { message: 'تم تعليق المعهد بنجاح' };
    }

    /**
     * Reactivate institute
     */
    async reactivateInstitute(instituteId: string) {
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
            include: { user: true },
        });

        if (!institute) {
            throw new Error('المعهد غير موجود');
        }

        // Update institute status
        await prisma.institute.update({
            where: { id: instituteId },
            data: {
                rejectionReason: null,
            },
        });

        // Update user status
        await prisma.user.update({
            where: { id: institute.userId },
            data: {
                status: 'ACTIVE',
            },
        });

        return { message: 'تم إعادة تفعيل المعهد بنجاح' };
    }

    /**
     * Delete institute
     */
    async deleteInstitute(instituteId: string) {
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
        });

        if (!institute) {
            throw new Error('المعهد غير موجود');
        }

        // Delete institute (cascading delete should handle related data if configured, 
        // otherwise we might need to delete related data manually)
        // Ideally we should soft delete, but for now specific hard delete

        // Also delete the user
        await prisma.user.delete({
            where: { id: institute.userId },
        });

        return { message: 'تم حذف المعهد بنجاح' };
    }

    /**
     * Update institute
     */
    async updateInstitute(instituteId: string, data: any) {
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
            include: { user: true }
        });

        if (!institute) {
            throw new Error('المعهد غير موجود');
        }

        // Update institute fields
        await prisma.institute.update({
            where: { id: instituteId },
            data: {
                name: data.name,
                phone: data.phone,
                description: data.description,
                address: data.address,
                website: data.website,
                logo: data.logo,
            },
        });

        // Update statuses based on data.status
        if (data.status) {
            let userStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | undefined;
            let verificationStatus: 'APPROVED' | 'PENDING' | undefined;

            if (data.status === 'approved') {
                userStatus = 'ACTIVE';
                verificationStatus = 'APPROVED';
            } else if (data.status === 'pending') {
                userStatus = 'PENDING_VERIFICATION';
                verificationStatus = 'PENDING';
            } else if (data.status === 'suspended') {
                userStatus = 'SUSPENDED';
            }

            if (userStatus) {
                await prisma.user.update({
                    where: { id: institute.userId },
                    data: { status: userStatus }
                });
            }

            if (verificationStatus) {
                await prisma.institute.update({
                    where: { id: instituteId },
                    data: { verificationStatus }
                });
            }
        }

        // Update user email/name if changed
        if ((data.email && data.email !== institute.user.email) || (data.name && data.name !== institute.user.name)) {
            await prisma.user.update({
                where: { id: institute.userId },
                data: {
                    email: data.email,
                    name: data.name
                }
            });
        }

        // Update password if provided
        if (data.password) {
            const hashedPassword = await hashPassword(data.password);
            await prisma.user.update({
                where: { id: institute.userId },
                data: { password: hashedPassword }
            });
        }

        return { message: 'تم تحديث بيانات المعهد بنجاح' };
    }

    /**
     * Update trainer
     */
    async updateTrainer(trainerId: string, data: any) {
        const trainer = await prisma.trainerProfile.findUnique({
            where: { id: trainerId },
            include: { user: true }
        });

        if (!trainer) {
            throw new Error('المدرب غير موجود');
        }

        // Update trainer profile fields
        await prisma.trainerProfile.update({
            where: { id: trainerId },
            data: {
                bio: data.bio,
                cvUrl: data.cvUrl,
                specialties: data.specialties, // Expecting array of strings
            },
        });

        // Update statuses based on data.status
        if (data.status) {
            let userStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | undefined;
            let verificationStatus: 'APPROVED' | 'PENDING' | undefined;

            if (data.status === 'approved') {
                userStatus = 'ACTIVE';
                verificationStatus = 'APPROVED';
            } else if (data.status === 'pending') {
                userStatus = 'PENDING_VERIFICATION';
                verificationStatus = 'PENDING';
            } else if (data.status === 'suspended') {
                userStatus = 'SUSPENDED';
            }

            if (userStatus) {
                await prisma.user.update({
                    where: { id: trainer.userId },
                    data: { status: userStatus }
                });
            }

            if (verificationStatus) {
                await prisma.trainerProfile.update({
                    where: { id: trainerId },
                    data: { verificationStatus }
                });
            }
        }

        // Update user email/name/phone if changed
        if ((data.email && data.email !== trainer.user.email) ||
            (data.name && data.name !== trainer.user.name) ||
            (data.phone && data.phone !== trainer.user.phone)) {
            await prisma.user.update({
                where: { id: trainer.userId },
                data: {
                    email: data.email,
                    name: data.name,
                    phone: data.phone
                }
            });
        }

        if (data.password) {
            const hashedPassword = await hashPassword(data.password);
            await prisma.user.update({
                where: { id: trainer.userId },
                data: { password: hashedPassword }
            });
        }

        return { message: 'تم تحديث بيانات المدرب بنجاح' };
    }

    /**
     * Get all students
     */
    async getAllStudents() {
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                avatar: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Map Prisma status (uppercase) to frontend status (lowercase)
        return students.map(student => ({
            ...student,
            status: student.status === 'PENDING_VERIFICATION' ? 'pending' : student.status.toLowerCase(),
        }));
    }

    /**
     * Update student
     */
    async updateStudent(studentId: string, data: any) {
        const student = await prisma.user.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new Error('الطالب غير موجود');
        }

        // Map frontend status to Prisma status
        let status = undefined;
        if (data.status) {
            if (data.status === 'active') status = 'ACTIVE';
            else if (data.status === 'suspended') status = 'SUSPENDED';
            else if (data.status === 'pending') status = 'PENDING_VERIFICATION';
        }

        const updateData: any = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role
        };

        if (status) {
            updateData.status = status;
        }

        if (data.password && data.password.trim() !== "") {
            updateData.password = await hashPassword(data.password);
        }

        if (data.avatar !== undefined) {
            updateData.avatar = data.avatar;
        }

        await prisma.user.update({
            where: { id: studentId },
            data: updateData,
        });

        return { message: 'تم تحديث بيانات الطالب بنجاح' };
    }

    /**
     * Suspend student
     */
    async suspendStudent(studentId: string, reason: string) {
        // reason can be logged or stored if there's a suspension log table
        await prisma.user.update({
            where: { id: studentId },
            data: { status: 'SUSPENDED' },
        });
        return { message: 'تم تعليق حساب الطالب بنجاح' };
    }

    /**
     * Delete student
     */
    async deleteStudent(studentId: string) {
        // Check for related data (enrollments, etc.) before hard deleting
        // For now, we'll assume cascading delete or manual cleanup is handled by DB constraints or we just delete the user
        await prisma.user.delete({
            where: { id: studentId },
        });
        return { message: 'تم حذف حساب الطالب بنجاح' };
    }

    // =====================================================
    // COURSE MANAGEMENT
    // =====================================================

    /**
     * Get all courses with trainer, institute, category, and enrollment count
     */
    async getAllCourses() {
        const courses = await prisma.course.findMany({
            include: {
                trainer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                institute: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const statusMap: Record<string, string> = {
            DRAFT: 'draft',
            ACTIVE: 'active',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
            REJECTED: 'rejected',
        };

        return courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description || '',
            shortDescription: course.shortDescription || '',
            price: Number(course.price),
            duration: course.duration,
            startDate: course.startDate,
            endDate: course.endDate,
            minStudents: course.minStudents,
            maxStudents: course.maxStudents,
            status: statusMap[course.status] || course.status.toLowerCase(),
            image: course.image,
            prerequisites: course.prerequisites,
            objectives: course.objectives,
            tags: course.tags,
            category: course.category?.name || '',
            categoryId: course.categoryId,
            trainerId: course.trainerId,
            trainer: course.trainer ? {
                id: course.trainer.id,
                name: course.trainer.name,
                email: course.trainer.email,
                role: 'trainer',
                status: 'active',
                createdAt: course.createdAt,
            } : null,
            instituteId: course.instituteId,
            institute: course.institute
                ? {
                    id: course.institute.id,
                    name: course.institute.name,
                    description: '',
                    email: '',
                    phone: '',
                    address: '',
                    status: 'approved',
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt,
                }
                : null,
            enrolledStudents: course._count.enrollments,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        }));
    }

    /**
     * Update course
     */
    async updateCourse(courseId: string, data: any) {
        const statusMap: Record<string, string> = {
            draft: 'DRAFT',
            active: 'ACTIVE',
            completed: 'COMPLETED',
            cancelled: 'CANCELLED',
            rejected: 'REJECTED',
        };

        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
        if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
        if (data.maxStudents !== undefined) updateData.maxStudents = data.maxStudents;
        if (data.status !== undefined) updateData.status = statusMap[data.status] || data.status;
        if (data.trainerId !== undefined) updateData.trainerId = data.trainerId;

        await prisma.course.update({
            where: { id: courseId },
            data: updateData,
        });

        return { message: 'تم تحديث الدورة بنجاح' };
    }

    /**
     * Delete course
     */
    async deleteCourse(courseId: string) {
        await prisma.course.delete({
            where: { id: courseId },
        });
        return { message: 'تم حذف الدورة بنجاح' };
    }

    /**
     * Suspend (cancel) course
     */
    async suspendCourse(courseId: string) {
        await prisma.course.update({
            where: { id: courseId },
            data: { status: 'CANCELLED' },
        });
        return { message: 'تم تعليق الدورة بنجاح' };
    }
}

export default new AdminService();
