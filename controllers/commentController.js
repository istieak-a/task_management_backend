const Comment = require('../models/Comment');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const mongodb = require('mongodb');
const GridFsStorage = require('multer-gridfs-storage');

// Create a new MongoClient instance
const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URI);

// Configure GridFS storage
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads', // Name of the GridFS bucket
          metadata: { projectId: req.params.projectId }, // Optional metadata
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

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

const uploadFile = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const newComment = new Comment({
        projectId: projectId,
        fileName: req.file.filename,
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

const bucket = new mongodb.GridFSBucket(mongoClient.db(), { bucketName: 'uploads' });

const serveFile = async (req, res) => {
  try {
    const downloadStream = bucket.openDownloadStream(req.params.filename);
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
    downloadStream.on('error', (err) => {
      console.error(err);
      res.status(404).json({ message: 'File not found' });
    });
    downloadStream.on('end', () => {
      res.end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createComment,
  getAllComments,
  uploadFile,
  getAllFiles,
  serveFile,
};