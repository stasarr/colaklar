const express = require('express');
const expressIp = require('express-ip');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;


// Rastgele bir UUID oluşturma
const secretKey = uuidv4();
app.set('trust proxy', true);

// Routes
const auth = require("./routes/authRoutes");
const admin = require("./routes/adminRoutes");
const product = require("./routes/productRoutes");
const customPage = require("./routes/customPageRoutes");
// const notification = require("./routes/notificationRoutes");
// const orderHistory = require("./routes/orderHistoryRoutes");
// const package = require("./routes/packageRoutes");
const pages = require("./routes/pagesRoutes");

// MongoDB Bağlantısı
mongoose.connect(process.env.mongodbURL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB ❌\n", err));

// App Config
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Oturum Yönetimi
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.mongodbURL,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: { maxAge: 10 * 60 * 60 * 1000 }
}));

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(expressIp().getIpInfoMiddleware);

// currentUser bilgisini tüm Routes'te paylaş
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});

app.use((req, res, next) => {
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    // Mesajları gösterdikten sonra session'dan silinir
    delete req.session.successMessage;
    delete req.session.errorMessage;
    next();
});




const Settings = require('./models/Settings');
const CustomPage = require('./models/CustomPage');
const Product = require('./models/Product');
const fetchMenuData = async (req, res, next) => {
    try {
        // Menü verilerini alıyoruz
        const foundMenuPage = await CustomPage.find({}, 'pageName pageLink menuVisibility');
        const settings = await Settings.findOne({});
        const allProduct = await Product.find({});
        res.locals.foundMenuPage = foundMenuPage;
        res.locals.settings = settings;
        res.locals.allProduct = allProduct;
        next();
    } catch (error) {
        console.error('Menu data fetch error:', error);
        next(); // Hata durumunda da devam etsin
    }
};
app.use(fetchMenuData);







// Routes Kullanım
app.use(auth);
app.use('/admin', admin);
app.use(product);
// app.use('/dashboard', dashboard);
// app.use(notification);
// app.use(orderHistory);
app.use(customPage);
app.use(pages);


// 404 Yönlendirmesi
// app.use((req, res, next) => {
//     res.status(404).render('404');
// });

// Ayraç
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     const referer = req.get('Referer');
//     if (referer) {
//         res.redirect(referer);
//     } else {
//         res.status(500).render('error');
//     }
// });





const initializeSettings = async () => {
    try {
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            const defaultSettings = new Settings({
                siteName: "Sta Web Creation",
                siteDesc: "Bu site Sta tarafından oluşturuldu",
                siteKeywords: "sta, web, sta web creation",
                siteFavicon: "https://staup.site/img/favicon.ico",
                siteLogo: "https://staup.site/img/logo.png",
                footerDesc: "Created with the collaboration of the world's best Sta Web Creation.",
                footerCopyright: "©2025 Sta, Inc. All rights reserved.",
                socialLinks: {
                    instagram: "https://instagram.com/samitasar",
                    youtube: "https://www.youtube.com/@stadevelopment"
                },
                bannerTitle: "Discover Digital Art, Collect and Sell Your Specific NFTs.",
                bannerDesc: "Partner with one of the world’s largest retailers to showcase your brand and products.",
                bannerImage: "https://staup.site/img/hero/hero.webp",
                bannerButton: [
                    { buttonName: "Get Started", buttonLink: "https://staup.site", buttonTheme: true },
                    { buttonName: "Create", buttonLink: "https://staup.site/about", buttonTheme: false }
                ],
                footerMenu: [
                    { menuName: "Home", menuLink: "/" },
                    { menuName: "About", menuLink: "/hakkimizda" },
                    { menuName: "FAQ", menuLink: "/sss" },
                    { menuName: "Products", menuLink: "/urunler" },
                    { menuName: "Contact", menuLink: "/iletisim" }
                ],
                partners: [
                    { partnerLogo: "/assets/images/brand/brand-01.png" },
                    { partnerLogo: "/assets/images/brand/brand-02.png" },
                    { partnerLogo: "/assets/images/brand/brand-03.png" },
                    { partnerLogo: "/assets/images/brand/brand-04.png" },
                    { partnerLogo: "/assets/images/brand/brand-05.png" },
                    { partnerLogo: "/assets/images/brand/brand-06.png" },
                    { partnerLogo: "/assets/images/brand/brand-07.png" }
                ],
                serviceArea: [
                    {
                        serviceAreaTitle: "309₺ Billion",
                        serviceAreaContent: "24h trading volume on Nuron marketplace. 250 Billion people visit Nuron per month.",
                        serviceAreaIcon: "/assets/images/icons/shape-10.png"
                    },
                    {
                        serviceAreaTitle: "600+",
                        serviceAreaContent: "Listed Cryptocurrencies who stay up to date for the latest news, read articles about currencies.",
                        serviceAreaIcon: "/assets/images/icons/shape-11.png"
                    },
                    {
                        serviceAreaTitle: "1.000 Million",
                        serviceAreaContent: "Registered users who trust Nuron & Invest for coin & get profite form there investment.",
                        serviceAreaIcon: "/assets/images/icons/shape-9.png"
                    },
                    {
                        serviceAreaTitle: "801 k",
                        serviceAreaContent: "Open market auction 24 hour.Nuron provide Live trading Option using cheap currency.",
                        serviceAreaIcon: "/assets/images/icons/shape-13.png"
                    }
                ],
                generalInfoTitle: "AN NURON THEME JUST FOR GAMERS",
                generalInfoContent: "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio sed non."
            });

            await defaultSettings.save();
            console.log("Varsayılan ayarlar başarıyla oluşturuldu.");
        }
    } catch (error) {
        console.error("Ayarları başlatırken hata oluştu:", error);
    }
};


const initializeContactPage = async () => {
    try {
        const existingPage = await CustomPage.findOne({ pageLink: "iletisim" });

        if (!existingPage) {
            const contactPage = new CustomPage({
                pageName: "İletişim",
                pageDescription: "İletişim bilgilerimize göz atın ve bizimle iletişime geçin.",
                pageContent: `<div class="rn-contact-top-area rn-section-gapTop bg_color--5">
                    <div class="container">
                        <div class="row g-5">
                            <div class="col-lg-12 sal-animate" data-sal="slide-up" data-sal-delay="150" data-sal-duration="800">
                                <div class="section-title mb--30 text-center">
                                    <h2 class="title">Quick Contact Address</h2>
                                    <p class="description">There are many variations of passages of Lorem Ipsum available, <br> but
                                        the majority have suffered alteration.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row g-5">
                            <div class="col-lg-4 col-md-6 col-sm-6 col-12 sal-animate" data-sal="slide-up" data-sal-delay="150" data-sal-duration="800">
                                <div class="rn-address">
                                    <div class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-headphones">
                                            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                        </svg>
                                    </div>
                                    <div class="inner">
                                        <h4 class="title">Contact Phone Number</h4>
                                        <p><a href="tel:+444555666777">+444 555 666 777</a></p>
                                        <p><a href="tel:+222222222333">+222 222 222 333</a></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-6 col-12 sal-animate" data-sal="slide-up" data-sal-delay="200" data-sal-duration="800">
                                <div class="rn-address">
                                    <div class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <div class="inner">
                                        <h4 class="title">Our Email Address</h4>
                                        <p><a href="mailto:admin@gmail.com">admin@gmail.com</a></p>
                                        <p><a href="mailto:example@gmail.com">example@gmail.com</a></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-6 col-12 sal-animate" data-sal="slide-up" data-sal-delay="250" data-sal-duration="800">
                                <div class="rn-address">
                                    <div class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div class="inner">
                                        <h4 class="title">Our Location</h4>
                                        <p>5678 Bangla Main Road, cities 580 <br> GBnagla, example 54786</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
                pageImage: "https://staup.site/img/dao/home-benefits-1.png",
                pageLink: "iletisim",
                customPageMetaKeywords: "iletişim, iletişim bilgileri, bize ulaşın",
                customPageMetaDescription: "İletişim bilgilerimize göz atın ve bizimle iletişime geçin.",
                menuVisibility: false,
            });

            await contactPage.save();
            console.log("İletişim sayfası başarıyla oluşturuldu.");
        }
    } catch (error) {
        console.error("İletişim sayfasını oluştururken hata oluştu:", error);
    }
};


setTimeout(() => {
    initializeSettings();
    initializeContactPage();
}, 30000);






// Server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
