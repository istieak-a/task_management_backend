const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:projectId', authMiddleware.verifyAdminManagerUserToken, commentController.createComment);
router.get('/:projectId', authMiddleware.verifyAdminManagerUserToken, commentController.getAllComments);

module.exports = router;
