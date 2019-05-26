const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true, trim: true, minlength: [5, 'title too short'], maxlength: [100, 'title too long'] },
    image: { type: String, required: true},
    note: { type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Category', categorySchema);