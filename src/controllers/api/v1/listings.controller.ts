import logger from '../../../logger';
import { Request, Response } from 'express';
import ListingService from '../../../services/listingservice';
import {IListing} from '../../../interfaces/listing.interface';
import utils from '../../../helpers/misc';
import validators from '../../../helpers/validators/validators';
import Xrequest from '../../../interfaces/extensions.interface';

const listingControllers:IListing = {

  getListings: async (req:Xrequest, res:Response) => {
    try {
      const listingService = new ListingService()
        return res.status(200).json(await listingService.getListings(req)); 
    } catch (error) {
      return res.status(400).json({ status: false, error: error })
    }
  },

  filterListings: async (req:Xrequest, res:Response) => {
    try {
      const listingService = new ListingService()
        return res.status(200).json(await listingService.filterListings(req)); 
    } catch (error) {
      return res.status(400).json({ status: false, error: error })
    }
  },

  createListing :async (req: Request, res: Response)=>{
    try {
      const validation = validators.createListing(JSON.parse(req.body.data))
      if (validation.success){
        const listingService = new ListingService()
        const listing = await listingService.createListing(req)
        listing.message = (listing.message === 'trueCommit') ? 'Asset has been listed successfully' : 'Asset failed to be listed';
        res.status(200).json({status:listing.status, message: listing.message });
      }
      else{
        res.status(400).json({status:false, message: validation.error });
      }
    } catch (error) {
        logger.error('createListing: ' + error);
        res.status(400).json({ error: 'Internal Server Error' });
    }
  },
}

export default listingControllers;