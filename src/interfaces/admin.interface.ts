import { RequestHandler } from "express";

export interface IAdmin {
  modifyListing:RequestHandler;
  assignListingShares: RequestHandler;
  publishListing:RequestHandler;
  toggleUserAdminStatus: RequestHandler;
}
