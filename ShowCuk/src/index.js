const express = require('express');
const path = require('path');
//morgan me permite ver cualquier peticion que le hacen a mi servidor 
const morgan = require('morgan');

const { mongoose } = require('./database');

const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));

app.use(express.json());
//Routes
app.use('/api/task', require('./routes/task.routes'));
//static Files
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(app.get('port'), () => {
    console.log(` Local port:   http://localhost:${app.get('port')}/`);
});