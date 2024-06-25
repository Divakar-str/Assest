const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Generate a constant salt for password hashing
const SALT_ROUNDS = 10; // Adjust this as needed
const CONSTANT_SALT = bcrypt.genSaltSync(SALT_ROUNDS);

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    password: { type: String, required: true }, 
    isActive: { type: Boolean, default: true },
    salary: { type: Number, required: true },
    branch: { type: String, required: true },
    isAssetIssuer: { type: Boolean, default: false },
    dateJoined: { type: Date, default: Date.now },
    dateTerminate: { type: Date }
});

// Hash the password before saving
employeeSchema.pre('save', function(next) {
    const employee = this;

    // Only hash the password if it has been modified or is new
    if (!employee.isModified('password')) {
        return next();
    }

    try {
        // Hash the password with the constant salt
        const hashedPassword = bcrypt.hashSync(employee.password, CONSTANT_SALT);
        
        // Replace plain password with hashed password
        employee.password = hashedPassword;

        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
