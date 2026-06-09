const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/authController');

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.get('/me', auth, controller.me);

module.exports = router;
