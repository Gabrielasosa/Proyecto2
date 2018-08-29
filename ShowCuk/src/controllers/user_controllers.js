'use strict'

//letiable para cifrar la contraseña
let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
let jwt = require('../services/jwt')
let mongoosePaginate = require('mongoose-pagination');

let fs = require('fs');

let path = require('path');


//metodo de prueba
function home(req, res) {
    res.status(200).send({
        message: 'Hola que hace'
    })
}

//metodo de prueba
function pruebas(req, res) {
    console.log(req.body)
    res.status(200).send({
        message: 'accion de pruebas'
    })
}

//funcion para guardar los usuarios
function saveUser(req, res) {
    let params = req.body;
    let user = new User();

    if (params.name && params.surname && params.nick
        && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'Usuario';
        user.image = null;

        //con los siguientes parametros controlamos los usuarios, para no tenerlos duplicados
        User.find({
            $or: [//con esto decimos que si el email o nick existen en la BD
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error al recirbir los usuarios' });
            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario ya se encuentra registrado' })

            } else {
                //encriptacion de la contraseña y guarda los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({ message: 'No se ha ppodido guardar el usuario' })
                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'No se ha podido registrado el usuario' })
                        }
                    })
                });
            }

        })

    } else {
        res.status(200).send({
            message: 'Escribe todos los datos necesarios'
        });
    }
}


//loguin de los usuarios
function loginUser(req, res) {
    let params = req.body;
    let email = params.email;
    let password = params.password;

    //comprobacion de la existencia del usuario en la BD

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'fallo la peticion' });
        if (user) {
            //comparo la contraseña que mete el usuario y la que esta en la BD
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    //si las contraña son correctas devolves los datos del usuario
                    if (params.gettoken) {
                        //si es tru,generamos y delvolvemos un token 
                        return res.status(200).send({

                            token: jwt.createToken(user)
                        });

                    } else {
                        //devolvemos los datos del uruario 
                        user.password = undefined;//"ocultamos la contraseña" si utilizo la misma sentencia con troas propiedades tambien las ocultaria

                        return res.status(200).send({ user });
                    }

                } else {
                    return res.status(404).send({ message: 'fallo al identificar el usuario' });
                }
            });
        } else {
            return res.status(404).send({ message: 'fallo al identificar el usuario' });

        }
    })
}

//listar datos del usuario
function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!user) return res.status(400).send({ message: 'El usuario no existe' });
        return res.status(200).send({ user });
    })
}

//devolver listado de todos los usuarios de manera paginada

function getUsers(req, res) {
    let identificacion_user_id = req.user.sub;

    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }
    let itemsPerPage = 5;//veremos 5 usuarios por pagina
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!users) return res.status(404).send({ message: 'No hay usuarios' });
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        })
    })
}

//funcion para editar los datos de los usuarios
function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;
    //boramos la propidad password luego creare otro metodo para cambiar esta propiedad******
    delete update.password;
    //comprobamos que el user id es diferente en el caso de ser asi no podra modificarlo

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'no tienes permiso para actulizar los datos ' })
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!userUpdate) return res.status(404).send({ message: 'No se ha podido actulizar los datos del usuario' });

        return res.status(200).send({ user: userUpdate });
    });

}

//subir avatar de un usuario

function uploadImage(req, res) {
    let userId = req.params.id;


    if (req.files) {
        let file_path = req.files.image.path;

        let file_split = file_path.split('\\');//separamos el nombre del archivo

        let file_name = file_split[2];//para que nos vevuelca solo el nombre del archivo

        let ext_split = file_name.split('\.');//sacamos la extension del archivo

        let file_ext = ext_split[1];//guardo la extension del fichero

        if (userId != req.user.sub) {
            return removeImage(res, file_path, 'No tienes permiso para actulizar los datos');

            //return res.status(500).send({ message: 'No tienes permiso para actulizar los datos' })
        }

        //compracion de las extensiones

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //despues de la comprobacion actualizamos los datos en la BD del user logueado
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdate) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!userUpdate) return res.status(404).send({ message: 'No se ha podido actulizar los datos del usuario' });

                return res.status(200).send({ user: userUpdate });
            })
        } else {
            return removeImage(res, file_path, 'la extension no es valida');

            // fs.unlink(file_path, (err) => {
            //    if(err) return res.status(200).send({ message: 'la extension no es valida' })
            // });
        }

    } else {
        return res.status(200).send({ message: 'No hay imagenes subidas' });
    }

}

//funcion para eliminar un arachivo no valido y mostrar el mensaje correspondiente por pantalla
function removeImage(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(200).send({ message: message })
    });
}

//devolver imagen del usuario
function getImage(req, res) {
    let image_file = req.params.imageFile;

    let path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    })
}

//exportando los modulos
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImage


};