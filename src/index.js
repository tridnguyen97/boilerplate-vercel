const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { cronLottery } = require('./common/cronJobLottery');
const commonSocket = require('./common/socketio');

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
  // eslint-disable-next-line global-require
  const io = require('socket.io')(server);
  cronLottery(io);
  commonSocket.setIO(io);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    socket.disconnect();
    server.close();
  }
});
