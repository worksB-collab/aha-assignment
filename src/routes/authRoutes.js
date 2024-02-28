const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/verify-email', authController.verifyEmail);
router.get('/logout', authController.logout);

// Google OAuth
router.get('/google', authController.googleSignIn);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
