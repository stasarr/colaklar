// routes/pagesRoutes.js
const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const Category = require('../models/Category');



router.get('/', async (req, res) => {
    let allCategory = await Category.find({});
    res.render('index', {allCategory: allCategory});
});

router.get('/error', async (req, res) => {
    res.render('pages/error');
});

module.exports = router;