'use strict'

const chatController = require('../controllers/chat');
const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler')
const tryCatch = require('../utils/tryCatch');
const authenticate = require('../middlewares/authenticate');


/**
 * @openapi
 * /api/chat:
 *  post:
 *      tags:
 *          - Chat
 *      description: Returns new chat object created
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status: 
 *                                  type: string
 *                                  example: OK
 *                              chat:
 *                                  type: array
 *                                  items:
 *                                       type: object
 *          500:
 *              description: Chat not created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Some error message
 *                              statusCode:
 *                                  type: number
 *                                  example: 400
 *                              errorCode:
 *                                  type: number
 *                                  example: 303
 *             
 */
router.post('/', errorHandler, tryCatch(chatController.insert));

/**
 * @openapi
 * /api/chat/active/{chatId}:
 *  get:
 *      tags:
 *          - Chat
 *      parameters:
 *          - in: query
 *            name: chatId
 *            schema:
 *              type: string
 *            description: Active chat id
 *      description: Returns active chat object
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status: 
 *                                  type: string
 *                                  example: OK
 *                              chat:
 *                                  type: array
 *                                  items:
 *                                       type: object
 *          400:
 *              description: No chat id provided
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Some error message
 *                              statusCode:
 *                                  type: number
 *                                  example: 400
 *                              errorCode:
 *                                  type: number
 *                                  example: 303
 *             
 */
router.get('/active/:chatId?', errorHandler, tryCatch(chatController.item)); // get active chat

/**
 * @openapi
 * /api/chat/{userId}:
 *  get:    
 *      tags:
 *          - Chat
 *      parameters:
 *          - in: query
 *            name: userId
 *            schema:
 *              type: string
 *            description: unique user id
 *      description: Returns chat list by userid
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status: 
 *                                  type: string
 *                                  example: OK
 *                              chats:
 *                                  type: array
 *                                  items:
 *                                       type: object
 *          500:
 *              description: Chat not created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Some error message
 *                              statusCode:
 *                                  type: number
 *                                  example: 400
 *                              errorCode:
 *                                  type: number
 *                                  example: 303
 *          400:
 *              description: User id is not provided
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Some error message
 *                              statusCode:
 *                                  type: number
 *                                  example: 400
 *                              errorCode:
 *                                  type: number
 *                                  example: 303     
 */
router.get('/:userId?', authenticate, errorHandler, tryCatch(chatController.listByUserId)); // get user chat list

/**
 * @openapi
 * /api/chat/{chatId}:
 *  delete:    
 *      tags:
 *          - Chat
 *      parameters:
 *          - in: query
 *            name: chatId
 *            schema:
 *              type: string
 *            description: unique chat id
 *      description: Delete a chat by id
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status: 
 *                                  type: string
 *                                  example: success
 *                              message:
 *                                  type: string
 *                                  example: Chat deleted successfully
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Some error message
 *                              status:
 *                                  type: string
 *                                  example: error
 */
router.delete('/:chatId?', errorHandler, tryCatch(chatController.remove)); 
// router.put('/remove-participant', chatController.removeParticipant);

/**
 * @openapi
 * /api/chat/{chatId}:
 *  put:    
 *      tags:
 *          - Chat
 *      parameters:
 *          - in: query
 *            name: chatId
 *            schema:
 *              type: string
 *            description: Unique chat id
 *          - in: body
 *            name: userId
 *            description: Unique user id
 *            schema:
 *              type: string
 *          - in: body
 *            name: action
 *            description: Must be a verb between add or remove to execute
 *            example: add
 *            schema:
 *              type: string
 *      description: Update chat participants by an action add or remove
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status: 
 *                                  type: string
 *                                  example: success
 *                              updatedChat:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Some error message
 *                              status:
 *                                  type: string
 *                                  example: error
 */
router.put('/:chatId?', errorHandler, tryCatch(chatController.update)); 

module.exports = router;