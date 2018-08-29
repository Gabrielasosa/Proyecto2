// define las operaciones a traves de las url que le paso al servidor
const express = require('express');
const router = express.Router();

const Menu = require('../models/menu');

//mostrar los menus
router.get('/', async (req, res) => {
    const menus = await Menu.find();
    res.json(menus);
});

//mostrar un menu
router.get('/:id', async (req, res) => {
    const menu = await Menu.findById(req.params.id);
    res.json(menu);
});
//guardar menu en la DB
router.post('/', async (req, res) => {

    const { name, price,image,description} = req.body;
    const menu = new Menu({
        name,
       price,
       image,
       description
    });
    await menu.save();
    res.json({ status: 'Menu save' });
});

//actualizar algun dato del menu en la DB
router.put('/:id', async (req, res) => {

    const { name,  price, image,description  } = req.body;
    const newMenu = {
        name,
        price,
        image,
        description
    };
    await Menu.findByIdAndUpdate(req.params.id, newMenu);
    res.json({ status: 'Menu update' });
});

//eliminar un menu
router.delete('/:id', async (req, res) => {
    await Menu.findByIdAndRemove(req.params.id);
    res.json({ status: 'Menu deleted' });

})

module.exports = router;