const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userSell: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userBuy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    contentChatUserBuy: [{
        content: { type: String },
        seen: { type: Boolean, default: 0 }, //1: read, 0: unread
        time: { type : Date, default: Date.now }
    }],
    contentChatUserSell: [{
        content: { type: String },
        seen: { type: Boolean, default: 0 }, //1: read, 0: unread
        time: { type : Date, default: Date.now }
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Message', messageSchema);