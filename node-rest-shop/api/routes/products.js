const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const mongoose = require('mongoose');

router.get('/', (req,res,next)=>{
    Product.find()
    .exec()
    .then(docs=>{console.log(docs);
        res.status(200).json(docs)
    })
    .catch(
        err=>{
            console.log(err);
            res.status(500).json(err)({
                error: err
            })
        }
    );
    
});

router.post('/', (req,res,next)=>{
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price,
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save().then(result=>{
        console.log(result);
    }).catch(err=>console.log(err));
    
    res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: product,
    });
});

router.get('/:productId',(req,res,next)=>{
    const productId = req.params.productId;
    // if(productId === 'special'){
    //     res.status(200).json({
    //         message: "you've discovered the special id!",
    //         id: productId,
    //     })
    // }else{
    //     res.status(200).json({
    //         message: "you've passed an ID",
    //         id: productId,
    //     })
    // }
    Product.findById(productId).exec().then(doc=>{
        console.log("From databse ", doc);
        if(doc){
            res.status(200).json({doc});
        }else{
            res.status(404).json({
                message: 'no valid entry found for the give product id'
            });
        }
        
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

})

router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
      }
    Product.updateOne({_id:id},{$set: updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(
        err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
    );

    // res.status(200).json({
    //     message: "Updated Product"
    // })
});

router.delete('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(
        result=>{
            console.log(result);
            res.status(200).json({
                result
            })
        }
    ).catch(
        err=>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        }
    );

    res.status(200).json({
        message: "Deleted Product"
    })
});

module.exports = router;