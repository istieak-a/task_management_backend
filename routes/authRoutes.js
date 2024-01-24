const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/userregister', authMiddleware.verifyAdminManagerToken,authController.userregister);
router.post('/adminregister', authController.adminregister);
router.post('/managerregister',authMiddleware.verifyadminToken, authController.managerregister);

router.post('/userlogin', authController.userlogin);
router.post('/managerlogin', authController.managerlogin);
router.post('/adminlogin', authController.adminlogin);

router.get('/getprojectManager', authMiddleware.verifyAdminManagerUserToken, authController.getProjectManager);
router.get('/getAllmember', authMiddleware.verifyAdminManagerUserToken, authController.getAllMember);
router.get('/adminname',authMiddleware.verifyadminToken, authController.getAdminName);
router.get('/username',authMiddleware.verifyAdminManagerUserToken, authController.getUserName);
router.get('/role',authMiddleware.verifyAdminManagerUserToken, authController.getUserRole);
module.exports = router;


