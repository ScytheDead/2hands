const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' },
    classify: { type: mongoose.Schema.Types.ObjectId, ref: 'Classify' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, unique: true, required: true, trim: true, minlength: [5, 'title too short'], maxlength: [255, 'title too long'] },
    ascii_title : { type: String },
    content: { type: String, required: true, minlength: [20, 'content too short'], maxlength: [5000, 'content too long'] },
    price: { type: Number, required: true },
    address: { type: String, required: true, minlength: [5, 'address too short'] , maxlength: [255, 'address too long']},
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    images: [{ type: String, required: true }],
    seller: { type: Boolean, required: true},   //1: seller, 0: buyer
    priority: { 
        enable: { type: Boolean, default: false }, //1: tin được ưu tiên, 0: không được ưu tiên
        expired: { type: Date }
    },    
    status: { type: Number, default: 0, min: -2, max: 1 },  //0: pending, 1: show, -1: reject, -2: hidden
    reason: { type: String },
    note: { type: String },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

postSchema.index({title: 'text', ascii_title: 'text'});

module.exports = mongoose.model('Post', postSchema);