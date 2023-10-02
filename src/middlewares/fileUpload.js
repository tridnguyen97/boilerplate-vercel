const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    if (file.fieldname === 'file') {
      // if uploading file
      cb(null, 'media/videos');
    } else if (file.fieldname === 'thumbnail') {
      // else uploading thumbnail
      cb(null, 'media/images');
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'file') {
    // if uploading resume
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv') {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else if (file.fieldname === 'thumbnail') {
    // else uploading image
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const fileUpload = multer({
  storage: fileStorage,
  fileFilter,
});

module.exports = fileUpload;
