'use strict'
const AppError = require('../AppError');
const userService = require('../services/user');
const { USERNAME_IS_REQUIRED, USER_ID_REQUIRED } = require('../constans/errorCodes');

const insert = async function(req, res){
    const serviceResponse = await userService.register(req.body);

    return res.status(200).send(serviceResponse);
}

const authenticate = async function(req, res){
    const serviceData = await userService.login(req.body);

    return res.status(200).send(serviceData)
}

const updateUser = async function(req, res){
    const userId = req.query.userId;
    if(!userId) throw new AppError(USER_ID_REQUIRED, 'User is required', 200);

    const serviceResponse = await userService.updateById(req.body, userId);
    return res.status(200).send(serviceResponse);    
}

const item = async function(req, res){ // search result
    if(!req.query.username) throw new AppError(USERNAME_IS_REQUIRED, 'Username is required', 200);

    const serviceResponse = await userService.getUsers(req.query.username);

    return res.status(200).send(serviceResponse);
}

const remove = async function(req, res){
    if(!req.query.userId) throw new ArrError(USER_ID_REQUIRED, 'User ID is required.', 400);

    const response = await userService.remove(req.query.userId);
    return res.status(response.status).send(response);
}

module.exports = {
    insert,
    authenticate,
    item,
    updateUser,
    remove
}

