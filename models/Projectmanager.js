const mongoose = require('mongoose');



const projectManagerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // role: { type: String, enum: [ 'projectManager'], required: true },
  });
  
  const ProjectManager = mongoose.model('ProjectManager', projectManagerSchema);

  module.exports = {ProjectManager};