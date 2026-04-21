import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

// Always resolve uploads to <project-root>/uploads in both src (ts-node) and dist builds.
const uploadsDir = path.resolve(__dirname, '../../uploads');

function ensureUploadsDir() {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
}

// Ensure the directory exists as soon as middleware is loaded.
ensureUploadsDir();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Guard against ephemeral file systems or cold starts where folder is missing.
        ensureUploadsDir();
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    },
});

// File filter for allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow PDFs and images
    const allowedMimes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
};

// Create multer upload instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
    },
});

// Multer field configurations for different roles
export const trainerUploadFields = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'certificates', maxCount: 5 },
]);

export const instituteUploadFields = upload.fields([
    { name: 'licenseDocument', maxCount: 1 },
]);
