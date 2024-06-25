const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// Route to display stock view
router.get('/', async (req, res) => {
    try {
        // Aggregate assets by branch
        const stock = await Asset.aggregate([
            {
                $match: { assignedTo: null } // Filter for assets not assigned
            },
            {
                $group: {
                    _id: '$branch',
                    totalAssets: { $sum: '$quantity' }, // Sum the quantities of assets
                    totalValue: { $sum: { $multiply: ['$price', '$quantity'] } } // Calculate total value by multiplying price and quantity
                }
            },
            {
                $sort: { _id: 1 } // Optionally sort by branch name
            }
        ]);

        // Calculate total assets and total value for all branches combined
        const totalAssetsAll = stock.reduce((acc, curr) => acc + curr.totalAssets, 0);
        const totalValueAll = stock.reduce((acc, curr) => acc + curr.totalValue, 0);

        // Render the stock view template with stock data and totals
        res.render('stock/index', {
            stock,
            totalAssetsAll,
            totalValueAll
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to display stock details for a specific branch
router.get('/branch', async (req, res) => {
    const branch = req.query.branch;

    try {
        // Fetch assets for the specific branch that are not assigned
        const assets = await Asset.find({ branch, assignedTo: null });

        // Calculate total value for the branch
        const totalValue = assets.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

        // Render the branch view template with assets and total value
        res.render('stock/branch', {
            branch,
            assets,
            totalValue
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
