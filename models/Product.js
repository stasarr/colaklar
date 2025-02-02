const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            unique: false,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            unique: false,
        },
        weight: {
            type: String,
            required: false,
            unique: false,
        },
        width: {
            type: String,
            required: false,
            unique: false,
        },
        height: {
            type: String,
            required: false,
            unique: false,
        },
        thickness: {
            type: String,
            required: false,
            unique: false,
        },
        density: {
            type: String,
            required: false,
            unique: false,
        },
        materialType: {
            type: String,
            required: false,
            unique: false,
        },
        usageArea: {
            type: String,
            required: false,
            unique: false,
        },
        colorOptions: {
            type: String,
            required: false,
            unique: false,
        },
        price: {
            type: Number,
            required: false,
            unique: false,
        },
        discount: {
            type: Number,
            required: false,
            unique: false,
        },
        stock: {
            type: Boolean,
            required: false,
            unique: false,
        },
        saleStatus: {
            type: Boolean,
            required: false,
            unique: false,
        },
        productImage1: {
            type: String,
            required: false,
            unique: false,
        },
        productImage2: {
            type: String,
            required: false,
            unique: false,
        },
        productImage3: {
            type: String,
            required: false,
            unique: false,
        },
        description: {
            type: String,
            required: false,
            unique: false,
        },
        applicationInstructions: {
            type: String,
            required: false,
            unique: false,
        },
        warrantyPeriod: {
            type: String,
            required: false,
            unique: false,
        },
        productCertificate: {
            type: String,
            required: false,
            unique: false,
        },
        certificateLink: {
            type: String,
            required: false,
            unique: false,
        },
        productVideo: {
            type: String,
            required: false,
            unique: false,
        },
        thermalInsulation: {
            type: String,
            enum: ['Düşük', 'Orta', 'Yüksek'],
            required: false,
            unique: false,
        },
        waterInsulation: {
            type: String,
            enum: ['Düşük', 'Orta', 'Yüksek'],
            required: false,
            unique: false,
        },
        fireInsulation: {
            type: String,
            enum: ['Düşük', 'Orta', 'Yüksek'],
            required: false,
            unique: false,
        },
        surfaceTexture: {
            type: String,
            enum: ['Pürüzlü', 'Düz', 'Granüllü'],
            required: false,
            unique: false,
        },
        glossiness: {
            type: String,
            enum: ['Parlak', 'Yarı mat', 'Mat'],
            required: false,
            unique: false,
        },
        productMetaKeywords: {
            type: String,
            required: false,
            unique: false,
        },
        productMetaDescription: {
            type: String,
            required: false,
            unique: false,
        },
        productLink: {
            type: String,
            required: true,
            unique: true,
        },


    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', ProductSchema);