import Xrequest from "../interfaces/extensions.interface";
import ListingsModel from "../models/listings.model";

export class AdminService {
  constructor() {}

  async publishListing(req:Xrequest){
    try{
        const listingId:string = req.body.listingId
        let listing:any = await ListingsModel.findById(listingId);
        listing.isApproved = req.body.action==='approve';
        await listing.save()
        return true;

    }catch(error:any){
        throw error
    }
  }

}
