'use strict'

const messageController = require('../controllers/message');
const express = require('express');
const router = express.Router();

const errorHandler = require('../middlewares/errorHandler');
const tryCatch = require('../utils/tryCatch');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, errorHandler, tryCatch(messageController.insert));
router.put('/:messageId?', authenticate, errorHandler, tryCatch(messageController.insertImages));

module.exports = router;