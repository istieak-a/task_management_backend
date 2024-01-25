const mongoose = require('mongoose');




const adminSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    // role: { type: String, enum: ['admin'], required: true },
  });
  
  const Admin = mongoose.model('Admin', adminSchema);

  module.exports = {Admin};

  