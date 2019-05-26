const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const producerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    classify: { type: mongoose.Schema.Types.ObjectId, ref: 'Classify', required: true },
    title: { type: String, required: true, trim: true, minlength: [1, 'title too short'], maxlength: [50, 'title too long'] },
    image: { type: String, required: true},
    note: { type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Producer', producerSchema);