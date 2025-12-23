export type UserRole = 'student' | 'trainer' | 'institute_admin' | 'platform_admin';

export type CourseStatus = 'draft' | 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'active' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type SessionType = 'online' | 'in_person' | 'hybrid';
export type AttendanceStatus = 'present' | 'absent' | 'excused';
export type RoomBookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  instituteId?: string;
  trainerProfile?: TrainerProfile;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  bio?: string;
  cvUrl?: string;
  specialties: string[];
  rating: number;
}

export interface Institute {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  website?: string;
  status: 'pending' | 'approved' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'pdf' | 'video' | 'link' | 'document';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  deliveryType: 'online' | 'in_person' | 'hybrid' | 'capacity_based';
  isCapacityBased?: boolean;
  duration: number; // in hours
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  status: CourseStatus | 'pending_approval' | 'payment_required' | 'processing_payment';
  image?: string;
  prerequisites?: string;
  objectives?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;

  category: string;
  categoryId?: string;
  categoryDetails?: CourseCategory;

  // Relations
  trainerId: string;
  trainer: User;
  instituteId?: string;
  institute?: Institute;

  enrolledStudents: number; // Computed or count
  rating: number; // Computed
  reviewCount: number; // Computed
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: SessionType;
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

  courseId: string;
  roomId?: string;
  trainerId?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  status: EnrollmentStatus;
  progress: number; // percentage
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  transactionId?: string;
  createdAt: Date;
  enrollmentId: string;
}

export interface Attendance {
  id: string;
  status: AttendanceStatus;
  markedAt: Date;
  sessionId: string;
  studentId: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  order: number;
  isVisible: boolean;
  uploadedAt: Date;
  courseId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  courseId: string;
  studentId: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  issuedAt: Date;
  url: string;
  courseId: string;
  enrollmentId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'enrollment' | 'session' | 'announcement' | 'system' | 'review';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  userId: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  isActive: boolean;
  instituteId: string;
  institute?: Institute;
}

export interface RoomBooking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: RoomBookingStatus;
  purpose?: string;
  notes?: string;
  createdAt: Date;

  roomId: string;
  sessionId?: string;
  requestedById: string;
  approvedById?: string;

  // Verification
  initialConfirmation?: boolean;
  paymentConfirmation?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'students' | 'trainers' | 'institute_admins' | 'platform_admins' | 'course_students';
  createdAt: Date;
  scheduledAt?: Date;
  sentAt?: Date;

  senderId: string;
  courseId?: string;
  instituteId?: string;
}