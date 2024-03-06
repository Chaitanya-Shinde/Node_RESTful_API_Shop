const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');



mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PASSWORD +'@atlascluster.kllo34a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow_Origin", "*");
    res.header("Access-Control-Allow_Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.header === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET')
        res.status(200).json({

        })
    }
    next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use((req,res,next)=>{
    const error = new Error('not found!');
    error.status= 404; 
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message,
        }
    });
})

module.exports = app;