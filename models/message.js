'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
    {
        user: { type: Schema.ObjectId, ref: 'user' },   
        content: { type: String },
        status: { type: String, default: 'sended'},
        chat: { type: mongoose.Types.ObjectId },
        isNotification: { type: Boolean, default: false },
        notificationType: { type: String },
        images: [{
            public_id: { type: String },
            url: { type: String },
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('message', MessageSchema);