const express = require('express');
const router = express.Router();
const AssetEvent = require('../models/AssetEvent');
const Assetissue = require('../models/IssuedAsset');
const Employee = require('../models/Employee');

// Route to display all asset events
router.get('/', async (req, res) => {
    try {
        const assetEvents = await AssetEvent.find()
            .populate({
                path: 'asset',
                model: 'Asset'
            })
            .populate({
                path: 'employee',
                model: 'Employee'
            })


            .sort({ eventDate: -1 });

        

        if (!assetEvents) {
            return res.status(404).send('No asset events found');
        }

        res.render('assetHistory/index', { assetEvents });
    } catch (err) {
        console.error("Error fetching asset events:", err); // Log error
        res.status(500).send('Server Error');
    }
});

// Route to display asset events for a specific employee
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        const assetEvents = await AssetEvent.find({ employee: req.params.employeeId })
            .populate({
                path: 'asset',
                model: 'Asset'
            })
            .populate({
                path: 'employee',
                model: 'Employee'
            })
            .sort({ eventDate: -1 });

        console.log("Fetched asset events for employee:", assetEvents); // Log fetched events

        if (!assetEvents) {
            return res.status(404).send('No asset events found for this employee');
        }

        res.render('assetHistory/employeeHistory', { employee, assetEvents });
    } catch (err) {
        console.error("Error fetching asset events for employee:", err); // Log error
        res.status(500).send('Server Error');
    }
});

module.exports = router;
