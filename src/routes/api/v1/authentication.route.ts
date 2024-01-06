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


router.all('/register', handleInvalidMethod);
router.all('/account-type', handleInvalidMethod)
router.all('/issuer-publication', handleInvalidMethod)
router.all('/verify-email-address', handleInvalidMethod);
router.all('/send-phone-otp', handleInvalidMethod)

export default router

