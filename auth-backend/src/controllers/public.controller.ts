import { NextFunction, Request, Response } from 'express';
import publicService from '../services/public.service';
import { sendError, sendSuccess } from '../utils/response';

class PublicController {
    async getStats(_req: Request, res: Response, _next: NextFunction) {
        try {
            const stats = await publicService.getStats();
            return sendSuccess(res, 'Platform stats fetched successfully', stats);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch platform stats', 500);
        }
    }

    async getCategories(_req: Request, res: Response, _next: NextFunction) {
        try {
            const categories = await publicService.getCategories();
            return sendSuccess(res, 'Categories fetched successfully', categories);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch categories', 500);
        }
    }

    async getFeaturedCourses(_req: Request, res: Response, _next: NextFunction) {
        try {
            const courses = await publicService.getFeaturedCourses();
            return sendSuccess(res, 'Featured courses fetched successfully', courses);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch featured courses', 500);
        }
    }

    async getTags(_req: Request, res: Response, _next: NextFunction) {
        try {
            const tags = await publicService.getTags();
            return sendSuccess(res, 'Tags fetched successfully', tags);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch tags', 500);
        }
    }

    async getExploreCourses(_req: Request, res: Response, _next: NextFunction) {
        try {
            const data = await publicService.getExploreCourses();
            return sendSuccess(res, 'Explore courses fetched successfully', data);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch explore courses', 400);
        }
    }

    async getPublicCourseById(req: Request, res: Response, _next: NextFunction) {
        try {
            const { courseId } = req.params;
            const course = await publicService.getPublicCourseById(courseId);
            return sendSuccess(res, 'Course details fetched successfully', course);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch course details', 404);
        }
    }

    async getHalls(_req: Request, res: Response, _next: NextFunction) {
        try {
            const halls = await publicService.getHalls();
            return sendSuccess(res, 'Halls fetched successfully', halls);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch halls', 400);
        }
    }

    async getHallById(req: Request, res: Response, _next: NextFunction) {
        try {
            const { hallId } = req.params;
            const hall = await publicService.getHallById(hallId);
            return sendSuccess(res, 'Hall details fetched successfully', hall);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch hall details', 404);
        }
    }

    async getHallAvailability(req: Request, res: Response, _next: NextFunction) {
        try {
            const { hallId } = req.params;
            const availability = await publicService.getHallAvailability(hallId);
            return sendSuccess(res, 'Hall availability fetched successfully', availability);
        } catch (error: any) {
            return sendError(res, error.message || 'Failed to fetch hall availability', 400);
        }
    }
}

export default new PublicController();
