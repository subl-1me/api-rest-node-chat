'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultAvatar = 'https://res.cloudinary.com/dp2ybql9n/image/upload/v1670695917/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8_twbth7.jpg';

const UserScheme = new mongoose.Schema(
    {
        username: { type: String },
        avatar: { 
            public_id: { 
                type: String, 
                default: 'default'
             },
            url: { 
                type: String,
                default: defaultAvatar
            }
         },
        email:
        {
            type: String,
            unique: true
        },
        password: { type: String },
        chats: [{ type: Schema.ObjectId, ref: 'chat' }]
    },
    {
        timestamps: true,
        versionKey: false
    }
)
    
module.exports = mongoose.model('user', UserScheme);