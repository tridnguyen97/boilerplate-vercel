const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const videoRoute = require('./video.route');
const friendRoute = require('./friend.route');
const mediaRoute = require('./media.route');
const categoryRoute = require('./category.route');
const stringeeRoute = require('./stringee.route');
const lotteryRoute = require('./lottery.route');
const adminRoute = require('./admin.route');
const socketRoute = require('./socket.route');
const bankRoute = require('./bank.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/videos',
    route: videoRoute,
  },
  {
    path: '/friends',
    route: friendRoute,
  },
  {
    path: '/media',
    route: mediaRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/stringee',
    route: stringeeRoute,
  },
  {
    path: '/lottery',
    route: lotteryRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/socket',
    route: socketRoute,
  },
  {
    path: '/bank',
    route: bankRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
