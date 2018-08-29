// define las operaciones a traves de las url que le paso al servidor
const express = require('express');
const router = express.Router();

const User = require('../models/user');

//mostrar los usuarios
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

//mostrar un usuario
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});
//guardar usuarios en la DB
router.post('/', async (req, res) => {

    const { name, surname, nick, email, role, image, password } = req.body;
    const user = new User({
        name,
        surname,
        nick,
        email,
        password,
        role,
        image,
    });
    await user.save();
    res.json({ status: 'User save' });
});

//actualizar algun dato del usuario en la DB
router.put('/:id', async (req, res) => {

    const { name, surname, nick, image } = req.body;
    const newUser = {
        name,
        surname,
        nick,
        image
    };
    await User.findByIdAndUpdate(req.params.id, newUser);
    res.json({ status: 'User update' });
});

//eliminar usuario
router.delete('/:id', async (req, res) => {
    await User.findByIdAndRemove(reeq.params.id);
    res.json({ status: 'User deleted' });

})

module.exports = router;

// 'use strict'

// const express = require('express');

// const UserController = require('../controllers/user_controllers');

// const api = express.Router();

// const md_aut=require('../middlewares/autenticacion');

// const multipart=require('connect-multiparty');

// const md_upload=multipart({uploadDir:'./uploads/users'})
// const User = require('../models/user');

// //comenzamos a definir las rutas

// /*
// *registramos los usuarios en la base de datos
// */
// api.post('/register', UserController.saveUser);

// /*
// *
// */
// api.post('/login', UserController.loginUser);

// /*
// *comprobamos q el usuario existe mediante el middleware
// */
// api.get('/user/:id', UserController.getUser);
// /*
// *lista de los usuarios por pagina
// */
// api.get('/users/:page?', UserController.getUsers);

// //api.get('/users/:page?', md_aut.ensureAuth,UserController.getUsers);


// /*
// *Ruta para actulizar los del usuario
// */
// api.put('/update-user/:id',UserController.updateUser);
// /*
// *subir un avatar
// */
// api.post('/upload-image-user/:id', [md_upload],UserController.uploadImage);

// /*
// *mostrar la imagen del usuario
// */
// api.get('/get-image-user/:imageFile',UserController.getImage);
// module.exports=api;