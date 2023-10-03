const httpStatus = require('http-status');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { videoService } = require('../services');
const { getStreamHeader, getVideoFileLocation } = require('../utils/video.helper');

const getAllVideos = catchAsync(async (req, res) => {
  const videos = await videoService.getAllVideos();
  res.send(videos);
});

const getVideo = catchAsync(async (req, res) => {
  const { fileId } = req.params;
  const { range } = req.headers;
  const CHUNKSIZE = 10 ** 6;
  if (!range) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Range of video not found');
  }
  const video = await videoService.getVideo(fileId);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
  }
  const fileLocation = getVideoFileLocation(fileId);
  const videoSize = fs.statSync(fileLocation).size;
  const headers = getStreamHeader(range, CHUNKSIZE, videoSize);
  res.writeHead(206, headers);
  const stream = await videoService.getVideoStream(fileId);
  stream.pipe(res);
});

const uploadVideo = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  const { file, thumbnail } = req.files;
  if (!file) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot upload video');
  if (!thumbnail) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot upload thumbnail');
  if (!title || !description) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot upload video information');
  const payload = {
    fileId: file[0].filename,
    thumbnailId: thumbnail[0].filename,
    title,
    description,
  };
  const video = await videoService.createVideo(payload);
  res.send(video);
});

module.exports = {
  getAllVideos,
  getVideo,
  uploadVideo,
};
