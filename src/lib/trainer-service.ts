import apiClient from './api-client';

export interface TrainerDashboardData {
    stats: {
        activeCourses: number;
        totalStudents: number;
        totalSessions: number;
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
        room: { name: string; location: string | null } | null;
    }[];
    instructor: {
        name: string;
        avatar: string | null;
        email: string | null;
        bio: string | null;
        specialties: string[];
    };
}

class TrainerService {
    async getPublicCourseById(courseId: string): Promise<CourseDetail> {
        const response = await apiClient.get<{ success: boolean; message: string; data: CourseDetail }>(`/api/trainer/explore/${courseId}`);
        return response.data.data;
    }

    async getExploreCourses(): Promise<ExploreCoursesData> {
        const response = await apiClient.get<{ success: boolean; message: string; data: ExploreCoursesData }>('/api/trainer/explore');
        return response.data.data;
    }

    async getDashboard(): Promise<TrainerDashboardData> {
        const response = await apiClient.get<{ success: boolean; message: string; data: TrainerDashboardData }>('/api/trainer/dashboard');
        return response.data.data;
    }

    /**
     * Get all active halls across all institutes 
     */
    async getHalls(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/trainer/halls');
        return response.data.data;
    }

    async getHallById(hallId: string): Promise<any> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>(`/api/trainer/halls/${hallId}`);
        return response.data.data;
    }

    async getHallAvailability(hallId: string): Promise<any> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>(`/api/trainer/halls/${hallId}/availability`);
        return response.data.data;
    }


    /**
     * Create a new course
     * Handles standard courses, or "in_person" courses where a hall is booked and a payment receipt is required.
     */
    async getCourses(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/trainer/courses');
        return response.data.data;
    }

    async getTrainerCourseById(courseId: string): Promise<any> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>(`/api/trainer/courses/${courseId}`);
        return response.data.data;
    }

    async updateTrainerCourse(courseId: string, data: any): Promise<any> {
        const response = await apiClient.put<{ success: boolean; message: string; data: any }>(`/api/trainer/courses/${courseId}`, data);
        return response.data.data;
    }

    async getCourseStudents(courseId: string): Promise<any> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>(`/api/trainer/courses/${courseId}/students`);
        return response.data.data;
    }

    async unenrollStudent(courseId: string, enrollmentId: string, reason: string): Promise<any> {
        const response = await apiClient.patch<{ success: boolean; message: string; data: any }>(`/api/trainer/courses/${courseId}/students/${enrollmentId}/unenroll`, { reason });
        return response.data.data;
    }

    async createCourse(data: FormData): Promise<any> {
        const response = await apiClient.post<{ success: boolean; message: string; data: any }>('/api/trainer/courses', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    }

    async getProfile(): Promise<any> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>('/api/trainer/profile');
        return response.data.data;
    }

    async updateProfile(data: {
        name?: string;
        phone?: string;
        bio?: string;
        specialties?: string[];
        avatar?: File;
    }): Promise<any> {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phone !== undefined) formData.append('phone', data.phone);
        if (data.bio !== undefined) formData.append('bio', data.bio);
        if (data.specialties) formData.append('specialties', JSON.stringify(data.specialties));
        if (data.avatar) formData.append('avatar', data.avatar);

        const response = await apiClient.patch<{ success: boolean; message: string; data: any }>('/api/trainer/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await apiClient.post('/api/trainer/profile/change-password', { currentPassword, newPassword });
    }

    async getAllStudents(): Promise<any> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any }>('/api/trainer/students');
        return response.data.data;
    }

    async getEnrollments(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/trainer/enrollments');
        return response.data.data;
    }

    async updateEnrollmentStatus(enrollmentId: string, status: 'ACTIVE' | 'CANCELLED', reason?: string): Promise<any> {
        const response = await apiClient.patch<{ success: boolean; message: string; data: any }>(`/api/trainer/enrollments/${enrollmentId}/status`, { status, reason });
        return response.data.data;
    }

    async getRoomBookings(): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; message: string; data: any[] }>('/api/trainer/bookings');
        return response.data.data;
    }

}

export const trainerService = new TrainerService();
