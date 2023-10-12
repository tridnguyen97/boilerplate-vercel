const fs = require('fs');
const httpStatus = require('http-status');
const prisma = require('../prisma');
const {
  getVideoFileLocation,
  queryCreateCategoriesList,
  queryUpdateCategoriesList,
  getThumbnailFileLocation,
  selectCategories,
  removeFileSync,
  getFileAbsPath,
} = require('../utils/video.helper');
const ApiError = require('../utils/ApiError');

const getVideoStream = async (fileId, start, end) => {
  const videoStream = fs.createReadStream(`media/videos/${fileId}`, { start, end });
  return videoStream;
};

const getAllVideos = async (filter, options) => {
  return prisma.videos.findMany({
    filter,
    options,
    select: selectCategories(),
  });
};

const getVideo = async (videoId) => {
  return prisma.videos.findUnique({
    where: {
      fileId: videoId,
    },
  });
};

const getVideoByNoRange = async (videoId, cb) => {
  const dest = getVideoFileLocation(videoId);
  console.log(dest);
  const video = fs.createReadStream(dest);
  video.on('finish', () => {
    video.close(cb);
  });
  return video;
};

const createVideo = async (videoBody) => {
  const { categoriesId, ...payload } = videoBody;
  console.log(categoriesId);
  console.log(`request body: ${JSON.stringify(videoBody)}`);
  const query = await queryCreateCategoriesList(categoriesId);
  console.log(query);
  return prisma.videos.create({
    data: {
      categories: query,
      ...payload,
    },
    select: selectCategories(),
  });
};

const getVideoById = async (videoId) => {
  console.log('videoId', videoId);
  return prisma.videos.findUnique({
    where: {
      id: videoId,
    },
    select: selectCategories(),
  });
};

const findVideoByName = async (keyword) => {
  return prisma.videos.findMany({
    where: {
      name: {
        contains: keyword,
      },
    },
  });
};

const getThumbnail = async (thumbnailId) => {
  return getThumbnailFileLocation(thumbnailId);
};

const deleteVideoById = async (videoId) => {
  const video = await getVideoById(videoId);
  if (!video) throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
  await prisma.videos.update({
    where: {
      id: video.id,
    },
    data: {
      categories: {
        deleteMany: {},
      },
    },
  });
  const videoPath = getFileAbsPath(video.fileId);
  removeFileSync(videoPath);
  return prisma.videos.delete({
    where: {
      id: video.id,
    },
  });
};

const updateVideoById = async (videoId, videoBody) => {
  let query = {};
  const { categoriesId, ...body } = videoBody;
  console.log(categoriesId);
  const video = await getVideoById(videoId);
  if (!video) throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
  if (categoriesId && categoriesId.length) {
    query = await queryUpdateCategoriesList(categoriesId);
  }
  return prisma.videos.update({
    where: {
      id: videoId,
    },
    data: {
      categories: query,
      ...body,
    },
    select: selectCategories(),
  });
};

const updateThumbnailByVideoId = async (videoId, thumbnailBody) => {
  return prisma.videos.update({
    where: {
      id: videoId,
    },
    data: thumbnailBody,
    select: selectCategories(),
  });
};

module.exports = {
  getVideoStream,
  getVideo,
  getAllVideos,
  getThumbnail,
  getVideoByNoRange,
  createVideo,
  getVideoById,
  findVideoByName,
  updateVideoById,
  updateThumbnailByVideoId,
  deleteVideoById,
};
