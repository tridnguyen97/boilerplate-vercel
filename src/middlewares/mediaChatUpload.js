const multer = require('multer');
const logger = require('../config/logger');

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      logger.info(`files: ${file}`);

      cb(null, 'media/videos');
    } else if (file.fieldname === 'image') {
      cb(null, 'media/images');
    }
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `chatvideo-${Date.now()}.${ext}`);
  },
});

const mediaFilter = (req, file, cb) => {
  logger.info(`files: ${file}`);
  if (file.fieldname === 'image') {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else if (file.fieldname === 'video') {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv') {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const mediaChatUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter,
  limits: { fieldSize: 100 * 1024 * 1024 },
});

module.exports = mediaChatUpload;
