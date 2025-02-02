// controllers/categoryController.js
const User = require('../models/User');
const Category = require('../models/Category');

async function categoryAdd(req, res, next) {
    const { name, icon } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!name) {
            req.session.errorMessage = 'Kategori adı girmeniz zorunludur';
            return res.redirect('/admin/categories');
        }

        const checkCategoryName = await Category.findOne({ name: name });

        if (checkCategoryName) {
            req.session.errorMessage = 'Bu kategori zaten mevcut';
            return res.redirect('/admin/categories');
        }

        const newCategory = new Category({ name, icon });
        await newCategory.save();

        req.session.successMessage = 'Kategori başarıyla oluşturuldu';
        return res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
        res.locals.errorMessage = 'Kategori oluşturulurken bir hata meydana geldi';
        return res.render('admin/categories/categories');
    }
}

async function categoryDelete(req, res, next) {
    const { _id } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!_id) {
            res.locals.errorMessage = 'Kategori bulunamadı!';
            return res.render('admin/categories/categories');
        }


        await Category.deleteOne({ _id });
        req.session.successMessage = 'Kategori başarıyla silindi';
        return res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
        res.locals.errorMessage = 'Kategori silinirken bir hata oluştu';
        return res.render('admin/categories/categories');
    }
}

module.exports = { categoryAdd, categoryDelete };