// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const CustomPage = require('../models/CustomPage');

const customPageController = require('../controllers/customPageController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const settingsController = require('../controllers/settingsController');
const authController = require('../controllers/authController');

const fetchAllData = async (req, res, next) => {
    try {
        if (req.session.user) {
            const foundAllUser = await User.find();
            const foundAllProduct = await Product.find();
            const foundAllCategory = await Category.find();
            const foundAllCustomPage = await CustomPage.find();
            const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

            res.locals.IMGBB_API_KEY = IMGBB_API_KEY;
            res.locals.foundAllProduct = foundAllProduct;
            res.locals.foundAllUser = foundAllUser;
            res.locals.foundAllCategory = foundAllCategory;
            res.locals.foundAllCustomPage = foundAllCustomPage;
        }
        next();
    } catch (error) {
        console.error('Error fetching adminRoutes:', error);
        next();
    }
};
router.use(fetchAllData);


// Get işlemleri #######################

router.get('/', authController.requireLogin, authController.requireModerator, (req, res) => {
    res.render('admin/pages/dashboard');
});

router.get('/settings', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/manage/settings/settings');
});

router.get('/settings/homepage', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/manage/settings/homepage');
});

router.get('/settings/brands', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/manage/settings/brands');
});

router.get('/settings/socialmedia', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/manage/settings/socialmedia');
});

router.get('/users', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/manage/users');
});

router.get('/change-password', authController.requireLogin, authController.requireModerator, (req, res) => {
    res.render('admin/manage/changePassword');
});

router.get('/product-list', authController.requireLogin, authController.requireModerator, (req, res) => {
    res.render('admin/product/productList');
});

router.get('/product-add', authController.requireLogin, authController.requireModerator, (req, res) => {
    res.render('admin/product/productAdd');
});

router.get('/product-edit/:_id', authController.requireLogin, authController.requireModerator, async (req, res) => {
    Product.findOne({ _id: req.params._id })
        .then(async (foundProduct) => {
            res.render('admin/product/productEdit', { foundProduct: foundProduct });
        })
        .catch((err) => {
            console.log('--------ERROR-SINGLE-PRODUCT-PAGE-------')
            console.log(err);
            res.redirect("/error");
        })
})

router.get('/categories', authController.requireLogin, authController.requireModerator, async (req, res) => {
    let allCategory = await Category.find({});
    res.render('admin/categories/categories', { allCategory: allCategory });
});

router.get('/custompage-list', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/pages/customPageList');
});

router.get('/custompage-add', authController.requireLogin, authController.requireAdmin, (req, res) => {
    res.render('admin/pages/customPageAdd');
});

router.get('/custompage-edit/:_id', authController.requireLogin, authController.requireAdmin, async (req, res) => {
    CustomPage.findOne({ _id: req.params._id })
        .then(async (foundPage) => {
            res.render('admin/pages/customPageEdit', { foundPage: foundPage });
        })
        .catch((err) => {
            console.log('--------ERROR-SINGLE-CUSTOMPAGE-PAGE-------')
            console.log(err);
            res.redirect("/error");
        })
})


// Post işlemleri #########################

router.post('/product/add', authController.requireLogin, productController.productAdd);
router.post('/product/edit', authController.requireLogin, productController.productEdit);
router.post('/product/delete', authController.requireLogin, productController.productDelete);

router.post('/categories/add', authController.requireLogin, categoryController.categoryAdd);
router.post('/categories/delete', authController.requireLogin, categoryController.categoryDelete);

router.post('/custompage/add', authController.requireLogin, authController.requireAdmin, customPageController.customPageAdd);
router.post('/custompage/edit', authController.requireLogin, authController.requireAdmin, customPageController.customPageEdit);
router.post('/custompage/delete', authController.requireLogin, authController.requireAdmin, customPageController.customPageDelete);

router.post('/settings/partner/add', authController.requireLogin, authController.requireAdmin, settingsController.partnerAdd);
router.post('/settings/partner/delete', authController.requireLogin, authController.requireAdmin, settingsController.partnerDelete);
router.post('/settings/favicon', authController.requireLogin, authController.requireAdmin, settingsController.favicon);
router.post('/settings/sitelogo', authController.requireLogin, authController.requireAdmin, settingsController.sitelogo);
router.post('/settings/sitesettings', authController.requireLogin, authController.requireAdmin, settingsController.sitesettings);
router.post('/settings/sociallinks', authController.requireLogin, authController.requireAdmin, settingsController.sociallinks);
router.post('/settings/banner', authController.requireLogin, authController.requireAdmin, settingsController.banner);
router.post('/settings/service/edit', authController.requireLogin, authController.requireAdmin, settingsController.serviceEdit);
router.post('/settings/footermenu/add', authController.requireLogin, authController.requireAdmin, settingsController.footerMenuAdd);
router.post('/settings/footermenu/delete', authController.requireLogin, authController.requireAdmin, settingsController.footerMenuDelete);
router.post('/settings/bannerbutton/add', authController.requireLogin, authController.requireAdmin, settingsController.bannerButtonAdd);
router.post('/settings/bannerbutton/delete', authController.requireLogin, authController.requireAdmin, settingsController.bannerButtonDelete);
router.post('/settings/generalabout', authController.requireLogin, authController.requireAdmin, settingsController.generalabout);
router.post('/settings/footeredit', authController.requireLogin, authController.requireAdmin, settingsController.footerEdit);
router.post('/settings/visibility', authController.requireLogin, authController.requireAdmin, settingsController.visibility);
router.post('/settings/featuredcategory', authController.requireLogin, authController.requireAdmin, settingsController.featuredCategory);

router.post('/users/add', authController.requireLogin, authController.requireAdmin, authController.userAdd);
router.post('/users/delete', authController.requireLogin, authController.requireAdmin, authController.userDelete);

router.post('/changepassword', authController.requireLogin, authController.requireAdmin, authController.changePassword);


module.exports = router;