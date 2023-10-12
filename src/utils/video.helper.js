const path = require('path');
const fs = require('fs');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('./ApiError');

const getStart = (range) => {
  return parseInt(range[0], 10);
};

const getEnd = (parts, videoSize) => {
  return parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
};

const getStreamHeader = (range, videoSize) => {
  const parts = range.replace(/bytes=/, '').split('-');

  const start = getStart(parts);
  const end = getEnd(parts, videoSize);
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  return headers;
};

const getVideoFileLocation = (fileId) => {
  return `media/videos/${fileId}`;
};

const getFileAbsPath = (fileId) => {
  return path.resolve(getVideoFileLocation(fileId));
};

const getVideoUrl = (videoId) => {
  return `${config.host_url}/v1/videos/view/${videoId}`;
};

const getThumbnailUrl = (thumbnailId) => {
  return `${config.host_url}/v1/videos/thumbnail/${thumbnailId}`;
};

const getThumbnailFileLocation = (thumbnailId) => {
  return path.resolve(`media/images/${thumbnailId}`);
};

const queryUpdateCategoriesList = async (categoryIds) => {
  let query = {};
  let ids = [];
  logger.info(`query category ids ${categoryIds}`);
  logger.info(`type of category ids ${typeof categoryIds}`);
  if (categoryIds instanceof Array) ids = categoryIds;
  if (typeof categoryIds === 'string') ids = JSON.parse(categoryIds);
  logger.info(`ids ${ids}`);
  if (!ids || !ids.length)
    return {
      create: [],
    };
  query = ids.map((id) => {
    return {
      category: {
        connect: {
          id,
        },
      },
    };
  });
  return {
    deleteMany: {},
    create: query,
  };
};

const queryCreateCategoriesList = async (categoryIds) => {
  let query = {};
  let ids = [];
  logger.info(`query category ids ${categoryIds}`);
  logger.info(`type of category ids ${typeof categoryIds}`);
  if (categoryIds instanceof Array) ids = categoryIds;
  if (typeof categoryIds === 'string') ids = JSON.parse(categoryIds);
  logger.info(`ids ${ids}`);
  if (!ids || !ids.length)
    return {
      create: [],
    };
  query = ids.map((id) => {
    return {
      category: {
        connect: {
          id,
        },
      },
    };
  });
  return {
    create: query,
  };
};

const selectCategories = () => {
  return {
    id: true,
    thumbnailId: true,
    fileId: true,
    thumbnailUrl: true,
    videoUrl: true,
    title: true,
    description: true,
    categories: {
      select: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    },
  };
};

const removeFile = (filePath) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(`remove file error: ${err}`);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Could not delete the file.`);
    }
  });
};

const removeFileSync = (filePath) => {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.unlinkSync(filePath);
    logger.info('File is deleted.');
  } catch (err) {
    logger.error(`remove file error: ${err}`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Could not delete the file.`);
  }
};

module.exports = {
  getStreamHeader,
  getVideoFileLocation,
  getFileAbsPath,
  getVideoUrl,
  getThumbnailUrl,
  getThumbnailFileLocation,
  queryCreateCategoriesList,
  queryUpdateCategoriesList,
  selectCategories,
  removeFile,
  removeFileSync,
};
