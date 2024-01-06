import { RequestHandler } from "express";

export interface IListing{
  getListings:RequestHandler;
  filterListings:RequestHandler;
  createListing:RequestHandler ;
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
