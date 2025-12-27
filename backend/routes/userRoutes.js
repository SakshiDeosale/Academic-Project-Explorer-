const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

// Add User
router.post('/add', async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  
  await user.save();
  res.status(201).json({ 
    success: true,
    user: { email: user.email, createdAt: user.createdAt }
  });
});

// Get All Users
router.get('/list', async (req, res, next) => {
  const users = await User.find({}, 'email createdAt');
  res.json({ success: true, users });
});

// Delete User
router.delete('/delete/:id', async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error('Invalid user ID format'));
  }

  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new Error('User not found'));
  }

  res.json({ 
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = router;
