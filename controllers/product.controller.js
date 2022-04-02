const { Product } = require('../models/product.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require('../utils/filterObj');

//get all available products

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: {
      status: 'active'
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password'] }
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

//get products by id

exports.getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// create a product (send title, description, price (INT), and quantity -> req.body, add userId of current user)

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price } = req.body;
  const { id } = req.currentUser;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    userId: id
  });

  res.status(201).json({
    status: 'success',
    data: { newProduct }
  });
});

//update product (title, description, price, quantity) only user who created the product

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObj(req.body, 'title', 'description', 'quantity', 'price');

  await product.update({ ...data });

  res.status(204).json({ status: 'success' });
});

//disable product, only user who created the product

exports.disableProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
