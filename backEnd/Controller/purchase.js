const Purchase = require('../Models/Purchase');
const Customer = require('../Models/Customer');

// List purchases with optional filters
// Query params: startDate, endDate, status (paid|partial|unpaid), customerId
const listPurchases = async (req, res) => {
  try {
    const { startDate, endDate, status, customerId } = req.query;

    const filter = {};
    if (status) filter.paymentStatus = status;
    if (customerId) filter.customerId = customerId;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const purchases = await Purchase.find(filter)
      .populate('items.productId')
      .populate({ path: 'customerId', model: Customer })
      .sort({ date: -1, createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
};

// Aggregate summary for inventory
// Returns totals by day and overall
const summarizePurchases = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalSales: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$amountPaid' },
          totalDebt: { $sum: '$remainingDebt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ];

    const byDay = await Purchase.aggregate(pipeline);
    const overall = byDay.reduce(
      (acc, d) => {
        acc.totalSales += d.totalSales;
        acc.totalPaid += d.totalPaid;
        acc.totalDebt += d.totalDebt;
        acc.count += d.count;
        return acc;
      },
      { totalSales: 0, totalPaid: 0, totalDebt: 0, count: 0 }
    );

    res.json({ overall, byDay });
  } catch (error) {
    res.status(500).json({ message: 'Error summarizing purchases', error: error.message });
  }
};

module.exports = {
  listPurchases,
  summarizePurchases
};


