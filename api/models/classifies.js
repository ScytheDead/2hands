const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const classifySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, unique: true, trim: true, min: 5, max: 255 },
    image: { type: String, required: true},
    note: { type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Classify', classifySchema);