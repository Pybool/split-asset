import express from 'express';
import { decode } from '../../../middlewares/jwt';
import { handleInvalidMethod } from '../../../middlewares/invalidrequest'
import ListingService from '../../../services/listingservice';
import listingControllers from '../../../controllers/api/v1/listings.controller';
import { oneMinlimiter, twoMinlimiter } from '../../../middlewares/ratelimit';

const router = express.Router();
const listingService = new ListingService();

router.post('/split-asset/listing' , listingService.arraifyUploads(true), listingControllers.createListing);
router.get('/split-asset/listing' , decode, listingControllers.getListings);
router.get('/split-asset/anonymous-user-listing' , listingControllers.getListings);
router.post('/split-asset/filterlisting' , listingControllers.filterListings);
router.get('/split-asset/search-by-text' , listingControllers.searchByText);
router.get('/split-asset/listing-by-id', listingControllers.getListingById);



router.post('/split-asset/listing-subscriptions' ,decode, listingControllers.getListingSubscriptionsByAssetId);
router.get('/split-asset/user-listing-subscriptions' ,decode, listingControllers.getListingSubscriptionsByUserId);
router.get('/split-asset/user-listing-subscriptions-lineitems' ,decode, listingControllers.getSubscriptionsLineItemsByListingId);
router.post('/split-asset/listing-addsubscriber' , decode, listingControllers.addListingSubscriber);
router.post('/split-asset/listing-removesubscriber' , decode, listingControllers.removeListingSubscriber);
router.get('/split-asset/listing-getavailable-shares' , listingControllers.getSharesLeft);
router.post('/split-asset/bookmark-listing' ,decode, listingControllers.bookMarkListing);
router.get('/split-asset/profile-bookmarks' ,decode, listingControllers.getBookMarksByUserId);
router.post('/split-asset/subscription-lineitem-uploadproof' , listingService.arraifyUploads(false), listingControllers.uploadPaymentProof);
router.get('/split-asset/percentage-funding' , listingControllers.getAssetPercentageFunded);




router.all('/split-asset/listing', handleInvalidMethod);
router.all('/split-asset/filterlisting' , handleInvalidMethod);
router.all('/split-asset/listing-subscriptions' , handleInvalidMethod);
router.all('/split-asset/user-listing-subscriptions-lineitems');
router.all('/split-asset/search-by-text' , handleInvalidMethod);
router.all('/split-asset/listing-addsubscriber', handleInvalidMethod);
router.all('/split-asset/listing-removesubscriber', handleInvalidMethod);
router.all('/split-asset/bookmark-listing', handleInvalidMethod);
router.all('/split-asset/profile-bookmarks', handleInvalidMethod);
router.all('/split-asset/subscription-lineitem-uploadproof', handleInvalidMethod);
router.all('/split-asset/listing-by-id', handleInvalidMethod)


export default router

