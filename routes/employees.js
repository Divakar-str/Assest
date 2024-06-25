// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

// GET all employees with filter and search
router.get('/', async (req, res) => {
    try {
        let filter = {};
        if (req.query.isActive !== undefined && req.query.isActive !== '') {
            filter.isActive = req.query.isActive === 'true';
        }
        let search = {};
        if (req.query.search) {
            search = {
                $or: [
                    { firstName: { $regex: req.query.search, $options: 'i' } },
                    { lastName: { $regex: req.query.search, $options: 'i' } }
                ]
            };
        }
        const employees = await Employee.find({ ...filter, ...search });
        res.render('employees/index', { employees });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET add employee form
router.get('/add', (req, res) => {
    res.render('employees/add');
});

// POST add new employee
router.post('/add', async (req, res) => {
    try {
        const { firstName, lastName, email, department, position, password, salary,branch,isAssetIssuer,dateJoined,dateTerminate, isActive } = req.body;
        
        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            department,
            position,
            password,
            salary,
            branch,
            isAssetIssuer: isAssetIssuer === 'true',
            dateJoined,
            dateTerminate,
            isActive: isActive === 'true'
        });
        
        await newEmployee.save();
        res.redirect('/employees');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET edit employee form
router.get('/edit/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.render('employees/edit', { employee });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const {firstName,lastName,email,department,position,salary,branch,isAssetIssuer,dateJoined,dateTerminate,isActive,newpassword } = req.body;

        // Find the employee by id
        let employee = await Employee.findById(req.params.id);

        // Update other fields
        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.email = email;
        employee.department = department;
        employee.position = position;
        employee.salary = salary;
        employee.branch = branch;
        employee.isAssetIssuer = isAssetIssuer === 'true';
        employee.dateJoined = dateJoined;
        employee.dateTerminate = dateTerminate;
        employee.isActive = isActive === 'true';

        // Check if new password field is provided
        if (newpassword !== '') {
            
            employee.password = newpassword;
        }

        // Save the updated employee
        await employee.save();
       
        res.redirect('/employees');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// GET delete employee
router.get('/delete/:id', async (req, res) => {
    try {
        await Employee.findOneAndDelete({ _id: req.params.id });
        res.redirect('/employees');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
