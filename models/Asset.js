// models/Asset.js

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true, unique: true },
    assetId: { type: String, required: true },
    type: { type: String, required: true },
    make: { type: String },
    model: { type: String },
    description: { type: String },
    quantity: { type: Number },
    price:{ type: Number },
    branch: { type: String },
    assignedquantity: { type: Number , default: 0}
});

module.exports = mongoose.model('Asset', assetSchema);
