const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
//protect with JWT
const jwt = require('jsonwebtoken');

// models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObj } = require('../utils/filterObj');

dotenv.config({ path: './config.env' });

//login (send email and password -> req.body)

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // find user given an email and has status active
  const user = await User.findOne({
    where: {
      email,
      status: 'active'
    }
  });

  // compare entered password vs hashed password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // create JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { status: 'active' }
  });

  res.status(200).json({ status: 'success', data: { users } });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({ status: 'success', data: { user } });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, 'username', 'email');

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

exports.getUsersProducts = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const products = await Product.findAll({
    where: { userId: id }
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.getAllOrderUser = catchAsync(async (req, res, next) => {
  const order = await Order.findAll({});
});

exports.getOrderUserById = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({});
});
