import { Request, Response, Router } from 'express';
import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { sendError, sendSuccess } from '../utils/response';

const router = Router();

// TEMPORARY bootstrap endpoint for creating exactly one platform admin.
const ADMIN_EMAIL = 'admin@platform.com';
const ADMIN_PASSWORD = 'Admin@123456';
const ADMIN_NAME = 'Admin';

function getProvidedSecret(req: Request): string | undefined {
    const querySecret = typeof req.query.secret === 'string' ? req.query.secret : undefined;
    const headerSecret = req.header('x-bootstrap-secret') || req.header('x-admin-bootstrap-secret');
    return (headerSecret || querySecret || '').trim() || undefined;
}

async function bootstrapAdmin(req: Request, res: Response) {
    try {
        const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET?.trim();
        if (!configuredSecret) {
            // Hidden by default unless explicitly enabled via env.
            return sendError(res, 'Route not found', 404);
        }

        const providedSecret = getProvidedSecret(req);
        if (!providedSecret || providedSecret !== configuredSecret) {
            return sendError(res, 'Unauthorized', 403);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (existingUser) {
            if (existingUser.role === 'PLATFORM_ADMIN') {
                return sendSuccess(res, 'Admin already exists. No changes made.', {
                    created: false,
                    email: existingUser.email,
                    role: existingUser.role,
                });
            }

            return sendError(
                res,
                `User already exists with role ${existingUser.role}. Admin was not created.`,
                409
            );
        }

        const hashedPassword = await hashPassword(ADMIN_PASSWORD);
        const admin = await prisma.user.create({
            data: {
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'PLATFORM_ADMIN',
                status: 'ACTIVE',
                emailVerified: true,
            },
        });

        return sendSuccess(
            res,
            'Admin created successfully.',
            {
                created: true,
                id: admin.id,
                email: admin.email,
                role: admin.role,
            },
            201
        );
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to bootstrap admin', 500);
    }
}

// Keep both methods for convenience during temporary bootstrap.
router.get('/bootstrap-admin', bootstrapAdmin);
router.post('/bootstrap-admin', bootstrapAdmin);

export default router;

