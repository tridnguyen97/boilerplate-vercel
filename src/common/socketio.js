const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

let io;

const getIO = () => {
  try {
    if (!io) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Socket not working');
    return io;
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, {
      status: 'error',
      message: `socket error: ${e}`,
    });
  }
};

const disconnect = () => {
  io.on('disconnecting', () => {
    logger.info(io.rooms);
  });

  io.on('disconnect', () => {
    logger.info('io disconnected');
  });
};

const setIO = (extio) => {
  io = extio;
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(`${userId}`);
    });
  });
};

module.exports = {
  getIO,
  setIO,
  disconnect,
};
