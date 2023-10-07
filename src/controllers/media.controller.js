const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { mediaService } = require('../services');
const { getMediaFile, getMediaVideo } = require('../utils/media.helper');

const uploadMedia = catchAsync(async (req, res) => {
  const bodyMedia = {
    image: req.files.image,
    name: req.body.name,
    userId: req.body.userId,
  };
  const media = await mediaService.createMedia(bodyMedia);
  res.status(httpStatus.CREATED).send(media);
});

const uploadVideoMedia = catchAsync(async (req, res) => {
  const bodyVideo = {
    video: req.files.video,
    name: req.body.name,
    userId: req.body.userId,
  };
  const video = await mediaService.createVideoMedia(bodyVideo);
  res.status(httpStatus.CREATED).send(video);
});

const getMedia = catchAsync(async (req, res) => {
  res.sendFile(getMediaFile(req.params.file));
});

const getVideo = catchAsync(async (req, res) => {
  res.sendFile(getMediaVideo(req.params.file));
});

module.exports = {
  uploadMedia,
  uploadVideoMedia,
  getMedia,
  getVideo,
};
