const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId });

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createComment,
  getAllComments
};
