const mongoose = require('mongoose');
const { Schema } = mongoose;


//--modelo para los menus
const MenuSchema = new Schema({
    name: { type: String, require: true },
    price: { type: String },
    image: { type: String, require: true },
    description: { type: String, require: true }
});

//--exporto el modelo de mongose para el menu
module.exports = mongoose.model('Menu', MenuSchema);