const express = require('express');
const router = express.Router();
const { 
    getAllClients, 
    getClientById, 
    createClient, 
    updateClient, 
    deleteClient, 
    getClientDetails,
    addPaymentToPurchase,
    createPurchaseForClient
} = require('../Controller/client');

// Get all clients
router.get('/', getAllClients);

// Get single client
router.get('/:id', getClientById);

// Create new client
router.post('/', createClient);

// Update client
router.put('/:id', updateClient);

// Delete client
router.delete('/:id', deleteClient);

// Get client details (info, purchases, payments)
router.get('/:id/details', getClientDetails);

// Add payment to purchase
router.post('/:id/payments', addPaymentToPurchase);

// Create purchase for client
router.post('/:id/purchases', createPurchaseForClient);

module.exports = router;