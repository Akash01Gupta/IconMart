const mongoose = require('mongoose');


const advertisementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  code: { type: String },
  imageUrl: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', advertisementSchema);