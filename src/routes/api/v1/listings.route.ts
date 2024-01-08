import express from 'express';
import { decode } from '../../../middlewares/jwt';
import { handleInvalidMethod } from '../../../middlewares/invalidrequest'
import ListingService from '../../../services/listingservice';
import listingControllers from '../../../controllers/api/v1/listings.controller';
import { oneMinlimiter, twoMinlimiter } from '../../../middlewares/ratelimit';

const router = express.Router();
const listingService = new ListingService();

router.post('/split-asset/listing',twoMinlimiter , listingService.arraifyUploads(), listingControllers.createListing);
router.get('/split-asset/listing' , decode, listingControllers.getListings);
router.get('/split-asset/anonymous-user-listing' , listingControllers.getListings);
router.post('/split-asset/filterlisting' , listingControllers.filterListings);
router.post('/split-asset/listing-subscriptions' ,decode, listingControllers.getListingSubscriptionsByAssetId);
router.get('/split-asset/user-listing-subscriptions' ,decode, listingControllers.getListingSubscriptionsByUserId);
router.post('/split-asset/listing-addsubscriber' , decode, listingControllers.addListingSubscriber);
router.post('/split-asset/listing-removesubscriber' , decode, listingControllers.removeListingSubscriber);
router.get('/split-asset/listing-getavailable-shares' , listingControllers.getSharesLeft);
router.post('/split-asset/bookmark-listing' ,decode, listingControllers.bookMarkListing);
router.get('/split-asset/profile-bookmarks' ,decode, listingControllers.getBookMarksByUserId);



router.all('/split-asset/listing', handleInvalidMethod);
router.all('/split-asset/filterlisting' , handleInvalidMethod);
router.all('/split-asset/listing-subscriptions' , handleInvalidMethod);
router.all('/split-asset/listing-addsubscriber');
router.all('/split-asset/listing-removesubscriber');
router.all('/split-asset/bookmark-listing');
router.all('/split-asset/profile-bookmarks')

export default router

