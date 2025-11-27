const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./Models/User');
const connectDB = require('./config/db');

dotenv.config();

async function createUser() {
  await connectDB();
  const username = '';
  const password = '';
  const exists = await User.findOne({ username });
  if (exists) {
    console.log('User already exists');
    process.exit(0);
  }
  const user = new User({ username, password });
  await user.save();
  console.log('User created:', username);
  process.exit(0);
}

createUser(); 




async function updateUser() {
  await connectDB();
  const user = await User.findOne({ username: 'admin' });
  user.password = 'admin123';
  await user.save();
  console.log('User updated:', user);
  process.exit(0);
}