'use strict'

const Chat = require('../models/chat');
const Message = require('../models/message');
const AppError = require('../AppError');

const { MESSAGE_NOT_CREATED } = require('../constans/errorCodes');
const { CHAT_EXPIRED } = require('../constans/errorCodes');


const Service = require('./service');

class MessageService extends Service{

    async insert(messageData){
        // Check if chat is not expired
        const chatId = messageData.chat;
        const chat = await Chat.findById(chatId);
        if(!chat){ // Maybe chat is removed automatically
            // Check if there are messages that belongs to that chat and delete them
            let messages = await this.searchManyByChatId(chatId);
            let res = await this.deleteMany(messages);
            
            const properties = {
                chats: {
                    value: chatId,
                    action: 'remove'
                }
            }
            let userRes = await this.services.UserService.updateById(properties, messageData.user);
            if(res.status === 'success' && userRes.status === 'success'){ // messages deleted successfully
                return{
                    status: 'error',
                    message: 'Chat expired.'
                }
            }
        }

        let newMessage = await Message.create(messageData);
        if(!newMessage) throw new AppError(MESSAGE_NOT_CREATED, 'Error trying to create new message.', 500);
        
        // Update chat messages
        chat.messages.push(newMessage);
        chat.save();

        newMessage = await newMessage.populate('user');
        return {
            status: 'success',
            message: newMessage
        }
    }

    async searchManyByChatId(chatId){
        const messages = await Message.find({
            chat: chatId
        })

        return messages;
    }

    async deleteMany(messages){
        // First delete all images attached
        messages.forEach(async message => {
            if(message.images){
                await this.services.CloudinaryService.deleteImages(message.images);
            }
        })

        // Delete all messages
        await Message.deleteMany({
            _id: { $in: messages }
        })

        return {
            status: 'success',
            message: 'OK'
        }
    }

    async insertImages(images, messageId){
        const imagesInfo = images.map(image => {
            return {
                public_id: image.public_id,
                url: image.url
            }
        });
    
        let msg = await Message.findByIdAndUpdate(messageId, {
            $push: {
                images: imagesInfo 
            }
        })
        
        const message = await Message.findById(messageId).populate('user');

        return {
            status: 'success',
            message: message
        }
    }

}

module.exports = new MessageService;
