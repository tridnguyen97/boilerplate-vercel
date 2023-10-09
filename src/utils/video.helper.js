const path = require('path');
const config = require('../config/config');
const logger = require('../config/logger');

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
  console.log(start, end, contentLength);

  return headers;
};

const getVideoFileLocation = (fileId) => {
  return `media/videos/${fileId}`;
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

const queryCategoriesList = async (categoryIds) => {
  let query = {};
  let ids = [];
  if (ids instanceof Array) ids = categoryIds;
  if (ids instanceof String) ids = JSON.parse(categoryIds);
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
  console.log(`query: ${JSON.stringify(query)}`);
  return {
    create: query,
  };
};

const selectCategories = () => {
  return {
    id: true,
    thumbnailId: true,
    fileId: true,
    videoUrl: true,
    title: true,
    description: true,
    categories: {
      select: {
        category: {
          select: {
            name: true,
          },
        },
      },
    },
  };
};

module.exports = {
  getStreamHeader,
  getVideoFileLocation,
  getVideoUrl,
  getThumbnailUrl,
  getThumbnailFileLocation,
  queryCategoriesList,
  selectCategories,
};
