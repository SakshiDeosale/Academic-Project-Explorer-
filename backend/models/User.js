const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define user schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8 // Minimum length for password
  }
}, { timestamps: true });

// Hash password before saving it to the database
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();  // Only hash if password is modified
    this.password = await bcrypt.hash(this.password, 10);  // Salt rounds set to 10
    next();
  } catch (err) {
    next(err);  // Pass any errors to the next middleware
  }
});

// Compare entered password with the hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('User', userSchema);
