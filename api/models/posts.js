const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
    classifyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classify', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true, unique: true, min: 20, max: 255 },
    content: { type: String, required: true, min: 20, max: 5000 },
    price: { type: Number, required: true },
    images: [{ type: String }],
    seller: { type: Boolean, required: true},
    priority: { type: Boolean, default: false },
    status: { type: Boolean, default: 0 },  //0: pending, 1: show
    note: { type: String },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Post', postSchema);