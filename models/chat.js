'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const ChatSchema = new mongoose.Schema(
    {
        participants: [{ type: Schema.ObjectId, ref: 'user' }],
        messages: [{ type: Schema.ObjectId, ref: 'message' }],
        isGroup: { type: Boolean, default: false },
        expireAt: { type: Date } // remove chat after 20 seconds 
    },
    {
        timestamps: true,
        versionKey: false
    }
)
ChatSchema.index({ 'expireAt': 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('chat', ChatSchema);
