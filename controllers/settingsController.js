// controllers/SettingsController.js
const User = require('../models/User');
const Settings = require('../models/Settings');

async function partnerAdd(req, res, next) {
    const { partnerLogo } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!partnerLogo) {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }


        await Settings.updateOne(
            {},
            { $push: { partners: { partnerLogo } } }
        );

        req.session.successMessage = 'Partner başarıyla eklendi';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Partner oluşturulurken bir hata meydana geldi';
        return res.redirect('/admin/settings');
    }
}

async function partnerDelete(req, res, next) {
    const { index } = req.body;
    let partnerId = index;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!partnerId) {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        await Settings.updateOne(
            {},
            { $pull: { partners: { _id: partnerId } } }
        );

        req.session.successMessage = 'Partner başarıyla silindi';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Partner silinirken bir hata oluştu';
        return res.redirect('/admin/settings');
    }
}

async function favicon(req, res, next) {
    const { imageUrl } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!imageUrl) {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.siteFavicon = imageUrl;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        req.session.successMessage = 'Favicon ayarlandı';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Favicon ayarlanırken bir hata meydana geldi';
        return res.redirect('/admin/settings');
    }
}

async function sitelogo(req, res, next) {
    const { imageUrl } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!imageUrl) {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.siteLogo = imageUrl;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        req.session.successMessage = 'Site logosu ayarlandı';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Site logosu ayarlanırken bir hata meydana geldi';
        return res.redirect('/admin/settings');
    }
}

async function sitesettings(req, res, next) {
    const { siteName, siteDesc, siteKeywords } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.siteName = siteName;
            settings.siteDesc = siteDesc;
            settings.siteKeywords = siteKeywords;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        req.session.successMessage = 'Site ayarları kaydedildi!';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Site ayarları kaydedilirken bir hata meydana geldi';
        return res.redirect('/admin/settings');
    }
}

async function sociallinks(req, res, next) {
    const { facebook, tiktok, twitter, linkedin, youtube, instagram } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        const settings = await Settings.findOne();

        if (settings) {
            if (!settings.socialLinks) {
                settings.socialLinks = {};
            }
            settings.socialLinks.facebook = facebook;
            settings.socialLinks.tiktok = tiktok;
            settings.socialLinks.twitter = twitter;
            settings.socialLinks.linkedin = linkedin;
            settings.socialLinks.youtube = youtube;
            settings.socialLinks.instagram = instagram;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings/socialmedia');
        }

        req.session.successMessage = 'Sosyal bağlantılar kaydedildi!';
        return res.redirect('/admin/settings/socialmedia');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Sosyal bağlantılar kaydedilirken bir hata meydana geldi';
        return res.redirect('/admin/settings/socialmedia');
    }
}

async function banner(req, res, next) {
    const { bannerTitle, bannerDesc, bannerImage } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.bannerTitle = bannerTitle;
            settings.bannerDesc = bannerDesc;
            settings.bannerImage = bannerImage;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings/homepage');
        }

        req.session.successMessage = 'Afiş ayarları kaydedildi!';
        return res.redirect('/admin/settings/homepage');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Afiş ayarları kaydedilirken bir hata meydana geldi';
        return res.redirect('/admin/settings/homepage');
    }
}

async function footerMenuAdd(req, res, next) {
    const { menuName, menuLink } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!menuName) {
            req.session.errorMessage = 'Menu ismi boş bırakılamaz!';
            return res.redirect('/admin/settings');
        }
        if (!menuLink) {
            req.session.errorMessage = 'Menu bağlantısı boş bırakılamaz!';
            return res.redirect('/admin/settings');
        }


        await Settings.updateOne(
            {},
            { $push: { footerMenu: { menuName, menuLink } } }
        );

        req.session.successMessage = 'Menü başarıyla eklendi';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Menü oluşturulurken bir hata meydana geldi';
        return res.redirect('/admin/settings');
    }
}

async function footerMenuDelete(req, res, next) {
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
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        await Settings.updateOne(
            {},
            { $pull: { footerMenu: { _id: _id } } }
        );

        req.session.successMessage = 'Footer menü bağlantısı başarıyla kaldırıldı';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Footer menü bağlantısı kaldırılırken bir hata oluştu';
        return res.redirect('/admin/settings');
    }
}

async function bannerButtonAdd(req, res, next) {
    let { buttonName, buttonLink, buttonTheme } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!buttonName) {
            req.session.errorMessage = 'Buton adı belirtmediniz!';
            return res.redirect('/admin/settings/homepage');
        }
        if (!buttonLink) {
            req.session.errorMessage = 'Buton linki belirtmediniz!';
            return res.redirect('/admin/settings/homepage');
        }
        if (!buttonTheme) {
            buttonTheme = true;
        }


        await Settings.updateOne(
            {},
            { $push: { bannerButton: { buttonName, buttonLink, buttonTheme } } }
        );

        req.session.successMessage = 'Buton başarıyla eklendi';
        return res.redirect('/admin/settings/homepage');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Buton oluşturulurken bir hata meydana geldi';
        return res.redirect('/admin/settings/homepage');
    }
}

async function bannerButtonDelete(req, res, next) {
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
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        await Settings.updateOne(
            {},
            { $pull: { bannerButton: { _id: _id } } }
        );

        req.session.successMessage = 'Buton başarıyla kaldırıldı';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Buton kaldırılırken bir hata oluştu';
        return res.redirect('/admin/settings');
    }
}

async function serviceEdit(req, res, next) {
    const { _id, serviceAreaTitle, serviceAreaContent, serviceAreaIcon } = req.body;

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
            req.session.errorMessage = 'İçerik kimliği belirlenmemiş!';
            return res.redirect('/admin/settings/homepage');
        }
        if (!serviceAreaTitle) {
            req.session.errorMessage = 'İçerik başlığı boş bırakılamaz!';
            return res.redirect('/admin/settings/homepage');
        }
        if (!serviceAreaContent) {
            req.session.errorMessage = 'İçerik metni boş bırakılamaz!';
            return res.redirect('/admin/settings/homepage');
        }
        if (!serviceAreaIcon) {
            req.session.errorMessage = 'İçerik ikonu boş bırakılamaz!';
            return res.redirect('/admin/settings/homepage');
        }


        const updatedService = await Settings.updateOne(
            { "serviceArea._id": _id }, // _id ile eşleşen öğeyi bul
            {
                $set: {
                    "serviceArea.$.serviceAreaTitle": serviceAreaTitle,
                    "serviceArea.$.serviceAreaContent": serviceAreaContent,
                    "serviceArea.$.serviceAreaIcon": serviceAreaIcon
                }
            }
        );

        if (updatedService.modifiedCount === 0) {
            req.session.errorMessage = 'Güncellenecek içerik bulunamadı!';
            return res.redirect('/admin/settings/homepage');
        }

        req.session.successMessage = 'İçerik güncellendi!';
        return res.redirect('/admin/settings/homepage');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'İçerik güncellenirken bir hata meydana geldi';
        return res.redirect('/admin/settings/homepage');
    }
}

async function generalabout(req, res, next) {
    const { generalInfoTitle, generalInfoContent } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!generalInfoTitle) {
            req.session.errorMessage = 'Hakkında kutusu başlıksız bırakılamaz!';
            return res.redirect('/admin/settings/homepage');
        }
        if (!generalInfoContent) {
            req.session.errorMessage = 'Hakkında metni boş bırakılamaz!';
            return res.redirect('/admin/settings/homepage');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.generalInfoTitle = generalInfoTitle;
            settings.generalInfoContent = generalInfoContent;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings/homepage');
        }

        req.session.successMessage = 'Hakkında kutusu başarıyla ayarlandı';
        return res.redirect('/admin/settings/homepage');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Hakkında kutusu ayarlanırken bir hata meydana geldi';
        return res.redirect('/admin/settings/homepage');
    }
}

async function footerEdit(req, res, next) {
    const { footerCopyright, footerDesc } = req.body;

    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        if (!footerCopyright) {
            req.session.errorMessage = 'Atıf boş bırakılamaz!';
            return res.redirect('/admin/settings');
        }
        if (!footerDesc) {
            req.session.errorMessage = 'Footer açıklaması boş bırakılamaz!';
            return res.redirect('/admin/settings');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.footerCopyright = footerCopyright;
            settings.footerDesc = footerDesc;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }

        req.session.successMessage = 'Footer başarıyla ayarlandı';
        return res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Footer ayarlanırken bir hata meydana geldi';
        return res.redirect('/admin/settings');
    }
}

async function visibility(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;
    const updateData = {};

    // Gelen veriler içinde sadece dolu olanları al
    ["bannerButtonVisibility", "generalInfoVisibility", "partnersVisibility", "serviceAreaVisibility"].forEach(key => {
        if (req.body[key] !== undefined) {
            updateData[key] = req.body[key]; // Sadece gelen veriyi ekle
        }
    });

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        const settings = await Settings.findOne();

        if (settings) {
            Object.assign(settings, updateData);
            return await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings');
        }
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Görünürlük ayarları güncellenirken bir hata meydana geldi!';
        return res.redirect('/admin/settings');
    }
}

async function featuredCategory(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user._id;

    let { firstFeaturedCategory, secondFeaturedCategory } = req.body;

    firstFeaturedCategory = firstFeaturedCategory || null;
    secondFeaturedCategory = secondFeaturedCategory || null;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.redirect('/signin');
        }

        const settings = await Settings.findOne();

        if (settings) {
            settings.firstFeaturedCategory = firstFeaturedCategory;
            settings.secondFeaturedCategory = secondFeaturedCategory;
            await settings.save();
        } else {
            req.session.errorMessage = 'Lütfen tekrar deneyin!';
            return res.redirect('/admin/settings/homepage');
        }

        req.session.successMessage = 'Öne çıkan kategoriler başarıyla ayarlandı';
        return res.redirect('/admin/settings/homepage');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Öne çıkan kategoriler ayarlanırken bir hata meydana geldi';
        return res.redirect('/admin/settings/homepage');
    }

}


module.exports = { partnerAdd, partnerDelete, favicon, sitelogo, sitesettings, sociallinks, banner, footerMenuAdd, footerMenuDelete, bannerButtonAdd, bannerButtonDelete, serviceEdit, generalabout, footerEdit, visibility, featuredCategory };