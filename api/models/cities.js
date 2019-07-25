const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number},
    name: { type: String },
    location: { type: String },
    type: { type: String },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('City', citySchema);