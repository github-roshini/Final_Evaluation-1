const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  state: String,
  city: String,
  pincode: String,
  phone: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
