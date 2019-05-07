const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phoneNumber: { type: String, required: true, unique: true, match: /(09|01[2|6|8|9])+([0-9]{8})\b/ },
    password: { type: String, required: true },
    name: {type: String, trim: true},
    address: {type: String, trim: true },
    avatar: {type: String },
    facebook: {type: String, trim: true },
    email: {type: String, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    gender: { type: Boolean },
    subscribes: [{ type: String }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true }],
    notes: {type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userSchema);