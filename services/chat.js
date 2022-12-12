const Chat = require('../models/chat');
const User = require('../models/user');
const AppError = require('../AppError');
const Moment = require('moment');

// Errors
const { ERROR_INIT_CHAT } = require('../constans/errorCodes')
const { CHAT_NOT_FOUND } = require('../constans/errorCodes')
const { ERROR_REMOVING_USER } = require('../constans/errorCodes');

const Service = require('./service');

class ChatService extends Service{

    async init(request){
        const data = {
            participants: [
                request.from._id,
                request.to._id
            ],
            expireAt: Moment().add('5', 'hours').toDate()
        }
    
        const chat = await Chat.create(data);
        if(!chat) throw new AppError(ERROR_INIT_CHAT, 'Error trying to init chat.', 500);

        // Update participants's chat list
        data.participants.forEach(async (participant) => {
            await User.findByIdAndUpdate(participant, {
                $push: { chats: chat._id }
            })
        });
    
        const chatPopulated = await Chat.findById(chat._id).populate('participants');
        return {
            status: 'success',
            chat: chatPopulated
        }
    }

    async update(chatId, userId, action){
        if(action === 'remove') return this.removeParticipant(chatId, userId);

        return this.addParticipant(chatId, userId);
    }

    async removeParticipant(chatId, userId){
        // Search chat, then remove participant
        let chat = await Chat.findById(chatId).populate('messages').populate('participants');    
        if(!chat) throw new AppError(CHAT_NOT_FOUND, 'Chat not found.', 200);
        
        if(chat.participants.length > 1){
            // await Chat.findByIdAndUpdate(chatId, {
            //     $pull: { participants: userId }
            // })
            chat.participants = chat.participants.filter(user => user._id.toString() !== userId);
            if(chat.participants.length <= 2){
                chat.isGroup = false;
            }
            chat.save();
        }else{

            // case chat has no users, just delete chat and messages
            const response = await this.services.MessageService.deleteMany(chat.messages);
            if(response.status === 'success') { 
                await Chat.findByIdAndDelete(chatId); 
            }

        }

        const properties = {
            chats: {
                value: chatId,
                action: 'remove'
            }
        }
        // update user
        const user = await this.services.UserService.updateById(properties, userId);

        return {
            status: 'success',
            serviceData: { chat, user }
        }

    }

    async addParticipant(chatId, userId){
        let updatedChat = await Chat.findByIdAndUpdate(chatId, {
            $push: { participants: userId },
        }, { new: true }).populate('participants')
        .populate({
            path: 'messages',
            populate: {
                path: 'user'
            }
        })

        if(updatedChat.participants.length > 2) { updatedChat.isGroup = true }
        updatedChat.save();

    
        const properties = {
            chats: {
                value: chatId,
                action: 'add'
            }
        }
        await this.services.UserService.updateById(properties, userId);
    
        return  {
            status: 'success',
            updatedChat: updatedChat
        }
    }

    async listByUserId(userId){
        const chats = await Chat.find({
            participants: userId
        }).populate({
            path: 'messages',
            populate:{
                path: 'user'
            }
        }).populate('participants');
    
        return {
            status: 'success',
            chats: chats
        }
    }

    async removeUserForAll(chats, userId){
        const userIdString = userId.toString();

        chats.forEach(async (chatId) => {
            let chat = await Chat.findByIdAndUpdate(chatId,
            {
                $pull: { 
                    participants: userId
                }
            }, { new: true }).populate('messages');

            // if chat have messages remove all from that user
            if(chat.messages.length > 0){ 
                let userMessages = chat.messages.filter(message => message.user.toString() === userIdString);
                if(!userMessages) return; // No messages

                let res = await this.services.MessageService.deleteMany(userMessages);
                if(res.status === 'error') throw new AppError(ERROR_REMOVING_USER, 'Error trying to remove user', 400);

                // filter for user's messages deleted
                chat.messages = chat.messages.filter(message => message.user.toString() !== userIdString);
            }

            chat.save();
        })

        return {
            status: 'OK'
        }
    }

}

module.exports = new ChatService;