const Comment = require('../models/Comment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    const comments = await Comment.find({ projectId: req.params.projectId, body: { $ne: null } });

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where you want to store the files
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const uploadFile = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    console.log("req.body", req.body)
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'File upload failed' });
      }
      console.log(req.file)
      const newComment = new Comment({
        projectId: projectId,
        fileName: req.file?.filename
      });

      await newComment.save();

      res.status(201).json({ message: 'File uploaded successfully', file: newComment });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await Comment.find({ projectId: req.params.projectId, fileName: { $ne: null } });

    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const serveFile = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log("I am in else")
    res.status(404).json({ message: 'File not found' });
  }
};

module.exports = {
  createComment,
  getAllComments,
  uploadFile,
  getAllFiles,
  serveFile,
};
