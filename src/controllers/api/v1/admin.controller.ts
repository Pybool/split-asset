import { NextFunction, Request, Response } from 'express';
import { IAdmin } from '../../../interfaces/admin.interface';
import Xrequest from '../../../interfaces/extensions.interface';
import { Authentication } from '../../../services/authservice';
import { AdminService } from '../../../services/adminservice';
import validators from '../../../helpers/validators/validators';
import ListingService from '../../../services/listingservice';
import logger from '../../../logger';

const adminController:IAdmin  = {

  modifyListing :async (req: Request, res: Response)=>{
    try {
      const validation = validators.createListing(JSON.parse(req.body.data))
      if (validation.success){
        const listingService = new ListingService()
        const listing = await listingService.modifyListing(req)
        listing.message = (listing.message === 'trueCommit') ? 'Asset has been updated successfully' : 'Asset failed to be listed';
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

  assignListingShares :async (req: Request, res: Response)=>{
    try {
      if (req.body.shares){
        const listingService = new ListingService()
        const listing = await listingService.assignListingShares(req)
        listing.message = (listing.message === 'trueCommit') ? 'Asset shares added successfully' : 'Asset failed to add shares';
        res.status(200).json({status:listing.status, message: listing.message });
      }
      else{
        res.status(400).json({status:false, message: "No valid share was gotten" });
      }
    } catch (error) {
        logger.error('sharesAddition: ' + error);
        res.status(400).json({ error: 'Internal Server Error' });
    }
  },

    
  publishListing: async (req: Xrequest, res: Response) => {
    try {
      if (req.body.listingId && req.body.listingId!=''){
        const adminService = new AdminService();
        let actionStatus = await adminService.publishListing(req);
        if(!actionStatus) return res.status(200).json({ status: true, message: 'Asset has already been published' });
        const msg = req.body.action === 'approve' ? 'Asset has been successfully listed' : 'Asset has been de-listed';
        return res.status(200).json({ status: true, message: msg });
      }
      else{
        res.status(400).json({status:false, message: "No valid asset identity was gotten" });
      }
    } catch (error:any) {
        logger.error('publishListing: ' + error);
        return res.status(400).json({ status: false, error: error.message });
    }
  },
  
  
  toggleUserAdminStatus: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const authentication = new Authentication(req);
      const result = await authentication.toggleUserAdminStatus();
      if (result) status = 200;
      res.status(status).json(result);

    } catch (error: any) {
      error.status = 422;
      next(error);
    }
  },

  togglePaymentConfirmation: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const adminService = new AdminService();
      const result = await adminService.togglePaymentConfirmation(req);
      if (result) status = 200;
      res.status(status).json(result);

    } catch (error: any) {
      error.status = 422;
      next(error);
    }
  },
}

export default adminController