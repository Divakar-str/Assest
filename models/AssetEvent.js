const mongoose = require('mongoose');

const assetEventSchema = new mongoose.Schema({
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    eventType: { type: String, enum: ['issued', 'returned', 'scrapped'], required: true },
    eventDate: { type: Date, default: Date.now },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    quantity: { type: Number },
    location: { type: String },
    notes: { type: String },
    reasonForReturn: { type: String }
});

module.exports = mongoose.model('AssetEvent', assetEventSchema);
