'use strict'

const AppError = require('../AppError');
const MessageService = require('../services/message');

const { NO_MESSAGE_PROVIDED } = require('../constans/errorCodes');
const { MESSAGE_ID_REQUIRED } = require('../constans/errorCodes');
const { NO_IMAGES } = require('../constans/errorCodes');

const insert = async function(req, res){
    if(!req.body.message) throw new AppError(NO_MESSAGE_PROVIDED, 'Message is required', 401);

    const msgServiceResponse = await MessageService.insert(req.body.message);

    return res.status(200).send(msgServiceResponse);
}

const insertImages = async function(req, res){
    if(!req.query.messageId) throw new AppError(MESSAGE_ID_REQUIRED, 'Message ID is required', 200);

    const { images } = req.body;
    const messageId = req.query.messageId;

    if(!images || images.length === 0) throw new AppError(NO_IMAGES, 'No images found in request.', 400);

    const response = await MessageService.insertImages(images, messageId);

    return res.status(200).send(response)
}


module.exports = {
    insert,
    insertImages
}