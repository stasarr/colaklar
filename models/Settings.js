const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    menuName: { type: String, required: false },
    menuLink: { type: String, required: false }
});

const PartnerSchema = new mongoose.Schema({
    partnerLogo: { type: String, required: false }
});

const ServiceAreaSchema = new mongoose.Schema({
    serviceAreaTitle: { type: String, required: false },
    serviceAreaContent: { type: String, required: false },
    serviceAreaIcon: { type: String, required: false },
});

const BannerSchema = new mongoose.Schema({
    buttonName: { type: String, required: true },
    buttonLink: { type: String, required: true },
    buttonTheme: { type: Boolean, required: false }
});

const SettingsSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            required: true,
            unique: false,
            default: "Sta Web",
        },
        siteDesc: {
            type: String,
            required: false,
            unique: false,
            default: "Sta Web Description",
        },
        siteKeywords: {
            type: String,
            required: false,
            unique: false,
        },
        siteFavicon: {
            type: String,
            required: false,
            unique: false,
            default: "https://staup.site/img/favicon.ico",
        },
        siteLogo: {
            type: String,
            required: false,
            unique: false,
            default: "https://staup.site/img/logo.png",
        },
        footerDesc: {
            type: String,
            required: false,
            unique: false,
            default: "Created with the collaboration of the world's best Sta Web Creation.",
        },
        footerCopyright: {
            type: String,
            required: false,
            unique: false,
            default: "©2025 Sta, Inc. All rights reserved.",
        },
        socialLinks: {
            facebook: String,
            tiktok: String,
            twitter: String,
            linkedin: String,
            youtube: String,
            instagram: String
        },
        footerMenu: [MenuSchema],
        bannerTitle: {
            type: String,
            required: false,
            unique: false,
            default: "Discover Digital Art, Collect and Sell Your Specific NFTs.",
        },
        bannerDesc: {
            type: String,
            required: false,
            unique: false,
            default: "Partner with one of the world’s largest retailers to showcase your brand and products.",
        },
        bannerButton: [BannerSchema],
        bannerButtonVisibility: {
            type: Boolean,
            required: false,
            unique: false,
        },
        bannerImage: {
            type: String,
            required: false,
            unique: false,
            default: "https://staup.site/img/hero/hero.webp",
        },
        generalInfoTitle: {
            type: String,
            required: false,
            unique: false,
            default: "AN NURON THEME JUST FOR GAMERS",
        },
        generalInfoContent: {
            type: String,
            required: false,
            unique: false,
            default: "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio sed non. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.",
        },
        generalInfoVisibility: {
            type: Boolean,
            required: false,
            unique: false,
        },
        partners: [PartnerSchema],
        partnersVisibility: {
            type: Boolean,
            required: false,
            unique: false,
        },
        serviceArea: [ServiceAreaSchema],
        serviceAreaVisibility: {
            type: Boolean,
            required: false,
            unique: false,
        },
   

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Settings', SettingsSchema);