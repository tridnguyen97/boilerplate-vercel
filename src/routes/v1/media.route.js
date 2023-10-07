const express = require('express');
const path = require('path');

const router = express.Router();
const { mediaController } = require('../../controllers');
const mediaChatUpload = require('../../middlewares/mediaChatUpload');

router.use(express.static(path.join(__dirname, 'media/images/chat')));

router.route('/image').post(
  mediaChatUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'name', maxCount: 1 },
    { name: 'userId', maxCount: 1 },
  ]),
  mediaController.uploadMedia
);

router.route('/video').post(
  mediaChatUpload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'name', maxCount: 1 },
    { name: 'userId', maxCount: 1 },
  ]),
  mediaController.uploadVideoMedia
);
router.route('/:file').get(mediaController.getMedia);
router.route('/video/:file').get(mediaController.getVideo);

module.exports = router;
