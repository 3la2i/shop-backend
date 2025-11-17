const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Customer = require('./Models/Customer').default || require('./Models/Customer');
const Product = require('./Models/Product').default || require('./Models/Product');
const Purchase = require('./Models/Purchase').default || require('./Models/Purchase');
const Payment = require('./Models/Payment').default || require('./Models/Payment');
const Note = require('./Models/Note').default || require('./Models/Note');

dotenv.config();

async function seed() {
  await connectDB();
  // Clear old data
  await Promise.all([
    Customer.deleteMany({}),
    Product.deleteMany({}),
    Purchase.deleteMany({}),
    Payment.deleteMany({}),
    Note.deleteMany({}),
  ]);

  // Customers
  const customers = await Customer.insertMany([
    { name: 'Test User 1', phone: '01000000001', address: 'Test Address 1', notes: 'First test user' },
    { name: 'Test User 2', phone: '01000000002', address: 'Test Address 2', notes: 'Second test user' },
  ]);

  // Products
  const products = await Product.insertMany([
    { name: 'Test Product A', description: 'Product A Desc', size: '1L', category: 'مياه', wholesalePrice: 10, retailPrice: 15, quantityInStock: 50 },
    { name: 'Test Product B', description: 'Product B Desc', size: '2L', category: 'مياه', wholesalePrice: 20, retailPrice: 25, quantityInStock: 30 },
  ]);

  // Purchases
  const purchases = await Purchase.insertMany([
    {
      customerId: customers[0]._id,
      items: [
        { productId: products[0]._id, quantity: 2, unitPrice: 15 },
        { productId: products[1]._id, quantity: 1, unitPrice: 25 },
      ],
      totalAmount: 15*2 + 25*1,
      amountPaid: 40,
      notes: 'First purchase for User 1',
      date: new Date(Date.now() - 1000*60*60*24*3),
    },
    {
      customerId: customers[1]._id,
      items: [
        { productId: products[1]._id, quantity: 3, unitPrice: 25 },
      ],
      totalAmount: 25*3,
      amountPaid: 50,
      notes: 'First purchase for User 2',
      date: new Date(Date.now() - 1000*60*60*24*2),
    },
  ]);

  // Payments
  await Payment.insertMany([
    { customerId: customers[0]._id, purchaseId: purchases[0]._id, amount: 40, method: 'cash', note: 'Partial payment for User 1', date: new Date(Date.now() - 1000*60*60*24*2) },
    { customerId: customers[1]._id, purchaseId: purchases[1]._id, amount: 50, method: 'transfer', note: 'Partial payment for User 2', date: new Date(Date.now() - 1000*60*60*24*1) },
  ]);

  // Notes
  await Note.insertMany([
    { customerId: customers[0]._id, text: 'Note for User 1', type: 'note', isDone: false, date: new Date(Date.now() - 1000*60*60*24*1) },
    { customerId: customers[1]._id, text: 'Note for User 2', type: 'note', isDone: true, date: new Date(Date.now() - 1000*60*60*24*1) },
  ]);

  console.log('Related mock data inserted!');
  process.exit(0);
}

seed(); 