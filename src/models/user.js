const mongoose = require('mongoose');
const { Schema } = mongoose;


//--modelo para los usuarios
const UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    nick: { type: String },
    email: { type: String},
    password: { type: String },
    role: { type: String },
    image: { type: String },
    date: { type: Date, default: Date.now}
});

//--exporto el modelo de mongose para el usuario
module.exports = mongoose.model('User', UserSchema);