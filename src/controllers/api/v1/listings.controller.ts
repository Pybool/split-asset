import logger from "../../../logger";
import { Request, Response } from "express";
import ListingService from "../../../services/listingservice";
import { IListing } from "../../../interfaces/listing.interface";
import validators from "../../../helpers/validators/validators";
import Xrequest from "../../../interfaces/extensions.interface";
import validations from "../../../helpers/validators/joiAuthValidators";

const listingControllers: IListing = {
  getListings: async (req: Xrequest, res: Response) => {
    try {
      const listingService = new ListingService();
      return res.status(200).json(await listingService.getListings(req));
    } catch (error) {
      return res.status(400).json({ status: false, error: error });
    }
  },

  filterListings: async (req: Xrequest, res: Response) => {
    try {
      const listingService = new ListingService();
      return res.status(200).json(await listingService.filterListings(req));
    } catch (error) {
      return res.status(400).json({ status: false, error: error });
    }
  },

  getListingById: async (req: Xrequest, res: Response) => {
    try {
      const listingService = new ListingService();
      const percentageFunding = await listingService.getAssetPercentageFunded(req);
      let result:any = await listingService.getListingById(req)
      result.percentageFunded = percentageFunding
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ status: false, error: error });
    }
  },

  searchByText: async (req: Xrequest, res: Response) => {
    try {
      const listingService = new ListingService();
      return res.status(200).json(await listingService.searchByText(req));
    } catch (error) {
      return res.status(400).json({ status: false, error: error });
    }
  },

  createListing: async (req: Xrequest, res: Response) => {
    try {
      const validation = validators.createListing(JSON.parse(req.body.data));
      if (validation.success) {
        const listingService = new ListingService();
        const listing = await listingService.createListing(req);
        listing.message =
          listing.message === "trueCommit"
            ? "Asset has been listed successfully"
            : "Asset failed to be listed";
        res
          .status(200)
          .json({ status: listing.status, message: listing.message });
      } else {
        res.status(400).json({ status: false, message: validation.error });
      }
    } catch (error) {
      logger.error("createListing: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  getListingSubscriptionsByAssetId: async (req: Request, res: Response) => {
    try {
      if (req.body.listing && req.body.listing != "") {
        const listingService = new ListingService();
        const subscriptions =
          await listingService.getListingSubscriptionsByAssetId(req);
        res.status(200).json(subscriptions);
      } else {
        res
          .status(400)
          .json({ status: false, message: "No valid asset id was provided" });
      }
    } catch (error) {
      logger.error("getSubscriptions: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  getListingSubscriptionsByUserId: async (req: Request, res: Response) => {
    try {
      const listingService = new ListingService();
      const subscriptions =
        await listingService.getListingSubscriptionsByUserId(req);
      res.status(200).json(subscriptions);
    } catch (error) {
      logger.error("getSubscriptions: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  getSubscriptionsLineItemsByListingId:async (req: Request, res: Response) => {
    try {
      const listingService = new ListingService();
      const subscriptions =
        await listingService.getSubscriptionsLineItemsByListingId(req);
      res.status(200).json(subscriptions);
    } catch (error) {
      logger.error("getSubscriptionsLineItems: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  uploadPaymentProof:async (req: Request, res: Response) => {
    try {
      const listingService = new ListingService();
      const result =
        await listingService.uploadPaymentProof(req);
      res.status(200).json(result);
    } catch (error) {
      logger.error("uploadPaymentProof: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  addListingSubscriber: async (req: Request, res: Response) => {
    try {
      if (req.body.listing && req.body.listing != "" && req.body.shares != 0) {
        const listingService = new ListingService();
        const result = await listingService.addListingSubscriber(req);
        res.status(200).json(result);
      } else {
        res
          .status(200)
          .json({
            status: false,
            message: "No valid assetid/shares was provided",
          });
      }
    } catch (error) {
      logger.error("addSubscriber: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  removeListingSubscriber: async (req: Request, res: Response) => {
    try {
      if (req.body.listing && req.body.listing != "") {
        const listingService = new ListingService();
        const result = await listingService.removeListingSubscriber(req);
        res.status(200).json(result);
      } else {
        res
          .status(400)
          .json({ status: false, message: "No valid asset id was provided" });
      }
    } catch (error) {
      logger.error("removeSubscribers: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  getSharesLeft: async (req: Request, res: Response) => {
    try {
      const listingId: any = req.query.id;
      if (listingId && listingId != "") {
        const listingService = new ListingService();
        const result = await listingService.getAssetSharesLeft(listingId);
        res.status(200).json(result);
      } else {
        res
          .status(400)
          .json({ status: false, message: "No valid asset id was provided" });
      }
    } catch (error) {
      logger.error("removeSubscribers: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  bookMarkListing: async (req: Request, res: Response) => {
    try {
      // Validate request body using Joi validation
      const validation = await validators.bookmarkListing.validateAsync(
        req.body
      );
      console.log(1, validation);

      if (validation.listing) {
        // Valid listing, proceed with bookmarking
        const listingService = new ListingService();
        const result = await listingService.bookMarkListing(req, validation);

        // Update result message for better clarity
        if (result.message === "trueCommit") {
          result.message = "Asset has been bookmarked successfully";
        } else if (result.message === "exists") {
          result.message = "You have already bookmarked this asset";
        } else if (result.message === "notFound") {
          result.message = "No asset was found for this identity";
        }

        // Send response based on the result
        res
          .status(200)
          .json({ status: result.status, message: result.message });
      } else {
        res.status(400).json({ status: false, message: validation.error });
      }
    } catch (error) {
      // Handle unexpected errors
      logger.error("createListing: " + error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getBookMarksByUserId: async (req: Request, res: Response) => {
    try {
      const listingService = new ListingService();
      const subscriptions =
        await listingService.getBookMarksByUserId(req);
      res.status(200).json(subscriptions);
    } catch (error) {
      logger.error("getSubscriptions: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },

  getAssetPercentageFunded: async (req: Request, res: Response) => {
    try {
      const listingService = new ListingService();
      const percentageFunding = await listingService.getAssetPercentageFunded(req);
      res.status(200).json(percentageFunding);
    } catch (error) {
      logger.error("getPercentageFunding: " + error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  },
};

export default listingControllers;
