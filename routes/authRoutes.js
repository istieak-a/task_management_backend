const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/userregister', authMiddleware.verifyadminToken,authController.userregister);
router.post('/adminregister', authController.adminregister);
router.post('/managerregister',authMiddleware.verifyadminToken, authController.managerregister);

router.post('/userlogin', authController.userlogin);
router.post('/managerlogin', authController.managerlogin);
router.post('/adminlogin', authController.adminlogin);


module.exports = router;


