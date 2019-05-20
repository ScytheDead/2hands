const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phoneNumber: { type: String, required: [true, 'User phone number required'], unique: true, match: /(07|08|09|01[2|6|8|9])+([0-9]{8})\b/ },
    password: { type: String, min: 6, max: 20, required: true },
    name: {type: String, trim: true},
    address: {type: String, trim: true },
    avatar: {type: String },
    facebook: {type: String, trim: true },
    email: {type: String, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    gender: { type: Boolean },
    // permission: { type: Number, default: 0},     //0: customer, 1: employee, 2: owner
    isAdmin: { type: Boolean, default: 0},
    isEmployee: { type: Boolean, default: 0},
    isUser: { type: Boolean, default: 1},
    status: { type: Boolean, default: 1},  //1: active, 0: non active
    subscribes: [{ type: String }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true }],
    note: {type: String }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userSchema);