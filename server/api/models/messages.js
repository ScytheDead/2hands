const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userSellId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userBuyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    contentChatUserBuy: [{
        content: { type: String },
        time: { type : Date, default: Date.now }
    }],
    contentChatUserSell: [{
        content: { type: String },
        time: { type : Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Message', messageSchema);