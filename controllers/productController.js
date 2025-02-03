// controllers/productController.js
const User = require('../models/User');
const Product = require('../models/Product');

async function productAdd(req, res, next) {
  const { productName, category, weight, width, height, thickness, density, materialType, usageArea, colorOptions, price, discount, stock, saleStatus, receiptImage, description, applicationInstructions, warrantyPeriod, productCertificate, certificateLink, productVideo, thermalInsulation, waterInsulation, fireInsulation, surfaceTexture, glossiness, productMetaKeywords, productMetaDescription, productLink } = req.body;

  if (!req.session.user) {
    return res.redirect('/signin');
  }

  const userId = req.session.user._id;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.redirect('/signin');
    }

    if (!productName) {
      res.locals.errorMessage = 'Lütfen bir ürün adı belirtin';
      return res.render('admin/product/productAdd');
    }
    if (!category) {
      res.locals.errorMessage = 'Ürün kategorisi belirtmediniz';
      return res.render('admin/product/productAdd');
    }
    if (!description) {
      res.locals.errorMessage = 'Bir ürün açıklaması girin';
      return res.render('admin/product/productAdd');
    }
    if (!productLink) {
      res.locals.errorMessage = 'Ürün linkini boş bırakamazsınız';
      return res.render('admin/product/productAdd');
    }


    const checkProductLink = await Product.findOne({ productLink: productLink });

    if (checkProductLink) {
      res.locals.errorMessage = 'Ürün linki başka bir ürün tarafından kullanılıyor';
      return res.render('admin/product/productAdd');
    }


    const receiptImages = receiptImage ? receiptImage.split(',') : [];

    const productImage1 = receiptImages[0]
    const productImage2 = receiptImages[1]
    const productImage3 = receiptImages[2]

    const newProduct = new Product({ productName, category, weight, width, height, thickness, density, materialType, usageArea, colorOptions, price, discount, stock, saleStatus, productImage1, productImage2, productImage3, description, applicationInstructions, warrantyPeriod, productCertificate, certificateLink, productVideo, thermalInsulation, waterInsulation, fireInsulation, surfaceTexture, glossiness, productMetaKeywords, productMetaDescription, productLink });
    await newProduct.save();

    req.session.successMessage = 'Yeni ürün, ürün listesine eklendi!';
    return res.redirect('/admin/product-list');
  } catch (error) {
    console.log(error);
    res.locals.errorMessage = 'Yeni ürün eklerken bir hata oluştu.';
    return res.render('admin/product/productAdd');
  }
}

async function productEdit(req, res, next) {
  let { _id, productName, category, weight, width, height, thickness, density, materialType, usageArea, colorOptions, price, discount, stock, saleStatus, receiptImage, receiptImage2, description, applicationInstructions, warrantyPeriod, productCertificate, certificateLink, productVideo, thermalInsulation, waterInsulation, fireInsulation, surfaceTexture, glossiness, productMetaKeywords, productMetaDescription, productLink } = req.body;

  if (!req.session.user) {
    return res.redirect('/signin');
  }

  const userId = req.session.user._id;

  try {
    const user = await User.findOne({ _id: userId });
    const product = await Product.findOne({ _id: _id });

    if (!user) {
      return res.redirect('/signin');
    }

    if (!product) {
      req.session.errorMessage = 'Ürün düzenlenirken hata oluştu. Ürün bulunamadı';
      return res.redirect(`/admin/product-list`);
    }

    if (!productName) {
      req.session.errorMessage = 'Ürün isminiz eksik';
      return res.redirect(`/admin/product-edit/${_id}`);
    }
    if (!category) {
      req.session.errorMessage = 'Ürün kategorisi belirtmediniz';
      return res.redirect(`/admin/product-edit/${_id}`);
    }
    if (!description) {
      req.session.errorMessage = 'Bir ürün açıklaması girin';
      return res.redirect(`/admin/product-edit/${_id}`);
    }
    if (!productLink) {
      req.session.errorMessage = 'Ürün linkini boş bırakamazsınız';
      return res.redirect(`/admin/product-edit/${_id}`);
    }


    const checkProductLink = await Product.findOne({ productLink: productLink });

    if (checkProductLink) {
      if (checkProductLink._id != _id) {
        req.session.errorMessage = 'Ürün linki başka bir ürün tarafından kullanılıyor';
        return res.redirect(`/admin/product-edit/${_id}`);
      }
    }


    const receiptImages = receiptImage ? receiptImage.split(',') : [];

    const productImage1 = receiptImages[0]
    const productImage2 = receiptImages[1]
    const productImage3 = receiptImages[2]

    // Burada gelen yeni verilerle projeyi güncelliyoruz
    product.productName = productName;
    product.category = category;
    product.weight = weight;
    product.width = width;
    product.height = height;
    product.thickness = thickness;
    product.density = density;
    product.materialType = materialType;
    product.usageArea = usageArea;
    product.colorOptions = colorOptions;
    product.price = price;
    product.discount = discount;
    product.stock = stock;
    product.saleStatus = saleStatus;
    product.productImage1 = productImage1;
    product.productImage2 = productImage2;
    product.productImage3 = productImage3;
    product.description = description;
    product.applicationInstructions = applicationInstructions;
    product.warrantyPeriod = warrantyPeriod;
    product.productCertificate = productCertificate;
    product.certificateLink = certificateLink;
    product.productVideo = productVideo;
    product.thermalInsulation = thermalInsulation;
    product.waterInsulation = waterInsulation;
    product.fireInsulation = fireInsulation;
    product.surfaceTexture = surfaceTexture;
    product.glossiness = glossiness;
    product.productMetaKeywords = productMetaKeywords;
    product.productMetaDescription = productMetaDescription;
    product.productLink = productLink;

    // Güncellenen projeyi kaydediyoruz
    await product.save();

    req.session.successMessage = 'Ürün başarıyla güncellendi!';
    return res.redirect('/admin/product-list');
  } catch (error) {
    console.log(error);
    res.locals.errorMessage = 'Ürün güncellenirken bir hata oluştu.';
    return res.render('admin/product/productList');
  }
}

async function productDelete(req, res, next) {
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
      res.locals.errorMessage = 'Ürün bulunamadı!';
      return res.render('admin/product/productList');
    }


    await Product.deleteOne({ _id });
    req.session.successMessage = 'Ürün başarıyla kaldırıldı';
    return res.redirect('/admin/product-list');
  } catch (error) {
    console.log(error);
    res.locals.errorMessage = 'Ürün silinirken bir hata oluştu.';
    return res.render('admin/product/productList');
  }
}

module.exports = { productAdd, productEdit, productDelete };