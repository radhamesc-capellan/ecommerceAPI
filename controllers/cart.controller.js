//models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Order } = require('../models/order.model');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

//asingnament cart to user

exports.getUserCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: {
      status: 'active',
      userId: currentUser.id
    },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'User without Cart'));
  }

  res.status(200).json({
    status: 'success',
    data: { cart }
  });
});

//add products to cart

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  //send productId and quantity -> req.body

  const { productId, quantity } = req.body;

  //verify product into the cart and enough existence in stock

  const product = await Product.findOne({
    where: {
      status: 'active',
      id: productId
    }
  });

  if (quantity > product.quantity) {
    return next(new AppError(400, `only left ${product.quantity} in stock`));
  }

  //verify if cart active else create
  const cart = await Cart.findOne({
    where: {
      status: 'active',
      userId: currentUser.id
    }
  });

  if (!cart) {
    const newCart = await Cart.create({
      userId: currentUser.id
    });

    await ProductInCart.create({
      productId,
      cartId: newCart.id,
      quantity
    });
  } else {
    //cart created, verify if product into the cart

    const productExists = await ProductInCart.findOne({
      where: {
        cartId: cart.Id,
        productId
      }
    });

    if (productExists && productExists.status === 'active') {
      return productExists.update({
        status: 'active',
        quantity
      });
    }
    //add new product into the cart

    if (!productExists) {
      await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }
  }

  res.status(201).json({
    status: 'success'
  });
});

// increment or decrement quantity -> productId, newQty

exports.updateCartProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  //send productId and quantity -> req.body

  const { productId, quantity } = req.body;

  //verify product into the cart and enough existence in stock

  const product = await Product.findOne({
    where: {
      status: 'active',
      id: productId
    }
  });

  if (quantity > product.quantity) {
    return next(new AppError(400, `only left ${product.quantity} in stock`));
  }

  //find user's cart

  const cart = await Cart.findOne({
    where: {
      status: 'active',
      userId: currentUser.id
    }
  });

  if (!cart) {
    return next(new AppError(400, 'This User does not have a Cart'));
  }

  //find the product in cart requested

  const productInCart = await ProductInCart.findOne({
    where: {
      status: 'active',
      cartId: cart.id,
      productId
    }
  });

  if (!productInCart) {
    return next(new AppError(404, 'Can´t Update Product'));
  }

  // if quantity = 0 -> product no exists in stock

  if (quantity === 0) {
    await productInCart.update({
      quantity: 0,
      status: 'removed'
    });
  }

  //update quantity of product

  if (quantity > 0) {
    await productInCart.update({ quantity });
  }

  res.status(204), json({ status: 'success' });
});

//remove product from the cart

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: {
      status: 'active',
      userId: currentUser.id
    }
  });

  if (!cart) {
    return next(new AppError(404, 'This User does not have a Cart'));
  }

  const productInCart = await ProductInCart.findOne({
    where: {
      status: 'active',
      cartId: cart.id,
      productId
    }
  });

  if (!productInCart) {
    return next(new AppError(404, 'This Product does not Exist in Cart '));
  }

  await productInCart.update({
    status: 'removed',
    quantity: 0
  });

  res.status(204).json({
    status: 'success'
  });
});

//buy cart content

exports.purchaseCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  //find user's cart

  const cart = await Cart.findOne({
    where: {
      status: 'active',
      userId: currentUser.id
    },
    include: [
      {
        model: Product,
        through: {
          where: {
            status: 'active'
          }
        }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'This User does not have a Cart'));
  }

  let totalPrice = 0;

  //update all product as purchased

  const cartPromises = cart.products.map(async (product) => {
    await product.productInCart.update({
      status: 'purchased'
    });

    //get total price of the order

    const productPrice = product.price * productInCart.quantity;

    totalPrice += productPrice;

    //reduce the quantity from stock products
    const newQuantity = product.quantity - product.productInCart.quantity;

    return await product.update({
      quantity: newQuantity
    });
  });

  await Promise.all(cartPromises);

  //mark cart as purchased

  await cart.update({
    status: 'purchased'
  });

  const newOrder = await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: new Date().toLocaleString(),
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: { newOrder }
  });
});
