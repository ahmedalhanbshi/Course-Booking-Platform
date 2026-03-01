import { Response, NextFunction } from 'express';
import adminService from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/authenticate';

export class AdminController {
    /**
     * Get all pending verifications
     */
    async getPendingVerifications(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const result = await adminService.getPendingVerifications();
            return sendSuccess(res, 'تم جلب البيانات بنجاح', result);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Approve trainer verification
     */
    async approveTrainer(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const { id } = req.params;
            const result = await adminService.approveTrainer(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Reject trainer verification
     */
    async rejectTrainer(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const { id } = req.params;
            const { reason } = req.body;

            if (!reason) {
                return sendError(res, 'يجب تحديد سبب الرفض', 400);
            }

            const result = await adminService.rejectTrainer(id, reason);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Approve institute verification
     */
    async approveInstitute(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const { id } = req.params;
            const result = await adminService.approveInstitute(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Reject institute verification
     */
    async rejectInstitute(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const { id } = req.params;
            const { reason } = req.body;

            if (!reason) {
                return sendError(res, 'يجب تحديد سبب الرفض', 400);
            }

            const result = await adminService.rejectInstitute(id, reason);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }
    /**
     * Get dashboard stats
     */
    async getDashboardStats(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const result = await adminService.getDashboardStats();
            return sendSuccess(res, 'تم جلب الإحصائيات بنجاح', result);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Get all trainers
     */
    async getAllTrainers(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const result = await adminService.getAllTrainers();
            return sendSuccess(res, 'تم جلب المدربين بنجاح', result);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Get all institutes
     */
    async getAllInstitutes(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            // Check if user is platform admin
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }

            const result = await adminService.getAllInstitutes();
            return sendSuccess(res, 'تم جلب المعاهد بنجاح', result);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Suspend institute
     */
    async suspendInstitute(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const { reason } = req.body;
            if (!reason) return sendError(res, 'يجب ذكر سبب التعليق', 400);

            const result = await adminService.suspendInstitute(id, reason);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Reactivate institute
     */
    async reactivateInstitute(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const result = await adminService.reactivateInstitute(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Delete institute
     */
    async deleteInstitute(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const result = await adminService.deleteInstitute(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Update institute
     */
    async updateInstitute(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const data = req.body;
            const result = await adminService.updateInstitute(id, data);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Update trainer
     */
    async updateTrainer(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const data = req.body;
            const result = await adminService.updateTrainer(id, data);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Get all students
     */
    async getAllStudents(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const students = await adminService.getAllStudents();
            return sendSuccess(res, 'تم جلب الطلاب بنجاح', students);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Update student
     */
    async updateStudent(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const data = req.body;
            const result = await adminService.updateStudent(id, data);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Suspend student
     */
    async suspendStudent(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const { reason } = req.body;
            const result = await adminService.suspendStudent(id, reason);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Delete student
     */
    async deleteStudent(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const result = await adminService.deleteStudent(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    // =====================================================
    // COURSE MANAGEMENT
    // =====================================================

    /**
     * Get all courses
     */
    async getAllCourses(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const courses = await adminService.getAllCourses();
            return sendSuccess(res, 'تم جلب الدورات بنجاح', courses);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Update course
     */
    async updateCourse(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const data = req.body;
            const result = await adminService.updateCourse(id, data);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Delete course
     */
    async deleteCourse(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const result = await adminService.deleteCourse(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }

    /**
     * Suspend course
     */
    async suspendCourse(req: AuthRequest, res: Response, _next: NextFunction) {
        try {
            if (req.user?.role !== 'PLATFORM_ADMIN') {
                return sendError(res, 'غير مصرح لك بالوصول', 403);
            }
            const { id } = req.params;
            const result = await adminService.suspendCourse(id);
            return sendSuccess(res, result.message);
        } catch (error: any) {
            return sendError(res, error.message, 400);
        }
    }
}

export default new AdminController();
