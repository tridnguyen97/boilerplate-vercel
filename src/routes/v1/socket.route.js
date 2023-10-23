const express = require('express');
const socket = require('../../common/socketio');

const router = express.Router();
router.route('/order/status').get(socket.emitRealTimeOrderStatus);

module.exports = router;
