const mongoose = require('mongoose');
const Product = require('./Models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopManagement')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const sampleProducts = [
  {
    name: "مياه معدنية 18 لتر",
    description: "مياه معدنية طبيعية",
    size: "18L",
    category: "مياه",
    wholesalePrice: 5.50,
    retailPrice: 7.00,
    quantityInStock: 100
  },
  {
    name: "مياه معدنية 12 لتر",
    description: "مياه معدنية طبيعية",
    size: "12L",
    category: "مياه",
    wholesalePrice: 4.00,
    retailPrice: 5.50,
    quantityInStock: 150
  },
  {
    name: "مياه معدنية 6 لتر",
    description: "مياه معدنية طبيعية",
    size: "6L",
    category: "مياه",
    wholesalePrice: 2.50,
    retailPrice: 3.50,
    quantityInStock: 200
  },
  {
    name: "خزان مياه 1000 لتر",
    description: "خزان مياه بلاستيك",
    size: "1000L",
    category: "معدات",
    wholesalePrice: 150.00,
    retailPrice: 200.00,
    quantityInStock: 10
  },
  {
    name: "خزان مياه 500 لتر",
    description: "خزان مياه بلاستيك",
    size: "500L",
    category: "معدات",
    wholesalePrice: 80.00,
    retailPrice: 110.00,
    quantityInStock: 20
  }
];

async function createSampleProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create new products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} sample products:`);
    
    createdProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.wholesalePrice} د.أ`);
    });

    console.log('Sample products created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample products:', error);
    process.exit(1);
  }
}

createSampleProducts(); 