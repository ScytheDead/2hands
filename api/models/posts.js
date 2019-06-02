const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
    classify: { type: mongoose.Schema.Types.ObjectId, ref: 'Classify', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true, unique: true, minlength: [5, 'title too short'] , maxlength: [255, 'title too long'] },
    content: { type: String, required: true, minlength: [20, 'content too short'], maxlength: [5000, 'content too long'] },
    price: { type: Number, required: true },
    address: { type: String, required: true, minlength: [5, 'address too short'] , maxlength: [255, 'address too long']},
    images: [{ type: String, required: true }],
    seller: { type: Boolean, required: true},   //1: seller, 0: buyer
    priority: { type: Boolean, default: false },    //1: tin được ưu tiên, 0: không được ưu tiên
    status: { type: Number, default: 0, min: -1, max: 1 },  //0: pending, 1: show, -1: reject
    note: { type: String },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Post', postSchema);