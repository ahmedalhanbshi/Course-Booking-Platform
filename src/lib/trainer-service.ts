import apiClient from './api-client';
import type { Course, Room, Announcement, Enrollment, RoomBooking, HallAvailabilityPeriod, HallBookedSession, TrainerProfileDetail, TrainerStudentsData } from "@/types";

export interface TrainerDashboardData {
    stats: {
        totalCourses: number;
        activeCourses: number;
        totalStudents: number;
        totalSessions: number;
        totalEarnings: number;
        upcomingSessions: number;
        pendingRoomBookings: number;
    };
    upcomingSessions: {
        id: string;
        title: string;
        courseTitle: string;
        startTime: string;
        endTime: string;
        type: string;
        room: string | null;
        meetingLink: string | null;
        enrolledStudents: number;
    }[];
    pendingRoomBookings: {
        id: string;
        courseTitle: string;
        sessionTitle: string;
        requestedDate: string;
        duration: number;
        requestedRoom: string;
        status: string;
    }[];
}

export interface ExploreCourse {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    image: string | null;
    studentsCount: number;
    sessionsCount: number;
    duration: number;
    trainer: { name: string; avatar: string | null };
    price: number;
    minStudents: number;
    courseStatus: 'ACTIVE' | 'PENDING_MINIMUM';
    startDate: string;
    createdAt: string;
    deliveryType: string;
}

export interface ExploreCoursesData {
    courses: ExploreCourse[];
    categories: { id: string; name: string }[];
}

export interface CourseDetail {
    id: string;
    title: string;
    category: string;
    shortDescription: string;
    description: string;
    image: string | null;
    surveyLink?: string | null;
    price: number;
    minStudents: number; // min students needed to activate the course
    courseStatus: 'ACTIVE' | 'PENDING_MINIMUM';
    startDate: string;
    endDate: string;
    maxStudents: number;
    enrolledCount: number;
    prerequisites: string[];
    objectives: string[];
    tags: string[];
    deliveryType: 'online' | 'in_person' | 'hybrid';
    sessions: {
        id: string;
        topic: string | null;
        startTime: string;
        endTime: string;
        type: string;
        status: string;
        meetingLink: string | null;
        location: string | null;
        room: { id: string; name: string; location: string | null } | null;
        roomId?: string | null;
    }[];
    instructor: {
        name: string;
        avatar: string | null;
        email: string | null;
        phone: string | null;
        bio: string | null;
        specialties: string[];
        bankAccounts?: {
            id: string;
            bankName: string;
            accountName: string;
            accountNumber: string;
            iban: string | null;
            isActive: boolean;
        }[];
    };
    staffTrainers?: {
        id: string;
        name: string;
        bio: string | null;
        email: string | null;
        phone: string | null;
        specialties: string[];
    }[];
    institute?: {
        name: string;
        logo: string | null;
        email: string | null;
        phone: string | null;
        description: string | null;
    } | null;
}

export interface Session {
    id: string;
    title: string;
    courseId: string | null;
    courseTitle: string;
    startTime: string;
    endTime: string;
    type: 'online' | 'in_person' | 'hybrid';
    status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
    meetingLink: string | null;
    location: string;
    enrolledStudents: number;
    roomId: string | null;
}

class TrainerService {
    async getSchedule(): Promise<Session[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Session[] }>('/api/trainer/schedule');
        return response.data.data;
    }

    async getPublicCourseById(courseId: string): Promise<CourseDetail> {
        const response = await apiClient.get<{ success: boolean; message: string; data: CourseDetail }>(`/api/public/courses/${courseId}`);
        return response.data.data;
    }

    async getExploreCourses(): Promise<ExploreCoursesData> {
        const response = await apiClient.get<{ success: boolean; message: string; data: ExploreCoursesData }>('/api/public/courses');
        return response.data.data;
    }

    async getDashboard(): Promise<TrainerDashboardData> {
        const response = await apiClient.get<{ success: boolean; message: string; data: TrainerDashboardData }>('/api/trainer/dashboard');
        return response.data.data;
    }

    async getCategories(): Promise<{ id: string; name: string }[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: { id: string; name: string }[] }>('/api/trainer/categories');
        return response.data.data;
    }

    async createCategory(name: string): Promise<{ id: string; name: string }> {
        const response = await apiClient.post<{ success: boolean; message: string; data: { id: string; name: string } }>('/api/trainer/categories', { name });
        return response.data.data;
    }

    /**
     * Get all active halls across all institutes 
     */
    async getHalls(): Promise<Room[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Room[] }>('/api/trainer/halls');
        return response.data.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getHallById(hallId: string): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>(`/api/trainer/halls/${hallId}`);
        return response.data.data;
    }

    async getHallAvailability(hallId: string, date?: string): Promise<{ availability?: HallAvailabilityPeriod[]; bookedSessions?: HallBookedSession[] }> {
        const url = `/api/trainer/halls/${hallId}/availability${date ? `?date=${date}` : ''}`;
        const response = await apiClient.get<{ success: boolean; message: string; data: { availability?: HallAvailabilityPeriod[]; bookedSessions?: HallBookedSession[] } }>(url);
        return response.data.data;
    }


    /**
     * Create a new course
     * Handles standard courses, or "in_person" courses where a hall is booked and a payment receipt is required.
     */
    async getCourses(): Promise<Course[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Course[] }>('/api/trainer/courses');
        return response.data.data;
    }

    async deleteCourse(id: string): Promise<void> {
        await apiClient.delete(`/api/trainer/courses/${id}`);
    }

    async getTrainerCourseById(courseId: string): Promise<Course> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Course }>(`/api/trainer/courses/${courseId}`);
        return response.data.data;
    }

    async updateTrainerCourse(courseId: string, data: Record<string, unknown> | FormData): Promise<Course> {
        let headers = {};
        if (data instanceof FormData) {
            headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await apiClient.put<{ success: boolean; message: string; data: Course }>(`/api/trainer/courses/${courseId}`, data, { headers });
        return response.data.data;
    }

    async getCourseStudents(courseId: string): Promise<Record<string, unknown>> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Record<string, unknown> }>(`/api/trainer/courses/${courseId}/students`);
        return response.data.data;
    }

    async unenrollStudent(courseId: string, enrollmentId: string, reason: string): Promise<Enrollment> {
        const response = await apiClient.patch<{ success: boolean; message: string; data: Enrollment }>(`/api/trainer/courses/${courseId}/students/${enrollmentId}/unenroll`, { reason });
        return response.data.data;
    }

    async createCourse(data: FormData): Promise<Course> {
        const response = await apiClient.post<{ success: boolean; message: string; data: Course }>('/api/trainer/courses', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    }

    async getProfile(): Promise<TrainerProfileDetail> {
        const response = await apiClient.get<{ success: boolean; message: string; data: TrainerProfileDetail }>('/api/trainer/profile');
        return response.data.data;
    }

    async updateProfile(data: {
        name?: string;
        phone?: string;
        email?: string;
        bio?: string;
        specialties?: string[];
        avatar?: File;
    }): Promise<TrainerProfileDetail> {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phone !== undefined) formData.append('phone', data.phone);
        if (data.email) formData.append('email', data.email);
        if (data.bio !== undefined) formData.append('bio', data.bio);
        if (data.specialties) formData.append('specialties', JSON.stringify(data.specialties));
        if (data.avatar) formData.append('avatar', data.avatar);

        const response = await apiClient.patch<{ success: boolean; message: string; data: TrainerProfileDetail }>('/api/trainer/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await apiClient.post('/api/trainer/profile/change-password', { currentPassword, newPassword });
    }

    async getAllStudents(): Promise<TrainerStudentsData> {
        const response = await apiClient.get<{ success: boolean; message: string; data: TrainerStudentsData }>('/api/trainer/students');
        return response.data.data;
    }

    async sendStudentAnnouncement(data: {
        title: string;
        message: string;
        recipientId?: string;
        courseId?: string;
        category?: string;
        status?: string;
        scheduledAt?: string;
    }): Promise<Announcement> {
        const response = await apiClient.post<{ success: boolean; message: string; data: Announcement }>('/api/trainer/announcements/send', data);
        return response.data.data;
    }

    async getAnnouncements(): Promise<Announcement[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Announcement[] }>('/api/trainer/announcements');
        return response.data.data;
    }

    async updateAnnouncement(id: string, data: { title: string; message: string }): Promise<Announcement> {
        const response = await apiClient.put<{ success: boolean; message: string; data: Announcement }>(`/api/trainer/announcements/${id}`, data);
        return response.data.data;
    }

    async deleteAnnouncement(id: string): Promise<void> {
        await apiClient.delete(`/api/trainer/announcements/${id}`);
    }

    async getEnrollments(): Promise<Enrollment[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Enrollment[] }>('/api/trainer/enrollments');
        return response.data.data;
    }

    async updateEnrollmentStatus(enrollmentId: string, status: 'ACTIVE' | 'CANCELLED' | 'REJECT_PAYMENT', reason?: string): Promise<Enrollment> {
        const response = await apiClient.patch<{ success: boolean; message: string; data: Enrollment }>(`/api/trainer/enrollments/${enrollmentId}/status`, { status, reason });
        return response.data.data;
    }

    async getRoomBookings(): Promise<RoomBooking[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: RoomBooking[] }>('/api/trainer/bookings');
        return response.data.data;
    }

    async resubmitBookingPayment(courseId: string, bookingId: string, file: File): Promise<RoomBooking> {
        const formData = new FormData();
        formData.append('paymentReceipt', file);
        const response = await apiClient.post<{ success: boolean; message: string; data: RoomBooking }>(
            `/api/trainer/courses/${courseId}/bookings/${bookingId}/resubmit`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data.data;
    }

    async cancelBooking(courseId: string | null | undefined, bookingId: string): Promise<RoomBooking> {
        // Direct bookings (not linked to a course) use a different endpoint
        const url = courseId && courseId !== 'null'
            ? `/api/trainer/courses/${courseId}/bookings/${bookingId}`
            : `/api/trainer/bookings/${bookingId}`;
        const response = await apiClient.delete<{ success: boolean; message: string; data: RoomBooking }>(url);
        return response.data.data;
    }

    async updateSession(sessionId: string, data: { startTime?: string; endTime?: string; status?: string; meetingLink?: string; updateAll?: boolean }): Promise<Session> {
        const response = await apiClient.patch<{ success: boolean; message: string; data: Session }>(
            `/api/trainer/sessions/${sessionId}`, data
        );
        return response.data.data;
    }

    async bookHall(hallId: string, sessions: { date: string; slot: number }[], receipt?: File, note?: string): Promise<Record<string, unknown>> {
        const formData = new FormData();
        formData.append('sessions', JSON.stringify(sessions));
        if (receipt) formData.append('paymentReceipt', receipt);
        if (note) formData.append('note', note);

        const response = await apiClient.post<{ success: boolean; message: string; data: Record<string, unknown> }>(
            `/api/trainer/halls/${hallId}/book`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    }

    // ==========================================
    // Trainer Bank Accounts
    // ==========================================

    async getBankAccounts(): Promise<Record<string, unknown>[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: Record<string, unknown>[] }>('/api/trainer/bank-accounts');
        return response.data.data;
    }

    async addBankAccount(data: { bankName: string; accountName: string; accountNumber: string; iban?: string }): Promise<Record<string, unknown>> {
        const response = await apiClient.post<{ success: boolean; message: string; data: Record<string, unknown> }>('/api/trainer/bank-accounts', data);
        return response.data.data;
    }

    async updateBankAccount(accountId: string, data: { bankName?: string; accountName?: string; accountNumber?: string; iban?: string; isActive?: boolean }): Promise<Record<string, unknown>> {
        const response = await apiClient.patch<{ success: boolean; message: string; data: Record<string, unknown> }>(`/api/trainer/bank-accounts/${accountId}`, data);
        return response.data.data;
    }

    async deleteBankAccount(accountId: string): Promise<void> {
        await apiClient.delete(`/api/trainer/bank-accounts/${accountId}`);
    }

}

export const trainerService = new TrainerService();
