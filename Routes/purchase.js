const express = require('express');
const router = express.Router();
const { listPurchases, summarizePurchases } = require('../Controller/purchase');

// GET /api/purchase -> list purchases
router.get('/', listPurchases);

// GET /api/purchase/summary -> aggregated summary
router.get('/summary', summarizePurchases);

module.exports = router;


