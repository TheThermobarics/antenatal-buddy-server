const express = require('express');
const {
  getUsers,
  getUser,
} = require('../controllers/user');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');


router
  .route('/')
  .get(protect, advancedResults(User), getUsers)

router
  .route('/:id')
  .get(protect,getUser)


module.exports = router;