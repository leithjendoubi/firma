import multer from "multer";
import path from "path";

// Allowed file types
const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// File size limits (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only images (JPEG, PNG, WebP) and documents (PDF, DOC, DOCX) are allowed.'), false);
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error('File too large. Maximum size is 5MB.'), false);
  }

  // Check for malicious file extensions
  const ext = path.extname(file.originalname).toLowerCase();
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
  
  if (dangerousExtensions.includes(ext)) {
    return cb(new Error('Dangerous file type not allowed.'), false);
  }

  cb(null, true);
};

// Generate safe filename
const generateSafeFilename = (file) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(file.originalname);
  const safeName = `${timestamp}_${randomString}${ext}`;
  return safeName;
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const safeFilename = generateSafeFilename(file);
    cb(null, safeFilename);
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES
  }
});

// Specific upload configurations
export const imageUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed.'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 3 // Max 3 images
  }
});

export const documentUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!allowedDocumentTypes.includes(file.mimetype)) {
      return cb(new Error('Only document files (PDF, DOC, DOCX) are allowed.'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Max 1 document
  }
});

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

export default upload;
