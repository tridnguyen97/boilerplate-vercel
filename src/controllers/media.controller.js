const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { mediaService } = require('../services');

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

const uploadAudioMedia = catchAsync(async (req, res) => {
  const bodyAudio = {
    audio: req.files.audio,
    name: req.body.name,
    userId: req.body.userId,
  };
  const audio = await mediaService.createAudioMedia(bodyAudio);
  res.status(httpStatus.CREATED).send(audio);
});

const getMedia = catchAsync(async (req, res) => {
  res.sendFile(mediaService.getMediaFile(req.params.file));
});

const getVideo = catchAsync(async (req, res) => {
  res.sendFile(mediaService.getMediaVideo(req.params.file));
});

const getAudio = catchAsync(async (req, res) => {
  res.sendFile(mediaService.getMediaAudio(req.params.file));
});

module.exports = {
  uploadMedia,
  uploadVideoMedia,
  uploadAudioMedia,
  getMedia,
  getVideo,
  getAudio,
};
