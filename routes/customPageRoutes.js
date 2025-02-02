// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const CustomPage = require('../models/CustomPage');


// Get işlemleri #######################

router.get('/:link', async (req, res) => {
    try {
        let foundPage = await CustomPage.findOne({ pageLink: req.params.link });
        if (!foundPage) {
            return res.redirect('/404');
        }
        foundPage.views = (foundPage.views || 0) + 1;
        await foundPage.save();
        res.render('pages/customPage', { 
            foundPage
        });

    } catch (err) {
        console.log('--------ERROR-SINGLE-CUSTOMPAGE-PAGE-------');
        console.log(err);
        res.redirect("/error");
    }
});



module.exports = router;