// controllers/customPageController.js
const User = require('../models/User');
const CustomPage = require('../models/CustomPage');

async function customPageAdd(req, res, next) {
    const { pageName, pageDescription, pageContent, receiptImage, pageLink, customPageMetaKeywords, customPageMetaDescription, menuVisibility } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!pageName) {
            req.session.errorMessage = 'Lütfen bir sayfa adı belirtin';
            return res.redirect('/admin/custompage-add');
        }
        if (!pageDescription) {
            req.session.errorMessage = 'Sayfa açıklaması belirtmediniz';
            return res.redirect('/admin/custompage-add');
        }
        if (!pageContent) {
            req.session.errorMessage = 'Sayfa içeriği boş bırakılamaz';
            return res.redirect('/admin/custompage-add');
        }
        if (!pageLink) {
            req.session.errorMessage = 'Sayfa linkini boş bırakamazsınız';
            return res.redirect('/admin/custompage-add');
        }


        const checkCustomPageLink = await CustomPage.findOne({ pageLink: pageLink });

        if (checkCustomPageLink) {
            req.session.errorMessage = 'Sayfa linki zaten başka bir sayfa tarafından kullanılıyor';
            return res.redirect('/admin/custompage-add');
        }


        let pageImage = receiptImage

        const newCustomPage = new CustomPage({ pageName, pageDescription, pageContent, pageImage, pageLink, customPageMetaKeywords, customPageMetaDescription, menuVisibility });
        await newCustomPage.save();

        req.session.successMessage = 'Sayfa oluşturuldu';
        return res.redirect('/admin/custompage-list');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Yeni sayfa eklenirken bir hata oluştu.';
        return res.redirect('/admin/custompage-list');
    }
}

async function customPageEdit(req, res, next) {
    let { _id, pageName, pageDescription, pageContent, receiptImage, receiptImage2, pageLink, customPageMetaKeywords, customPageMetaDescription, menuVisibility } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });
        const custompage = await CustomPage.findOne({ _id: _id });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!custompage) {
            req.session.errorMessage = 'Düzenlemek istediğiniz sayfa bulunamadı';
            return res.redirect('/admin/custompage-list');
        }
        if (!pageName) {
            req.session.errorMessage = 'Lütfen bir sayfa adı belirtin';
            return res.redirect(`/admin/custompage-edit/${_id}`);
        }
        if (!pageDescription) {
            req.session.errorMessage = 'Sayfa açıklaması belirtmediniz';
            return res.redirect(`/admin/custompage-edit/${_id}`);
        }
        if (!pageContent) {
            req.session.errorMessage = 'Sayfa içeriği boş bırakılamaz';
            return res.redirect(`/admin/custompage-edit/${_id}`);
        }
        if (!pageLink) {
            req.session.errorMessage = 'Sayfa linkini boş bırakamazsınız';
            return res.redirect(`/admin/custompage-edit/${_id}`);
        }


        const checkCustomPageLink = await CustomPage.findOne({ pageLink: pageLink });

        if (checkCustomPageLink) {
            if (checkCustomPageLink._id != _id) {
                req.session.errorMessage = 'Bu sayfa bağlantısı başka bir sayfa tarafından kullanılıyor';
                return res.redirect(`/admin/custompage-edit/${_id}`);
            }
        }


        if (!receiptImage) {
            receiptImage = receiptImage2;
        };

        const pageImage = receiptImage

        // Burada gelen yeni verilerle projeyi güncelliyoruz
        custompage.pageName = pageName;
        custompage.pageDescription = pageDescription;
        custompage.pageContent = pageContent;
        custompage.pageImage = pageImage;
        custompage.pageLink = pageLink;
        custompage.customPageMetaKeywords = customPageMetaKeywords;
        custompage.customPageMetaDescription = customPageMetaDescription;
        custompage.menuVisibility = menuVisibility;

        // Güncellenen projeyi kaydediyoruz
        await custompage.save();

        req.session.successMessage = 'Sayfa başarıyla güncellendi!';
        return res.redirect('/admin/custompage-list');
    } catch (error) {
        console.log(error);
        res.locals.errorMessage = 'Sayfa güncellenirken bir hata oluştu.';
        return res.render('admin/pages/customPageList');
    }
}

async function customPageDelete(req, res, next) {
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
            res.locals.errorMessage = 'Sayfa bulunamadı!';
            return res.render('admin/pages/customPageList');
        }


        await CustomPage.deleteOne({ _id });
        req.session.successMessage = 'Sayfa başarıyla kaldırıldı';
        return res.redirect('/admin/custompage-list');
    } catch (error) {
        console.log(error);
        res.locals.errorMessage = 'Sayfa silinirken bir hata oluştu.';
        return res.render('admin/pages/customPageList');
    }
}

module.exports = { customPageAdd, customPageEdit, customPageDelete };