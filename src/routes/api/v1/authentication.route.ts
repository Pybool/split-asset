import express from 'express';
const router = express.Router();
import { handleInvalidMethod } from '../../../middlewares/invalidrequest'
import { decode, ensureAdmin } from '../../../middlewares/jwt';
import { oneMinlimiter, twoMinlimiter } from '../../../middlewares/ratelimit';
import authController from '../../../controllers/api/v1/authentication.controller';

router.post('/login', authController.login)
router.post('/register', authController.register)
router.patch('/account-type', authController.changeUserAccountType)
router.patch('/issuer-publication', authController.changePublicationVisibility)
router.patch('/verify-email-address', authController.verifyEmail)
router.patch('/verify-phone-number', authController.verifyPhone) 
router.get('/send-phone-otp', authController.sendPhoneOtp)
// router.post('/resend-email-verification', authController.resendEmailConfirmation)
// router.post('/send-reset-password-link', authController.sendPasswordResetLink)
// router.post('/reset-password', authController.resetPassword)
router.post('/refresh-token', authController.getRefreshToken)
// router.get('/user-profile', decode, authController.getUserProfile)
router.put('/user-profile', decode, authController.saveUserProfile)
// router.get('/authorize', passport.authenticate("facebook"))





router.all('/register', handleInvalidMethod);
router.all('/account-type', handleInvalidMethod)
router.all('/issuer-publication', handleInvalidMethod)
router.all('/verify-email-address', handleInvalidMethod);
router.all('/send-phone-otp', handleInvalidMethod)

// router.all('/resend-email-verification', handleInvalidMethod);
// router.all('/send-reset-password-link', handleInvalidMethod);
// router.all('/reset-password', handleInvalidMethod);
router.all('/login', handleInvalidMethod);
router.all('/refresh-token', handleInvalidMethod);
router.all('/user-profile', handleInvalidMethod);
// router.all('/user-profile', handleInvalidMethod);
export default router

