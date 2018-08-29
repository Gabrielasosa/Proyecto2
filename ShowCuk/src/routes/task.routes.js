// define las operaciones a traves de las url que le paso al servidor
const express = require('express');
const router = express.Router();

const User = require('../models/task');

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