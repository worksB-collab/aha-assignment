const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/verify-email', authController.verifyEmail);
router.get('/resend-email', authController.resendEmail);
router.get('/logout', authController.logout);
router.get('/get-profile', authController.getProfile);
router.post('/update-username', authController.updateUsername);

// Google OAuth
router.get('/google', authController.googleSignIn);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
