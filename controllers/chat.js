const AppError = require('../AppError');
const chatService = require('../services/chat');

// Errors
const { CHAT_ID_REQUIRED } = require('../constans/errorCodes');
const { USER_ID_REQUIRED } = require('../constans/errorCodes');

const insert = async function(req, res){
    const serviceResponse = await chatService.init(req.body);
        
    return res.status(200).send(serviceResponse);
}

const update = async function(req, res){
    if(!req.query.chatId) throw new AppError(CHAT_ID_REQUIRED, 'Chat id is required', 200);

    const chatId = req.query.chatId;
    const { userId, action } = req.body;

    if(!userId || !action) throw new AppError(REQ_BODY_REQUIRED, 'User id or update action is not provided', 200);
    const serviceResponse = await chatService.update(chatId, userId, action);
    return res.status(200).send(serviceResponse);
}

const remove = async function(req, res){
    if(!req.query.chatId) throw new AppError(CHAT_ID_REQUIRED, 'Chat id is required', 200);

    const serviceResponse = await chatService.removeActiveChat(req.query.chatId);
    return res.status(200).send(serviceResponse);
}

const item = async function(req, res){
    if(!req.query.chatId) throw new AppError(CHAT_ID_REQUIRED, 'Chat id is required', 400);

    const serviceResponse = await chatService.getActiveChat(req.query.chatId);
    return res.status(200).send(serviceResponse);
}

const listByUserId = async function(req, res){
    if(!req.query.userId) throw new AppError(USER_ID_REQUIRED, 'User id is required', 400);

    const serviceResponse = await chatService.listByUserId(req.query.userId);
    return res.status(200).send(serviceResponse);

}

module.exports = {
    insert,
    item,
    listByUserId,
    remove,
    update,
}