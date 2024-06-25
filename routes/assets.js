// routes/assets.js
const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');


// routes/assets.js

router.get('/', async (req, res) => {
    try {
        // Fetch all assets initially
        const assets = await Asset.find();

        // Render index view with fetched assets and pagination data
        res.render('assets/index', {
            assets,
            alert: req.query.alert // Pass alert message from query parameter
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add new asset
router.get('/add', (req, res) => {
    res.render('assets/add', { alert: req.query.alert || null });
});

router.post('/add', async (req, res) => {
    try {
        const { serialNumber, assetId, type, make, model,quantity,price,branch, description, } = req.body;
        
        // Check if asset with the same serialNumber and assetId already exists
        const existingAsset = await Asset.findOne({ serialNumber, assetId });
        if (existingAsset) {
            return res.redirect('/assets/add?alert=Asset%20already%20exists'); // Redirect with alert
        }

        const newAsset = new Asset({ serialNumber, assetId, type, make, model,quantity,price,branch, description });
        await newAsset.save();
        res.redirect('/assets');
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid data or duplicate asset');
    }
});

// routes/assets.js

router.get('/edit/:id', async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        res.render('assets/edit', { asset, alert: req.query.alert }); // Pass alert query parameter to the view
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


router.post('/edit/:id', async (req, res) => {
    try {
        const { serialNumber, assetId, type, make, model,quantity, price,branch,description } = req.body;
        
        // Check if an asset with the same serialNumber and assetId already exists, excluding the current asset being edited
        const existingAsset = await Asset.findOne({ assetId, _id: { $ne: req.params.id } });
        if (existingAsset) {
            return res.redirect(`/assets/edit/${req.params.id}?alert=Asset%20ID%20already%20exists`); // Redirect with alert
        }
        
        // Update the asset
        const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, { serialNumber, assetId, type, make, model, quantity,price,branch,description }, { new: true });
        if (!updatedAsset) {
            return res.status(404).send('Asset not found'); // Handle case where asset to edit is not found
        }
        
        res.redirect('/assets');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete asset
router.post('/delete/:id', async (req, res) => {
    try {
        await Asset.findByIdAndDelete(req.params.id);
        res.redirect('/assets');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
