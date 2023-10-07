const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { mediaService } = require('../services');
const { getMediaFile } = require('../utils/media.helper');

const uploadMedia = catchAsync(async (req, res) => {
  const bodyMedia = {
    image: req.files.image[0],
    name: req.body.name,
    userId: req.body.userId,
  };
  const media = await mediaService.createMedia(bodyMedia);
  res.status(httpStatus.CREATED).send(media);
});

const getMedia = catchAsync(async (req, res) => {
  res.sendFile(getMediaFile(req.params.file));
});

module.exports = {
  uploadMedia,
  getMedia,
};
