import express from 'express';
import { decode } from '../../../middlewares/jwt';
import { handleInvalidMethod } from '../../../middlewares/invalidrequest'
import ListingService from '../../../services/listingservice';
import listingControllers from '../../../controllers/api/v1/listings.controller';
import { oneMinlimiter, twoMinlimiter } from '../../../middlewares/ratelimit';

const router = express.Router();
const listingService = new ListingService()

router.post('/split-asset/listing',twoMinlimiter , listingService.arraifyUploads(), listingControllers.createListing);
router.get('/split-asset/listing' , listingControllers.getListings);
router.post('/split-asset/filterlisting' , listingControllers.filterListings);

router.all('/split-asset/listing', handleInvalidMethod);
router.all('/split-asset/filterlisting' , handleInvalidMethod);

export default router

