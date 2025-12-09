const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getLoginForm);
router.post('/', authController.postLogin);

router.get('/register', authController.getRegisterForm);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;
