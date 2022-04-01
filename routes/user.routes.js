const express = require('express');
const { route } = require('express/lib/application');

// controllers
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUsersProducts,
  getAllOrderUser,
  getOrderUserById
} = require('../controllers/user.controller');

// middlewares

const { validateSession } = require('../middlewares/auth.middleware');
const {
  userExists,
  protectUserAccount
} = require('../middlewares/users.middleware');

const router = express.Router();

//express-validator

router.post('/', createUser);


router.post('/login', loginUser);

router.use(validateSession);

//routes protect

router.get('/', getAllUsers);

//find products of userCurrent
router.get('/me', getUsersProducts);

//find orders of userCurrents
router.get('/orders', getAllOrderUser);
router.get('/order/:id', getOrderUserById);


router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter: router };
