// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const Category = require('../models/Category');


// Get işlemleri #######################

router.get('/urunler', async (req, res) => {
    let allProduct = await Product.find({});
    let allCategory = await Category.find({});
    res.render('product/products', {allProduct: allProduct, allCategory: allCategory});
});

router.get('/urunler/:link', async (req, res) => {
    try {
        let foundProduct = await Product.findOne({ productLink: req.params.link });
        if (!foundProduct) {
            return res.redirect('/404');
        }
        let productCategory = await Category.findById(foundProduct.category);
        res.render('product/productDetails', { 
            foundProduct, 
            productCategory 
        });

    } catch (err) {
        console.log('--------ERROR-SINGLE-PRODUCT-PAGE-------');
        console.log(err);
        res.redirect("/error");
    }
});



module.exports = router;