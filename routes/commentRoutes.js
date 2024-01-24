const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:projectId', authMiddleware.verifyAdminManagerUserToken, commentController.createComment);
router.get('/:projectId', authMiddleware.verifyAdminManagerUserToken, commentController.getAllComments);
router.post('/:projectId/uploadFile', authMiddleware.verifyAdminManagerUserToken, commentController.uploadFile);
router.get('/:projectId/files', authMiddleware.verifyAdminManagerUserToken, commentController.getAllFiles);
router.get('/getFile/:filename', commentController.serveFile);

module.exports = router;
