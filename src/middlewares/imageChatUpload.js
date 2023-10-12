const multer = require('multer');
const path = require('path');
const logger = require('../config/logger');

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, 'media/chat/avatars');
    } else if (file.fieldname === 'image') {
      cb(null, 'media/images');
    }
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `chatimg-${Date.now()}.${ext}`);
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
  } else if (file.fieldname === 'avatar') {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const imageChatUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter,
});

module.exports = imageChatUpload;
