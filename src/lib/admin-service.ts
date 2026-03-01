import apiClient from './api-client';

interface PendingTrainer {
    id: string;
    userId: string;
    bio: string | null;
    cvUrl: string | null;
    specialties: string[];
    certificatesUrls: string[];
    verificationStatus: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        createdAt: string;
    };
}

interface PendingInstitute {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    licenseNumber: string | null;
    licenseDocumentUrl: string | null;
    verificationStatus: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        createdAt: string;
    };
}

interface PendingVerifications {
    trainers: PendingTrainer[];
    institutes: PendingInstitute[];
}

export interface DashboardStats {
    stats: {
        totalUsers: number;
        totalInstitutes: number;
        totalCourses: number;
        totalRevenue: number;
        pendingApprovals: number;
    };
    pendingItems: {
        id: string;
        userId?: string;
        type: 'trainer' | 'institute' | 'course';
        title: string;
        description: string;
        date: string;
    }[];
    recentActivity: {
        action: string;
        details: string;
        time: string;
    }[];
}

class AdminService {
    /**
     * Get all pending verifications
     */
    async getPendingVerifications(): Promise<PendingVerifications> {
        const response = await apiClient.get<{ success: boolean; message: string; data: PendingVerifications }>(
            '/api/admin/verifications/pending'
        );
        return response.data.data;
    }

    /**
     * Approve trainer verification
     */
    async approveTrainer(trainerId: string): Promise<void> {
        await apiClient.post(`/api/admin/verifications/trainer/${trainerId}/approve`);
    }

    /**
     * Reject trainer verification
     */
    async rejectTrainer(trainerId: string, reason: string): Promise<void> {
        await apiClient.post(`/api/admin/verifications/trainer/${trainerId}/reject`, { reason });
    }

    /**
     * Approve institute verification
     */
    async approveInstitute(instituteId: string): Promise<void> {
        await apiClient.post(`/api/admin/verifications/institute/${instituteId}/approve`);
    }

    /**
     * Reject institute verification
     */
    async rejectInstitute(instituteId: string, reason: string): Promise<void> {
        await apiClient.post(`/api/admin/verifications/institute/${instituteId}/reject`, { reason });
    }

    /**
     * Get dashboard stats
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get<{ success: boolean; message: string; data: DashboardStats }>(
            '/api/admin/dashboard/stats'
        );
        return response.data.data;
    }

    /**
     * Get all trainers
     */
    async getAllTrainers(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/admin/trainers');
        return response.data.data;
    }

    /**
     * Update trainer
     */
    async updateTrainer(id: string, data: any): Promise<void> {
        await apiClient.put(`/api/admin/trainers/${id}`, data);
    }

    /**
     * Get all institutes
     */
    async getAllInstitutes(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/admin/institutes');
        return response.data.data;
    }

    async suspendInstitute(id: string, reason: string): Promise<void> {
        await apiClient.post(`/api/admin/institutes/${id}/suspend`, { reason });
    }

    async reactivateInstitute(id: string): Promise<void> {
        await apiClient.post(`/api/admin/institutes/${id}/reactivate`);
    }

    async deleteInstitute(id: string): Promise<void> {
        await apiClient.delete(`/api/admin/institutes/${id}`);
    }

    async updateInstitute(id: string, data: any): Promise<void> {
        await apiClient.put(`/api/admin/institutes/${id}`, data);
    }

    /**
     * Get all students
     */
    async getAllStudents(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/admin/students');
        return response.data.data;
    }

    /**
     * Update student
     */
    async updateStudent(id: string, data: any): Promise<void> {
        await apiClient.put(`/api/admin/students/${id}`, data);
    }

    /**
     * Suspend student
     */
    async suspendStudent(id: string, reason: string): Promise<void> {
        await apiClient.post(`/api/admin/students/${id}/suspend`, { reason });
    }

    /**
     * Delete student
     */
    async deleteStudent(id: string): Promise<void> {
        await apiClient.delete(`/api/admin/students/${id}`);
    }

    // =====================================================
    // COURSE MANAGEMENT
    // =====================================================

    /**
     * Get all courses
     */
    async getAllCourses(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/admin/courses');
        return response.data.data;
    }

    /**
     * Update course
     */
    async updateCourse(id: string, data: any): Promise<void> {
        await apiClient.put(`/api/admin/courses/${id}`, data);
    }

    /**
     * Delete course
     */
    async deleteCourse(id: string): Promise<void> {
        await apiClient.delete(`/api/admin/courses/${id}`);
    }

    /**
     * Suspend course
     */
    async suspendCourse(id: string): Promise<void> {
        await apiClient.post(`/api/admin/courses/${id}/suspend`);
    }
}

export const adminService = new AdminService();
