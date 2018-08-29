const mongoose = require('mongoose');
const { Schema } = mongoose;

//--modelo para los usuarios
const UserSchema = new Schema({
    name: { type: String, require: true },
    surname: { type: String },
    nick: { type: String },
    email: { type: String, require: true },
    password: { type: String },
    role: { type: String },
    image: { type: String },
    date: { type: Date, default: Date.now}
});

//--exporto el modelo de mongose para el usuario
module.exports = mongoose.model('User', UserSchema);