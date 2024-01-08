const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/create', authMiddleware.verifyadminToken, projectController.createProject);
router.post('/:projectId/editProject', authMiddleware.verifyadminToken, projectController.updateProjectDetails);
router.delete('/:projectId/delete', authMiddleware.verifyadminToken, projectController.deleteProject);
router.get('/', authMiddleware.verifyAdminManagerUserToken, projectController.getAllProjects);
router.get('/:projectId', authMiddleware.verifyAdminManagerUserToken, projectController.getProjectById);



router.post('/:projectId/addProjectManager', authMiddleware.verifyadminToken, projectController.addProjectManagerToProject);
router.delete('/:projectId/removeProjectManager', authMiddleware.verifyadminToken, projectController.removeProjectManagersFromProject);
router.get('/:projectId/getAllManagers', authMiddleware.verifyAdminManagerUserToken, projectController.getAllProjectManagers);
router.get('/:projectId/:projectManagerId', authMiddleware.verifyadminToken, projectController.getProjectManagerById);











module.exports = router;
