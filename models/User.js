const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Kullanıcı şeması
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email adresi gerekli'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        avatar: {
            type: String,
            required: [true, 'Avatar gerekli'],
            unique: false,  
            default: '/assets/images/user/avatar-2.jpg',
        },
        firstname: {
            type: String,
            required: [true, 'Ad gerekli'],
            trim: true,
        },
        lastname: {
            type: String,
            required: [true, 'Soyad gerekli'],
            trim: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: [false, 'Cinsiyet gerekli'],
        },
        password: {
            type: String,
            required: [true, 'Şifre gerekli'],
            minlength: [6, 'Şifre en az 6 karakter olmalı'],
        },
        role: {
            type: String,
            enum: ['user', 'moderator', 'admin'],
            default: 'user',
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        restrict: {
            type: Boolean,
            required: false,
            default: false,
        },
        registrationDate: {
            type: Date,
            default: Date.now,
        },
        ip: {
            type: String,
            required: false, // Opsiyonel olarak kullanılabilir
        },
    },
    {
        timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
    }
);

module.exports = mongoose.model('User', UserSchema);