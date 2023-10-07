const express = require('express');
const path = require('path');

const router = express.Router();
const { mediaController } = require('../../controllers');
const mediaUpload = require('../../middlewares/mediaUpload');

router.use(express.static(path.join(__dirname, 'media/images/chat')));

router.route('/').post(
  mediaUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'name', maxCount: 1 },
    { name: 'userId', maxCount: 1 },
  ]),
  mediaController.uploadMedia
);
router.route('/:file').get(mediaController.getMedia);

module.exports = router;
