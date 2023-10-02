const getStart = (range) => {
  return Number(range.replace(/\D/g, ''));
};

const getEnd = (start, chunkSize, videoSize) => {
  return Math.min(start + chunkSize, videoSize - 1);
};

const getStreamHeader = (range, chunkSize, videoSize) => {
  const start = getStart(range);
  const end = getEnd(start, chunkSize, videoSize);
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

module.exports = {
  getStreamHeader,
  getVideoFileLocation,
};
