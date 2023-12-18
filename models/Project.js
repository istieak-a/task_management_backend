const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  assignedUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
  }],
  status: { type: String, enum: ['todo', 'inProgress', 'completed'], default: 'todo' },
  assignedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
  },

});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [taskSchema],
  createdBy_ProjectManager: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String }},
  assignedUsers: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String },
    }]
  
})

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  projectManagers: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectManager' },
    username: { type: String },
    added_by_admin:{type:String}
  }],
  classes: [classSchema],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;



