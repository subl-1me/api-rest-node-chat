'use strict'

const User = require('../models/user');
const Bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const AppError = require('../AppError');

const { USERNAME_ALREADY_TAKEN, USER_ID_REQUIRED } = require('../constans/errorCodes');
const { USERNAME_NOT_FOUND } = require('../constans/errorCodes');
const { HASHING_ERROR } = require('../constans/errorCodes');
const { INCORRECT_PASSWORD } = require('../constans/errorCodes');
const { ERROR_REMOVING } = require('../constans/errorCodes');

const Service = require('./service');

class UserService extends Service{

    async register(userData){
        // Search if user exists
        const user = await User.findOne({ username: userData.username });
        if(user) throw new AppError(USERNAME_ALREADY_TAKEN, 'Username already taken.', 200);

        const hash = Bcrypt.hashSync(userData.password, 10);
        userData.password = hash;
        if(hash){
            const user = await User.create(userData);

            return { 
                status: 'success',
                user: user
            };
        }

        throw new AppError(HASHING_ERROR, 'Internal hashing error.', 200);
    }

    async login(userData){
        let userByUsername = await User.findOne({ username: userData.username });
        // user doesn't exists case
        if(!userByUsername) throw new AppError(USERNAME_NOT_FOUND, 'Username not found.', 200);
    
        // user exists case
        var isPasswordValid = Bcrypt.compareSync(userData.password, userByUsername.password);
        if(!isPasswordValid) throw new AppError(INCORRECT_PASSWORD, 'Incorrect password.', 200);
    
        const token = jwt.createToken(userByUsername);
    
        return {
            status: 'success',
            token: token,
            payload: userByUsername
        };
    }

    async getUser(query, filter){
        var user;
        switch(filter){
            case 'userId':
                user = await User.findById(query);
                break;
            case 'username':
                query = new RegExp(query, 'i');
                user = await User.findOne({ username: query })
                break;
            default:
                return null;
        }
        
        return user;
    }

    async getUsers(username){
        let usernameRegx = new RegExp(username, '');
        const users = await User.find({
            username: usernameRegx
        })
    
        return {
            status: 'success',
            users: users
        }
    }
    
    /**
     * @param {*} properties Refers to an array with User Model property (username, email, avatar)
     * and an action to refers if you want to add/remove/edit that property
     * @param {*} userId User unique ID
     */
    async updateById(properties, userId){
        const user = await User.findById(userId);
        if(!user) throw new AppError(USERNAME_NOT_FOUND, 'User not found', 200);

        // all change actions
        if(properties.username){ 
            // verify if already exists an user with that username
            const username = properties.username.value.toLowerCase();
            const userByUsername = await User.findOne({
                username: username
            })

            if(userByUsername) { 
                return {
                    status: 'error',
                    message: 'Username already taken'
                }
            }

            user.username = username;  // set username
        } 

        if(properties.chats){ // remove or add chat
            const chatId = properties.chats.value;
            const action = properties.chats.action;

            switch(action){    
                case 'remove':
                    user.chats = user.chats.filter(chat => chat.toString() !== chatId);
                    break;
                case 'add':
                    user.chats.push(chatId);
                    break;
                default:
                    break;
            }
        }
        
        if(!properties.avatar){ // just save if there isnt new avatar
            user.save();
            return {
                status: 'success',
                updatedUser: user
            }
        }

        // case new avatar
        return new Promise(async (resolve, reject) => {
            if(user.avatar.public_id !== 'default'){
                let res = await this.services.CloudinaryService.deleteImages([user.avatar])

                if(res.status !== 'success'){ 
                    reject({
                        status: 'error',
                        message: 'Error trying to update user avatar'
                    })
                }
            }

            user.avatar = properties.avatar.value; 
            user.save();
            resolve({
                status: 'success',
                updatedUser: user
            }) 

        })
    }

    async remove(userId){
        const user = await User.findById(userId);
        if(!user) throw new AppError(USERNAME_NOT_FOUND, 'User not found.', 200);

        // Remove user from all chats
        if(user.chats.length > 0){
            await this.services.ChatService.removeUserForAll(user.chats, user._id);
        }   

        // Delete profile image from service
        if(user.avatar.public_id !== 'default'){
            const cloudinaryService = await this.services.CloudinaryService.deleteImages([user.avatar]);
            if(cloudinaryService.status === 'error') throw new AppError(ERROR_REMOVING, 'Error removing profile image.', 200);
        }

        await User.findByIdAndDelete(userId);

        return {
            status: 200,
            message: 'User deleted successfully'
        }
    }
    
}

module.exports = new UserService;

// module.exports = {
//     register,
//     login,
//     getUser,
//     getUsers,
//     updateUser
// }