import { RequestHandler } from "express";

export interface IListing{
  searchByText:RequestHandler;
  getListings:RequestHandler;
  getListingById: RequestHandler;
  filterListings:RequestHandler;
  createListing:RequestHandler ;
  getListingSubscriptionsByAssetId: RequestHandler;
  addListingSubscriber:RequestHandler;
  removeListingSubscriber:RequestHandler;
  getSharesLeft: RequestHandler;
  bookMarkListing:RequestHandler;
  getListingSubscriptionsByUserId:RequestHandler;
  getBookMarksByUserId:RequestHandler;
  getSubscriptionsLineItemsByListingId: RequestHandler;
  uploadPaymentProof:RequestHandler;
  getAssetPercentageFunded: RequestHandler;
  
}
export interface ICreateListing{
  email:string;
  phone: string;
  fullName: string;
  buildingType:string;
  salePortion:string;
  propertyCondition:string;
  occupancyStatus:string;
  companyPropertyManagement:string;
  propertyOwnership:string;
  assetImages: string[];
}
export interface ValidationStatus {
  status: boolean;
  error: string;
}
