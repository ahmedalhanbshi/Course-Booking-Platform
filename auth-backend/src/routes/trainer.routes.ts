import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { upload } from '../middleware/upload';
import trainerController from '../controllers/trainer.controller';
import multer from 'multer';

const router = Router();

// All trainer routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard', trainerController.getDashboard);

// Explore (public course catalog)
router.get('/explore', trainerController.getExploreCourses);
router.get('/explore/:courseId', trainerController.getPublicCourseById);

// Halls
router.get('/halls', trainerController.getHalls);
router.get('/halls/:hallId', trainerController.getHallById);
router.get('/halls/:hallId/availability', trainerController.getHallAvailability);


// Courses
router.get('/courses', trainerController.getCourses);
router.get('/courses/:courseId', trainerController.getTrainerCourseById);
router.put('/courses/:courseId', trainerController.updateTrainerCourse);
router.get('/courses/:courseId/students', trainerController.getCourseStudents);
router.patch('/courses/:courseId/students/:enrollmentId/unenroll', trainerController.unenrollStudent);

// Multer wrapper that converts multer errors into 400 responses instead of 500
const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'paymentReceipt', maxCount: 1 }
]);

router.post(
    '/courses',
    (req: Request, res: Response, next: NextFunction): void => {
        return uploadFields(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                res.status(400).json({ success: false, message: `خطأ في رفع الملف: ${err.message}` });
                return;
            } else if (err) {
                res.status(400).json({ success: false, message: err.message || 'حدث خطأ أثناء رفع الملف' });
                return;
            }
            next();
        });
    },
    trainerController.createCourse
);

// Trainer Profile
router.get('/profile', trainerController.getProfile);
router.patch(
    '/profile',
    (req: Request, res: Response, next: NextFunction): void => {
        return upload.fields([{ name: 'avatar', maxCount: 1 }])(req, res, (err) => {
            if (err) {
                res.status(400).json({ success: false, message: err.message || 'خطأ في رفع الصورة' });
                return;
            }
            next();
        });
    },
    trainerController.updateProfile
);
// All students across all of this trainer's courses
router.get('/students', trainerController.getAllStudents);

// Enrollments management
router.get('/enrollments', trainerController.getEnrollments);
router.patch('/enrollments/:enrollmentId/status', trainerController.updateEnrollmentStatus);

// Room Bookings
router.get('/bookings', trainerController.getRoomBookings);

export default router;
