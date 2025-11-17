const Customer = require('../Models/Customer');
const mongoose = require('mongoose');
require('../Models/Product');

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Customer.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error: error.message });
    }
};

// Get single client by ID
const getClientById = async (req, res) => {
    try {
        const client = await Customer.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error: error.message });
    }
};

// Create new client
const createClient = async (req, res) => {
    try {
        const { name, phone, address, notes } = req.body;
        const newClient = new Customer({
            name,
            phone,
            address,
            notes
        });
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};

// Update client
const updateClient = async (req, res) => {
    try {
        const { name, phone, address, notes } = req.body;
        const updatedClient = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, phone, address, notes },
            { new: true }
        );
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error: error.message });
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const deletedClient = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
};

// Get client details (info, purchases, payments)
const Purchase = require('../Models/Purchase').default || require('../Models/Purchase');
const Payment = require('../Models/Payment').default || require('../Models/Payment');

const getClientDetails = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.error('Invalid client ID:', req.params.id);
            return res.status(400).json({ message: 'Invalid client ID' });
        }
        const client = await Customer.findById(req.params.id);
        if (!client) {
            console.error('Client not found for ID:', req.params.id);
            return res.status(404).json({ message: 'Client not found' });
        }
        // Get purchases with product details
        let purchases;
        try {
            purchases = await Purchase.find({ customerId: req.params.id })
                .populate('items.productId')
                .sort({ date: -1 });
        } catch (err) {
            console.error('Error fetching purchases:', err);
            throw err;
        }
        // Get payments
        let payments;
        try {
            payments = await Payment.find({ customerId: req.params.id }).sort({ date: -1 });
        } catch (err) {
            console.error('Error fetching payments:', err);
            throw err;
        }
        res.json({ client, purchases, payments });
    } catch (error) {
        console.error('Error in getClientDetails:', error.stack || error);
        res.status(500).json({ message: 'Error fetching client details', error: error.message });
    }
};

// Add payment to purchase
const addPaymentToPurchase = async (req, res) => {
    try {
        const { purchaseId, amount, method, note } = req.body;
        const customerId = req.params.id;

        // Validate input
        if (!purchaseId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid payment data' });
        }

        // Find the purchase
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // Verify the purchase belongs to this customer
        if (purchase.customerId.toString() !== customerId) {
            return res.status(403).json({ message: 'Purchase does not belong to this customer' });
        }

        // Check if payment amount exceeds remaining debt
        const remainingDebt = purchase.totalAmount - purchase.amountPaid;
        if (amount > remainingDebt) {
            return res.status(400).json({ message: 'Payment amount exceeds remaining debt' });
        }

        // Update purchase amount paid
        purchase.amountPaid += amount;
        await purchase.save(); // This will trigger the pre-save hook to update remainingDebt and paymentStatus

        // Create new payment record
        const newPayment = new Payment({
            customerId,
            purchaseId,
            amount,
            method: method || 'cash',
            note: note || '',
            date: new Date()
        });
        await newPayment.save();

        // Get updated client details
        const client = await Customer.findById(customerId);
        const updatedPurchases = await Purchase.find({ customerId })
            .populate('items.productId')
            .sort({ date: -1 });
        const updatedPayments = await Payment.find({ customerId }).sort({ date: -1 });

        res.json({ 
            message: 'Payment added successfully',
            clientDetails: { client, purchases: updatedPurchases, payments: updatedPayments }
        });
    } catch (error) {
        console.error('Error in addPaymentToPurchase:', error);
        res.status(500).json({ message: 'Error adding payment', error: error.message });
    }
};

// Create purchase for client
const createPurchaseForClient = async (req, res) => {
    try {
        const { items, totalAmount, notes } = req.body;
        const customerId = req.params.id;

        // Validate input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items are required and must be an array' });
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ message: 'Total amount must be greater than 0' });
        }

        // Verify the customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Import Product model
        const Product = require('../Models/Product');

        // Validate stock availability and reduce stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }

            // Check if enough stock is available
            if (product.quantityInStock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.quantityInStock}, Requested: ${item.quantity}` 
                });
            }

            // Reduce stock quantity
            product.quantityInStock -= item.quantity;
            await product.save();
        }

        // Create new purchase
        const newPurchase = new Purchase({
            customerId,
            items,
            totalAmount,
            notes: notes || '',
            date: new Date()
        });

        await newPurchase.save(); // This will trigger the pre-save hook

        // Get updated client details
        const updatedPurchases = await Purchase.find({ customerId })
            .populate('items.productId')
            .sort({ date: -1 });
        const updatedPayments = await Payment.find({ customerId }).sort({ date: -1 });

        res.status(201).json({ 
            message: 'Purchase created successfully',
            clientDetails: { client: customer, purchases: updatedPurchases, payments: updatedPayments }
        });
    } catch (error) {
        console.error('Error in createPurchaseForClient:', error);
        res.status(500).json({ message: 'Error creating purchase', error: error.message });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientDetails,
    addPaymentToPurchase,
    createPurchaseForClient
};
