const fs = require('fs');
const httpStatus = require('http-status');
const prisma = require('../prisma');
const {
  getVideoFileLocation,
  queryUpdateCategoriesList,
  queryCreateCategoriesList,
  queryFindCategoriesList,
  getThumbnailFileLocation,
  selectCategories,
  removeFileSync,
  getFileAbsPath,
} = require('../utils/video.helper');
const ApiError = require('../utils/ApiError');

const getVideoStream = async (fileId, start, end) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const videoStream = fs.createReadStream(`media/videos/${fileId}`, { start, end });
  return videoStream;
};

const getAllVideos = async (filter, options) => {
  // tạm thời không có DRY vì chưa có extend phần paginate cho prisma
  const [videos, totalCount] = await prisma.$transaction([
    prisma.videos.findMany({
      filter,
      options,
      select: selectCategories(),
    }),
    prisma.videos.count({
      where: filter,
    }),
  ]);
  const { results, page, limit } = videos;
  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
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
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const video = fs.createReadStream(dest);
  video.on('finish', () => {
    video.close(cb);
  });
  return video;
};

const createVideo = async (videoBody) => {
  const { categoriesId, ...payload } = videoBody;
  const query = await queryCreateCategoriesList(categoriesId);
  return prisma.videos.create({
    data: {
      categories: query,
      ...payload,
    },
    select: selectCategories(),
  });
};

const getVideoById = async (videoId) => {
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

const findVideoByCategories = async (filter, options, categoryIds, queryType) => {
  const enhancedFilter = {
    categories: queryFindCategoriesList(categoryIds, queryType),
    ...filter,
  };
  const [videos, totalCount] = await prisma.$transaction([
    prisma.videos.findMany({
      filter: enhancedFilter,
      options,
      select: selectCategories(),
    }),
    prisma.videos.count({
      where: enhancedFilter,
    }),
  ]);
  const { results, page, limit } = videos;
  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
};

const findVideoByTitle = async (filter, options, title) => {
  const titleFilter = {
    title: {
      contains: title,
    },
    ...filter,
  };
  const [videos, totalCount] = await prisma.$transaction([
    prisma.videos.findMany({
      filter: titleFilter,
      options,
      select: selectCategories(),
    }),
    prisma.videos.count({
      where: titleFilter,
    }),
  ]);
  const { results, page, limit } = videos;
  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
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
  findVideoByCategories,
  findVideoByTitle,
  updateVideoById,
  updateThumbnailByVideoId,
  deleteVideoById,
};
