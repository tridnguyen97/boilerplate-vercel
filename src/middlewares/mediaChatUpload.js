const multer = require('multer');

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const mediaFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const mediaChatUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter,
});

module.exports = mediaChatUpload;
