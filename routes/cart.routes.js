const express = require('express');

// controller
const {
  addProductToCart,
  getUserCart,
  updateCartProduct,
  removeProductFromCart,
  purchaseCart
} = require('../controllers/cart.controller');

// middleware

//express-validator
const { validateSession } = require('../middlewares/auth.middleware');
const {
  addProductToCartValidation,
  validateResult
} = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession);

router.get('/', getUserCart);

router.post(
  '/add-product',
  addProductToCartValidation,
  validateResult,
  addProductToCart
);

router.patch('/update-cart', updateCartProduct);

router.post('/purchase', purchaseCart);

router.delete('/:productId', removeProductFromCart);

module.exports = { cartRouter: router };
