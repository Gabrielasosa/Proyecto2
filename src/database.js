const mongoose=require('mongoose');

//voy a guardar mi DB en una constante para poder cambiar la direccion 
const URI='mongodb://localhost:27017/showcukt';

mongoose.connect(URI,{ useNewUrlParser: true })
    .then(() => console.log(' DB is connected'))
    .catch(err=>console.log(err));
//conexion a la base de datos
mongoose.Promise = global.Promise;
module.exports=mongoose;