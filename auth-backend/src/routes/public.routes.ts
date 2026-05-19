import { Router } from 'express';
import instituteController from '../controllers/institute.controller';
import publicController from '../controllers/public.controller';

const router = Router();

// Publicly accessible courses (explore catalog)
router.get('/courses', publicController.getExploreCourses);
router.get('/courses/:courseId', publicController.getPublicCourseById);

// Publicly accessible halls endpoint
router.get('/halls', publicController.getHalls);
router.get('/halls/:hallId/availability', publicController.getHallAvailability);
router.get('/halls/:hallId', publicController.getHallById);

// Publicly accessible institutes endpoint
router.get('/institutes', instituteController.getPublicInstitutes);
router.get('/institutes/:id', instituteController.getPublicInstituteById);

// Publicly accessible homepage data endpoints
router.get('/stats', publicController.getStats);
router.get('/categories', publicController.getCategories);
router.get('/featured-courses', publicController.getFeaturedCourses);
router.get('/tags', publicController.getTags);

export default router;
