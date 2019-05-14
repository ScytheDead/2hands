const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true, trim: true, min: 5, max: 100 },
    image: { type: String, required: true},
    classisfies: [
        { title: { type: String, required: true, unique: true, trim: true, min: 5, max: 255 } },
        { producer: [
            { title: { type: String, required: true, unique: true, trim: true, min: 1, max: 50 } },
            { logo: { type: String, required: true} },
            { notes: { type: String } }
        ]},
        { notes: { type: String } }
    ],
    notes: { type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Test', categorySchema);