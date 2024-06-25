const mongoose = require('mongoose');

const issuedAssetSchema = new mongoose.Schema({
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    issuedDate: { type: Date, default: Date.now },
    returnedDate: { type: Date },
    quantity: { type: Number, default: 1 },
    branch: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['issued', 'returned', 'scrapped'], default: 'issued' },
    reasonForReturn: { type: String } 
});

module.exports = mongoose.model('IssuedAsset', issuedAssetSchema);
