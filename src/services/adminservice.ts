import utils from "../helpers/misc";
import Xrequest from "../interfaces/extensions.interface";
import SubscriptionsModel from "../models/listing.subscriptions";
import ListingsModel from "../models/listings.model";
import SubscriptionsLineItemsModel from "../models/subscription.lineitems.model";
import { Types } from "mongoose";

export class AdminService {
  constructor() {}

  async getAssetPercentageFunded(listingObject: any) {
    try {
      let lineItemsOfInterest = [];
      const subscriptions = await SubscriptionsModel.find({
        listing: listingObject._id.toString(),
      });
      for (let subscription of subscriptions) {
        const lineItems = await SubscriptionsLineItemsModel.find({
          subscription: new Types.ObjectId(subscription._id),
          isPaid: true,
        });
        if (lineItems.length > 0) {
          subscription.listing = await ListingsModel.findOne({
            _id: subscription.listing,
          });
          lineItemsOfInterest.push(lineItems);
        }
      }
      const percentageFundedArr = utils.flattenArray(lineItemsOfInterest);
      const totalFundReceived = percentageFundedArr.reduce(
        (accumulator: any, currentValue: any) => {
          return accumulator + (currentValue.fundReceived || 0);
        },
        0
      );

      return (totalFundReceived / listingObject.assetCurrentValue) * 100 || 0.00;
    } catch (error: any) {
      throw error;
    }
  }

  async publishListing(req: Xrequest) {
    try {
      const listingId: string = req.body.listingId;
      let listing: any = await ListingsModel.findById(listingId);
      listing.isApproved = req.body.action === "approve";
      await listing.save();
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  async togglePaymentConfirmation(req: Xrequest) {
    try {
      const sid: any = req.body.sid;
      const action: any = req.body.action;
      const fundReceived: number = req.body.fundReceived;
      let lineItem: any = await SubscriptionsLineItemsModel.findById(sid);
      if (lineItem) {
        lineItem.isPaid = action == "success";
        lineItem.fundReceived = fundReceived;
        await lineItem.save();
        const subsListing: any = await SubscriptionsModel.findOne({
          _id: new Types.ObjectId(lineItem.subscription),
        });
        let listingObject: any = await ListingsModel.findById(
          subsListing.listing
        );
        const percent = await this.getAssetPercentageFunded(listingObject);
        if (action == "success" && percent == 100) {
          listingObject.property = "Funded";
          await listingObject.save();
        }
        if (action == "pend") {
          listingObject.property = "Available";
          await listingObject.save();
        }
        return {
          status: true,
          message: "Payment status has been updated",
        };
      } else {
        return {
          status: false,
          message: "Payment status could not be updated",
        };
      }

    } catch (error: any) {
      throw error;
    }
  }
}
