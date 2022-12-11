'use strict'

const express = require('express');
const router = express.Router();

const errorHandler = require('../middlewares/errorHandler');
const tryCatch = require('../utils/tryCatch');

// Controller
const userController = require('../controllers/user');

/**
 * @openapi
 * /api/user:
 *  post:
 *      tags:
 *          - User
 *      description: Insert a new user object and returns it
 *      parameters:
 *          - in: body
 *            name: username
 *            schema:
 *              type: string
 *          - in: body
 *            name: email
 *            schema:
 *              type: string
 *          - in: body
 *            name: password
 *            schema:
 *              type: string
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
 *                              user:
 *                                  type: array
 *                                  items:
 *                                       type: object
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
router.post('/', errorHandler, tryCatch(userController.insert));

/**
 * @openapi
 * /api/user/authenticate:
 *  post:
 *      tags:
 *          - User
 *      description: Authenticate user and return token & payload
 *      parameters:
 *          - in: body
 *            name: username
 *            schema:
 *              type: string
 *          - in: body
 *            name: password
 *            schema:
 *              type: string
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
 *                              token: 
 *                                  type: string
 *                              payload: 
 *                                  type: array
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
router.post('/authenticate', errorHandler, tryCatch(userController.authenticate));

/**
 * @openapi
 * /api/user/search/{username}:
 *  get:
 *      tags:
 *          - User
 *      description: Returns a user object by username
 *      parameters:
 *          - in: query
 *            name: username
 *            schema:
 *              type: string
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
 *                              user: 
 *                                  type: array
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
 *             
 */
router.get('/search/:username?', errorHandler, tryCatch(userController.item));

router.put('/:userId?', tryCatch(userController.updateUser), errorHandler);

router.delete('/:userId?', errorHandler, tryCatch(userController.remove));


module.exports = router;