// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   dueDate: { type: Date },
//   assignedMembers: [{
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     username: { type: String },
//   }],

//   project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
//   status: { type: String, enum: ['todo', 'inProgress', 'completed'], default: 'todo' },
// });

// const Task = mongoose.model('Task', taskSchema);

//  module.exports = Task;
