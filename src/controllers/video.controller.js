const httpStatus = require('http-status');
const fs = require('fs');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { videoService } = require('../services');
const {
  getStreamHeader,
  getVideoFileLocation,
  getVideoUrl,
  getThumbnailUrl,
  getVideoAbsLocation,
  getMobileVideoUrl,
} = require('../utils/video.helper');

const getAllVideos = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const videos = await videoService.getAllVideos(filter, options);
  res.send(videos);
});

const getVideo = catchAsync(async (req, res) => {
  const { fileId } = req.params;
  let videoRange = req.headers.range;
  videoRange = 'bytes=0-';
  const video = await videoService.getVideo(fileId);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
  }
  const fileLocation = getVideoFileLocation(fileId);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const videoSize = fs.statSync(fileLocation).size;
  const headers = getStreamHeader(videoRange, videoSize);
  res.writeHead(206, headers);
  const stream = await videoService.getVideoStream(fileId);
  stream.pipe(res);
});

const viewVideo = catchAsync(async (req, res) => {
  const { fileId } = req.params;
  const video = await videoService.getVideo(fileId);
  if (!video) throw new ApiError(httpStatus.NOT_FOUND, 'video not found');
  const stream = await videoService.getVideoByNoRange(fileId);
  res.pipe(stream);
});

const viewMobileVideo = catchAsync(async (req, res) => {
  res.sendFile(getVideoAbsLocation(req.params.fileId));
});

const uploadVideo = catchAsync(async (req, res) => {
  const { title, description, categoriesId } = req.body;
  const { file, thumbnail } = req.files;
  if (!file) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot upload video');
  if (!thumbnail) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot upload thumbnail');
  if (!title || !description) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot upload video information');
  const fileId = file[0].filename;
  const thumbnailId = thumbnail[0].filename;
  const videoUrl = getVideoUrl(fileId);
  const mVideoUrl = getMobileVideoUrl(fileId);
  const thumbnailUrl = getThumbnailUrl(thumbnailId);
  const payload = {
    fileId,
    thumbnailId: thumbnail[0].filename,
    videoUrl,
    mVideoUrl,
    thumbnailUrl,
    title,
    description,
    categoriesId,
  };
  const video = await videoService.createVideo(payload);
  res.send(video);
});

const getVideoById = catchAsync(async (req, res) => {
  const videoInfo = await videoService.getVideoById(req.params.id);
  if (!videoInfo) throw new ApiError(httpStatus.NOT_FOUND, 'video info not found');
  res.send(videoInfo);
});

const searchVideo = catchAsync(async (req, res) => {
  const videos = await videoService.findVideoByName(req.params.keyword);
  if (!videos) throw new ApiError(httpStatus.NOT_FOUND, 'video search not found');
  res.send(videos);
});

const updateVideoDetail = catchAsync(async (req, res) => {
  const video = await videoService.updateVideoById(req.params.id, req.body);
  res.send(video);
});

const getThumbnailById = catchAsync(async (req, res) => {
  const thumbnail = await videoService.getThumbnail(req.params.thumbnailId);
  if (!thumbnail) throw new ApiError(httpStatus.NOT_FOUND, 'video thumbnail not found');
  res.sendFile(thumbnail);
});

const updateThumbnailById = catchAsync(async (req, res) => {
  const { thumbnailId } = req.files;
  const { videoId } = req.body;
  if (!thumbnailId) throw new ApiError(httpStatus.NOT_FOUND, 'Required thumbnail file');
  const video = await videoService.getVideoById(videoId);
  if (!video) throw new ApiError(httpStatus.NOT_FOUND, 'video not found');
  const thumbnailName = thumbnailId[0].filename;
  const thumbnailBody = {
    thumbnailId: thumbnailName,
    thumbnailUrl: getThumbnailUrl(thumbnailName),
  };
  const updatedVideo = await videoService.updateThumbnailByVideoId(videoId, thumbnailBody);
  res.send(updatedVideo);
});

const deleteVideoById = catchAsync(async (req, res) => {
  await videoService.deleteVideoById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getVideosByCategories = catchAsync(async (req, res) => {
  console.log('body', JSON.stringify(req.body));
  console.log('query', JSON.stringify(req.query.type));
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const videos = await videoService.findVideoByCategories(filter, options, req.body.categories, req.query.type);
  if (!videos) throw new ApiError(httpStatus.NOT_FOUND, 'videos not found');
  res.send(videos);
});

module.exports = {
  getAllVideos,
  getVideo,
  getVideosByCategories,
  viewVideo,
  viewMobileVideo,
  uploadVideo,
  getVideoById,
  searchVideo,
  updateVideoDetail,
  updateThumbnailById,
  getThumbnailById,
  deleteVideoById,
};
