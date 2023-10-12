const multer = require('multer');

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, 'media/audios');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `chataudio-${Date.now()}.mp3`);
  },
});

const mediaFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    if (
      file.mimetype === 'audio/mpeg' ||
      file.mimetype === 'audio/mpeg3' ||
      file.mimetype === 'audio/x-mpeg-3' ||
      file.mimetype === 'audio/mp3'
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
