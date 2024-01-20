const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const taskController=require('../controllers/taskController');



router.post('/:projectId/:classId/:taskId/addUsersToTask',authMiddleware.verifyuserToken,taskController.addUsersToTaskByUser);
router.post('/:projectId/:classId/:taskId/editTask',authMiddleware.verifyuserToken,taskController.editTaskDetails);
router.post('/:projectId/:classId/:taskId/updateDueDate',authMiddleware.verifyuserToken,taskController.updateDueDate);
router.put('/:projectId/:classId/:taskId/updateTaskStatus',authMiddleware.verifyuserToken,taskController.updateTaskStatus);
router.delete('/:projectId/:classId/:taskId/deleteTask',authMiddleware.verifyuserToken,taskController.deleteTask);


module.exports=router;

