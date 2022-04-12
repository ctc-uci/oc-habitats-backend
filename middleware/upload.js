const multer = require('multer');

// Config where to store files on server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

// Config types of file accepted
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('File uploaded not PNG, JPG, or JPEG'), false);
  }
};

// Apply config to multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
