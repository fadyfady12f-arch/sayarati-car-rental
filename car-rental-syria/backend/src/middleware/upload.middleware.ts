import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { AppError } from '../utils/appError.js';

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream', // For GLB files
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('نوع الملف غير مسموح', 400) as any);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    files: 10,
  },
});

export const uploadImages = (field: string, maxCount: number) => {
  return upload.array(field, maxCount);
};

export const uploadSingle = (field: string) => {
  return upload.single(field);
};
