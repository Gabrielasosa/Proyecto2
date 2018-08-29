// define las operaciones a traves de las url que le paso al servidor
const express=require('express');
const router=express.Router();

const User=require('../models/task');
router.get('/',(req,res)=>{
    User.find(function(err,user){
        res.json({
            status: 'API Works!'
        });
    });
});

module.exports =router;