const express = require('express');
const router = express.Router();
const IssuedAsset = require('../models/IssuedAsset');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const AssetEvent = require('../models/AssetEvent'); // Assuming you have AssetEvent model for tracking history

// Get all issued assets
router.get('/', async (req, res) => {
    try {
        const issuedAssets = await IssuedAsset.find()
            .populate('asset')
            .populate('employee');
        res.render('issuedAssets/index', { issuedAssets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/issue', async (req, res) => {
    try {
        // Find all assets with remaining quantity
        const assets = await Asset.find({ quantity: { $gt: 0 } });
       

        // Calculate remaining quantity for each asset
        for (let asset of assets) {
            const issuedAssets = await IssuedAsset.find({ asset: asset._id, status: { $ne: 'returned' } });
            const totalIssued = issuedAssets.reduce((acc, curr) => acc + curr.quantity, 0);
            asset.remainingQuantity = asset.quantity - totalIssued;
            
        }

        // Filter out assets with remaining quantity 0
        const assetsWithRemaining = assets.filter(asset => asset.remainingQuantity > 0);
        
        const employees = await Employee.find();
        res.render('issuedAssets/issue', { assets: assetsWithRemaining, employees });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/issue', async (req, res) => {
    try {
        const { asset: assetId, employee, quantity, branch, notes } = req.body;

        // Check if there are enough units available to issue
        const asset = await Asset.findById(assetId);
        const issuedAssets = await IssuedAsset.find({ asset: assetId, status: { $ne: 'returned' } });
        const totalIssued = issuedAssets.reduce((acc, curr) => acc + curr.quantity, 0);
        const remainingQuantity = asset.quantity - totalIssued;

        if (quantity > remainingQuantity) {
            throw new Error('Not enough units available to issue');
        }

        // Create a new IssuedAsset document
        const newIssuedAsset = new IssuedAsset({ asset: assetId, employee, quantity, branch, notes });
        await newIssuedAsset.save();

        // Update the assignedquantity in Asset model
        asset.assignedquantity += parseInt(quantity);
        await asset.save();

        // Create AssetEvent for the issuance
        const assetEvent = new AssetEvent({
            asset: assetId,
            eventType: 'issued',
            eventDate: new Date(),
            employee,
            quantity,
            location: branch, // Assuming branch is the location for issuance
            notes
        });
        await assetEvent.save();

        res.redirect('/asset-issuance');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message || 'Server Error');
    }
});


// Show form to return an asset
router.get('/return/:id', async (req, res) => {
    try {
        const issuedAsset = await IssuedAsset.findById(req.params.id)
            .populate('asset')
            .populate('employee');
        res.render('issuedAssets/return', { issuedAsset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Return an asset
router.post('/return/:id', async (req, res) => {
    try {
        const { returnedDate, reasonForReturn, notes } = req.body;
        const issuedAssetId = req.params.id;

        // Find the issued asset to return
        const issuedAsset = await IssuedAsset.findById(issuedAssetId);
        if (!issuedAsset) {
            return res.status(404).send('Issued Asset not found');
        }

        // Update the IssuedAsset document to mark it as returned
        issuedAsset.returnedDate = returnedDate;
        issuedAsset.reasonForReturn = reasonForReturn;
        issuedAsset.notes = notes;
        issuedAsset.status = 'returned';
        await issuedAsset.save();

        // Find the corresponding asset and decrease its assigned quantity
        const asset = await Asset.findById(issuedAsset.asset);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }

        asset.assignedquantity -= issuedAsset.quantity;
        await asset.save();

        // Create an asset event for return
        const assetEvent = new AssetEvent({
            asset: issuedAsset.asset,
            eventType: 'returned',
            employee: issuedAsset.employee,
            quantity: issuedAsset.quantity,
            branch: issuedAsset.branch,
            notes,
            reasonForReturn
        });
        await assetEvent.save();

        res.redirect('/asset-issuance');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Show form to scrap an asset
router.get('/scrap/:id', async (req, res) => {
    try {
        const issuedAsset = await IssuedAsset.findById(req.params.id)
            .populate('asset')
            .populate('employee');
        res.render('issuedAssets/scrap', { issuedAsset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Scrap an asset
router.post('/scrap/:id', async (req, res) => {
    try {
        const { returnedDate, reasonForReturn, notes } = req.body;

        // Find the issued asset and update status
        const issuedAsset = await IssuedAsset.findById(req.params.id);
        await IssuedAsset.findByIdAndUpdate(req.params.id, { returnedDate, reasonForReturn, notes, status: 'scrapped' });

        // Update the quantity and assignedquantity in Asset model
        const asset = await Asset.findById(issuedAsset.asset);
        asset.quantity -= issuedAsset.quantity; // Reduce total quantity
        asset.assignedquantity -= issuedAsset.quantity; // Reduce assigned quantity
        await asset.save();

        // Create an asset event for scrap
        const assetEvent = new AssetEvent({
            asset: issuedAsset.asset,
            eventType: 'scrapped',
            notes,
            reasonForReturn,
            employee: issuedAsset.employee,
            quantity: issuedAsset.quantity
        });
        await assetEvent.save();

        res.redirect('/asset-issuance');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get asset history
router.get('/history/:id', async (req, res) => {
    try {
        const assetEvents = await AssetEvent.find({ asset: req.params.id })
            .populate('asset')
            .populate('employee'); // Assuming you populate employee field if needed

        const asset = await Asset.findById(req.params.id);

        res.render('issuedAssets/history', { asset, assetEvents });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
