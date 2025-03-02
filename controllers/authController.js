// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ip = require('express-ip');
const { RecaptchaV2 } = require('express-recaptcha');
const recaptcha = new RecaptchaV2(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

const getIpInfoMiddleware = ip().getIpInfoMiddleware;

// Recaptcha doğrulama fonksiyonu
async function verifyRecaptcha(req) {
    return new Promise((resolve, reject) => {
        recaptcha.verify(req, (error, data) => {
            if (error) {
                reject(new Error('CAPTCHA doğrulaması başarısız'));
            } else {
                resolve(data);
            }
        });
    });
}

async function signin(req, res, next) {
    const { email, password } = req.body;
    const userIP = req.ipInfo.ip;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.locals.errorMessage = 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.';
            return res.render('auth/signin');
        }

        if (!user.ip) {
            user.ip = userIP
            user.save();
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            if (user.banned == true) {
                return res.render('pages/banned');
            }
            req.session.user = user;
            res.redirect('/admin')
        } else {
            res.locals.errorMessage = 'Email ya da şifre hatalı';
            return res.render('auth/signin');
        }
    } catch (error) {
        res.locals.errorMessage = 'Giriş sırasında bir hata oluştu';
        return res.render('auth/signin');
    }
};


async function signup(req, res, next) {
    const { firstname, lastname, password, email, confirmpassword } = req.body;
    const userIP = req.ipInfo.ip;

    try {
        await verifyRecaptcha(req);

        const existingEmail = await User.findOne({ email });

        if (!password || !email || !firstname || !lastname) {
            res.locals.errorMessage = 'Lütfen tüm bilgileri eksiksiz olarak doldurun';
            return res.render('auth/signup');
        }

        if (password.includes(' ') || email.includes(' ')) {
            res.locals.errorMessage = 'E-posta ve şifre boşluk içermemelidir';
            return res.render('auth/signup');
        }

        if (firstname.length < 2 || firstname.length > 21) {
            res.locals.errorMessage = 'Ad 2-21 karakter arasında olmalıdır';
            return res.render('auth/signup');
        }

        if (lastname.length < 2 || lastname.length > 21) {
            res.locals.errorMessage = 'Soyad 2-21 karakter arasında olmalıdır';
            return res.render('auth/signup');
        }

        if (password !== confirmpassword) {
            req.locals.errorMessage = 'Girdiğiniz şifreler birbiriyle uyuşmuyor';
            return res.render('auth/signup');
        }

        if (existingEmail) {
            res.locals.errorMessage = 'Bu email zaten kullanılıyor';
            return res.render('auth/signup');
        }

        if (!password || password.length < 7) {
            res.locals.errorMessage = 'Lütfen 7 karakterden daha uzun bir parola girin';
            return res.render('auth/signup');
        }

        if (password.length > 25) {
            res.locals.errorMessage = 'Lütfen 25 karakterden daha kısa bir parola girin';
            return res.render('auth/signup');
        }

        const usedIP = await User.findOne({ ip: userIP });

        if (usedIP && usedIP.banned) {
            res.locals.errorMessage = 'Daha önce banlanmış bir hesabınız bulunmaktadır.';
            return res.render('auth/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstname, lastname, password: hashedPassword, email, ip: userIP, avatar: "/assets/images/icons/boy-avater.png" });
        await newUser.save();

        req.session.user = newUser;

        return res.redirect('/')
    } catch (error) {
        if (error.message === 'CAPTCHA doğrulaması başarısız') {
            res.locals.errorMessage = 'Captcha doğrulaması başarısız oldu. Lütfen tekrar deneyin.';
        } else {
            console.log(error)
            res.locals.errorMessage = 'Kayıt sırasında bir hata oluştu';
        }
        res.render('auth/signup');
    }
}


async function signout(req, res, next) {
    try {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    } catch (error) {
        next(error);
    }
}

function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/signin');
    }
}

function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role == "admin") {
        return next();
    } else {
        return res.redirect('/');
    }
}

function requireModerator(req, res, next) {
    if ((req.session && req.session.user) && (req.session.user.role == "moderator" || req.session.user.role == "admin")) {
        return next();
    } else {
        return res.redirect('/');
    }
}

function restrict(req, res, next) {
    if (req.session && req.session.user && req.session.user.restrict == true) {
        return res.redirect('/dashboard/demo');
    } else {
        return next();
    }
}

async function banCheck(req, res, next) {
    if (req.session && req.session.user) {
        const user = await User.findOne({ _id: req.session.user.userID });
        if (user && user.banned == true) {
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }
                res.render('banned');
            });
        } else {
            return next();
        }
    }
}


async function userAdd(req, res, next) {
    const { firstname, lastname, password, email, confirmpassword, gender, role } = req.body;

    try {
        const existingEmail = await User.findOne({ email });

        if (!password || !email || !firstname || !lastname || !confirmpassword) {
            res.locals.errorMessage = 'Lütfen tüm bilgileri eksiksiz olarak doldurun';
            return res.render('admin/manage/users');
        }

        if (password.includes(' ') || email.includes(' ')) {
            res.locals.errorMessage = 'E-posta ve şifre boşluk içermemelidir';
            return res.render('admin/manage/users');
        }

        if (firstname.length < 2 || firstname.length > 21) {
            res.locals.errorMessage = 'Ad 2-21 karakter arasında olmalıdır';
            return res.render('admin/manage/users');
        }

        if (lastname.length < 2 || lastname.length > 21) {
            res.locals.errorMessage = 'Soyad 2-21 karakter arasında olmalıdır';
            return res.render('admin/manage/users');
        }

        if (password !== confirmpassword) {
            req.locals.errorMessage = 'Girdiğiniz şifreler birbiriyle uyuşmuyor';
            return res.render('admin/manage/users');
        }

        if (existingEmail) {
            res.locals.errorMessage = 'Bu email zaten kullanılıyor';
            return res.render('admin/manage/users');
        }

        if (!password || password.length < 7) {
            res.locals.errorMessage = 'Lütfen 7 karakterden daha uzun bir parola girin';
            return res.render('admin/manage/users');
        }

        if (password.length > 25) {
            res.locals.errorMessage = 'Lütfen 25 karakterden daha kısa bir parola girin';
            return res.render('admin/manage/users');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstname, lastname, password: hashedPassword, email, avatar: "/assets/images/icons/boy-avater.png", gender, role });
        await newUser.save();

        req.session.successMessage = 'Üye oluşturuldu!';
        return res.redirect('/admin/users')
    } catch (error) {
        if (error.message === 'CAPTCHA doğrulaması başarısız') {
            res.locals.errorMessage = 'Captcha doğrulaması başarısız oldu. Lütfen tekrar deneyin.';
        } else {
            console.log(error)
            res.locals.errorMessage = 'Kayıt sırasında bir hata oluştu';
        }
        res.render('admin/manage/users');
    }
}


async function userDelete(req, res, next) {
    const { _id } = req.body;

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            req.session.errorMessage = 'Kullanıcı bulunamadı';
            return res.redirect('/admin/users');
        }

        req.session.successMessage = 'Üye silindi!';
        return res.redirect('/admin/users')
    } catch (error) {
        console.log(error)
        res.locals.errorMessage = 'Kayıt sırasında bir hata oluştu';
        res.render('admin/manage/users');
    }
}


async function changePassword(req, res, next) {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user?._id; // Kullanıcının giriş yapmış olduğunu varsayıyoruz

    if (!userId) {
        return res.redirect('/signin');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            req.session.errorMessage = 'Kullanıcı bulunamadı.';
            return res.redirect('/admin/change-password');
        }

        // Eski şifreyi doğrula
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            req.session.errorMessage = 'Mevcut şifreniz yanlış.';
            return res.redirect('/admin/change-password');
        }

        // Yeni şifre kontrolü
        if (newPassword !== confirmPassword) {
            req.session.errorMessage = 'Yeni şifreler birbiriyle uyuşmuyor.';
            return res.redirect('/admin/change-password');
        }

        if (newPassword.length < 7 || newPassword.length > 25) {
            req.session.errorMessage = 'Şifre 7-25 karakter arasında olmalıdır.';
            return res.redirect('/admin/change-password');
        }

        if (newPassword.includes(' ')) {
            req.session.errorMessage = 'Şifre boşluk içermemelidir.';
            return res.redirect('/admin/change-password');
        }

        // Yeni şifreyi hashle ve kaydet
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        req.session.successMessage = 'Şifreniz başarıyla değiştirildi!';
        return res.redirect('/admin/change-password');
    } catch (error) {
        console.log(error);
        req.session.errorMessage = 'Şifre değiştirme sırasında bir hata oluştu.';
        return res.redirect('/admin/change-password');
    }
}

module.exports = { signin, requireLogin, requireAdmin, restrict, signup, signout, getIpInfoMiddleware, banCheck, userAdd, userDelete, requireModerator, changePassword };