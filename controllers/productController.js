const Product = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products
    }
  });
};

exports.createProduct = async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newProduct,
    }
  })
};