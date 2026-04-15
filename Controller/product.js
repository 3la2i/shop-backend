const Product = require('../Models/Product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const products = await Product.find({userId: userId, isActive: true}).sort({ name: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const userId = req.user.id;
        const product = await Product.findById(req.params.id, {userId: userId});
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, size, category, wholesalePrice, retailPrice, quantityInStock } = req.body;
        const newProduct = new Product({
            userId,
            name,
            description,
            size,
            category,
            wholesalePrice,
            retailPrice,
            quantityInStock: quantityInStock || 0
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, size, category, wholesalePrice, retailPrice, quantityInStock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { userId, name, description, size, category, wholesalePrice, retailPrice, quantityInStock },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedProduct = await Product.findByIdAndDelete(req.params.id, {userId: userId});
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}; 