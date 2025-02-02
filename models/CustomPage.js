const mongoose = require('mongoose');

const CustomPageSchema = new mongoose.Schema(
    {
        pageName: {
            type: String,
            required: [true, 'Sayfa ismi girilmesi gerekli'],
            unique: false,
            trim: true,
        },
        pageDescription: {
            type: String,
            required: [true, 'Sayfa altbaşlığı girilmesi gerekli'],
            unique: false,        
        },
        pageContent: {
            type: String,
            required: [true, 'Sayfa içeriği girilmesi gerekli'],
            unique: false,
        },
        pageImage: {
            type: String,
            required: false,
            unique: false,
        },
        pageLink: {
            type: String,
            required: true,
            unique: true,
        },
        customPageMetaKeywords: {
            type: String,
            required: false,
            unique: false,
        },
        customPageMetaDescription: {
            type: String,
            required: false,
            unique: false,
        },
        views: {
            type: Number,
            required: false,
            unique: false,
            default: 0,
        },
        menuVisibility: {
            type: Boolean,
            required: true,
            unique: false,
            default: false,
        }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CustomPage', CustomPageSchema);