const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const producerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classifyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classify', required: true },
    title: { type: String, required: true, unique: true, trim: true, min: 1, max: 50 },
    logo: { type: String, required: true},
    notes: { type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Producer', producerSchema);