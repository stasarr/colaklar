// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


router.post('/signin', authController.getIpInfoMiddleware, authController.signin);

router.get('/signin', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    res.render('auth/signin');
});

router.get('/signout', authController.signout);

router.post('/signup', authController.getIpInfoMiddleware, authController.signup);

// router.get('/signup', (req, res) => {
//     res.render('auth/signup');
// });

module.exports = router;
