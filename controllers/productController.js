const Product = require('../models/productModel');

exports.createProduct = async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newProduct,
    }
  })
};