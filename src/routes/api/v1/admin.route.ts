import express from 'express';
const router = express.Router();
import { decode, ensureAdmin } from '../../../middlewares/jwt';
import { handleInvalidMethod } from '../../../middlewares/invalidrequest'
import adminController from '../../../controllers/api/v1/admin.controller';
import ListingService from '../../../services/listingservice';
const listingService = new ListingService()

router.patch('/user-priviledge',decode, ensureAdmin, adminController.toggleUserAdminStatus)
router.patch('/split-asset/publish-asset-listing', decode, ensureAdmin,  adminController.publishListing)
router.put('/split-asset/modify-listing' , listingService.arraifyUploads(true), adminController.modifyListing);
router.patch('/split-asset/update-listing-shares' , adminController.assignListingShares);
router.patch('/split-asset/update-share-payment' , adminController.togglePaymentConfirmation);


router.all('/user-priviledge', handleInvalidMethod);
router.all('/publish-asset-listing',  handleInvalidMethod);
router.all('/split-asset/modify-listing', handleInvalidMethod);
router.all('/split-asset/update-listing-shares', handleInvalidMethod);
router.all('/split-asset/update-share-payment', handleInvalidMethod)
export default router

