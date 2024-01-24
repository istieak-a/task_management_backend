const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: { type: String },
  fileName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
