import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'text/plain'
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|png|jpe?g|txt)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PNG, JPEG, and TXT files are allowed.'), false);
  }
};

export const uploadReportFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max file size
  },
  fileFilter
}).single('file');
