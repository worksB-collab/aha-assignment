const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/verify-email', authController.verifyEmail);
router.get('/resend-email', authController.resendEmail);
router.get('/logout', authController.logout);
router.get('/get-profile', authController.getProfile);
router.put('/update-username', authController.updateUsername);
router.put('/reset-password', authController.resetPassword);
router.get('/get-all-users', authController.getAllUsers);
router.get('/get-statistics', authController.getStatistics);

// Google OAuth
router.get('/google', authController.googleSignIn, authController.onGoogleSignInSuccessful);
router.get('/google/callback', authController.googleCallback, authController.redirectGoogleUserToDashboard);
router.get('/google/logout', authController.googleLogout);

module.exports = router;
