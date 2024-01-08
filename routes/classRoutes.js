const express = require('express');
const router = express.Router();
const classContoller=require("../controllers/classController");
const authMiddleware = require('../middleware/authMiddleware');





router.put('/:projectId/addClass', authMiddleware.verifymanagerToken, classContoller.createClass);
router.post('/:projectId/:classId/editClass',authMiddleware.verifymanagerToken,classContoller.editClass);
router.delete('/:projectId/:classId/deleteClass',authMiddleware.verifymanagerToken,classContoller.deleteClass);
router.get('/:projectId',authMiddleware.verifyAdminManagerUserToken,classContoller.getAllClassesByManager);
router.get('/:projectId/:classId',authMiddleware.verifymanagerToken,classContoller.getClassById);


router.put('/:projectId/:classId/addUsers',authMiddleware.verifymanagerToken,classContoller.addUsersToClass);
router.delete('/:projectId/:classId/delete',authMiddleware.verifymanagerToken,classContoller.deleteUsersFromClass);
router.get('/:projectId/:classId/getUsers',authMiddleware.verifymanagerToken,classContoller.getAllUsersInClass);


router.put('/:projectId/:classId/addTask',authMiddleware.verifymanagerToken,classContoller.addTaskToClass);
router.post('/:projectId/:classId/:taskId/editTask',authMiddleware.verifymanagerToken,classContoller.editTaskInClass);
router.delete('/:projectId/:classId/:taskId/delete',authMiddleware.verifymanagerToken,classContoller.deleteTaskFromClass);
router.get('/:projectId/:classId/getTasks',authMiddleware.verifymanagerToken,classContoller.getAllTasksInClass);
router.get('/:projectId/:classId/:taskId',authMiddleware.verifymanagerToken,classContoller.getTaskByIdFromClass);


router.post('/:projectId/:classId/:taskId/addUsers',authMiddleware.verifymanagerToken,classContoller.addUsersToTask);
router.delete('/:projectId/:classId/:taskId/deleteUsers',authMiddleware.verifymanagerToken,classContoller.deleteUsersFromTask);
router.get('/:projectId/:classId/:taskId/getUsers',authMiddleware.verifymanagerToken,classContoller.getAllUsersInTask);









module.exports=router;