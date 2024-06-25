// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee'); 




// GET request to render login form
router.get('/', (req, res) => {
    res.render('login/login', { title: 'Login' });
});

// POST request to handle user login
router.post('/',
    // Validate input using express-validator
    body('email').isEmail(),
    body('password').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists in database
            const user = await Employee.findOne({ email });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
          
            // Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });

module.exports = router;
