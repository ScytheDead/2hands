const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const producerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classify: { type: mongoose.Schema.Types.ObjectId, ref: 'Classify', required: true },
    title: { type: String, required:true, trim: true, min: 1, max: 50 },
    image: { type: String, required: true},
    note: { type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Producer', producerSchema);