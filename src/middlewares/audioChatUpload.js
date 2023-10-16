const multer = require('multer');
const path = require('path');
const logger = require('../config/logger');

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, 'media/chat/audios');
    }
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if (ext === 'x-m4a' || ext === 'octet-stream') cb(null,`chataudio-${Date.now()}.m4a`);
    else cb(null, `chataudio-${Date.now()}.${ext}`);
  },
});

const mediaFilter = (req, file, cb) => {
  logger.info(`mime type: ${file.mimetype}`)
  if (file.fieldname === 'audio') {
    if (
      file.mimetype === 'audio/x-m4a' ||
      file.mimetype === 'audio/mp4'   ||
      file.mimetype === 'audio/mpeg'  ||
      file.mimetype === 'application/octet-stream'
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const audioChatUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter,
});

module.exports = audioChatUpload;
