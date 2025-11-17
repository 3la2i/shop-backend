const mongoose = require('mongoose');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '7d' }
    );
    return res.json({ message: 'Login successful', token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}; 