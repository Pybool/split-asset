import mongoose from "mongoose";
import constants from "./constants";
import InvestorEntity from "./investors.model";
const Schema = mongoose.Schema;

const ListingsSchema = new Schema({
  listedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  phone: {
    type: String,
    default: "",
    required: true,
  },
  email: {
    type: String,
    default: "",
    required: true,
  },
  fullName: {
    type: String,
    default: "",
    required: false,
  },
  firstName: {
    type: String,
    default: "",
    required: false,
  },
  lastName: {
    type: String,
    default: "",
    required: false,
  },
  buildingType: {
    type: String,
    default: "",
    required: false,
    enum: constants.listingsConstants.BUILDING_TYPES,
  },
  salePortion: {
    type: String,
    default: "",
    required: false,
    enum: constants.listingsConstants.SALE_PORTIONS,
  },
  occupancyStatus: {
    type: String,
    default: "",
    required: false,
    enum: constants.listingsConstants.OCCUPANCY_STATUS,
  },
  shares: {
    type: String,
    default: "",
    required: false,
    enum: constants.sharesConstants,
  },
  assetImages: {
    type: [],
    default: [],
    required: false,
  },
  companyPropertyManagement: {
    type: String,
    default: "",
    required: true,
    enum: constants.listingsConstants.PROPERTY_MANAGEMENT,
  },
  propertyOwnership: {
    type: String,
    default: "",
    required: true,
    enum: constants.listingsConstants.PROPERTY_OWNERSHIP,
  },
  propertyCondition: {
    type: String,
    default: "",
    required: true,
    enum: constants.listingsConstants.PROPERTY_CONDITION,
  },
  location: {
    type: String,
    required: true,
    enum: constants.listingsFilterConstants.LOCATION,
  },
  bedType: {
    type: String,
    required: false,
    enum: constants.listingsFilterConstants.TYPE,
  },
  property: {
    type: String,
    required: false,
    enum: constants.listingsFilterConstants.PROPERTY,
  },
  locationTag: {
    type: String,
    default: "",
    required: false,
  },
  descriptionTag: {
    type: String,
    default: "",
    required: false,
  },
  fullAddress: {
    type: String,
    default: "",
    required: true,
  },
  assetCurrentValue: {
    type: Number,
    default: 0.0,
    required: false,
  },
  totalTokens: {
    type: Number,
    default: 200,
    required: false,
  },
  consumedTokens: {
    type: Number,
    default: 0,
    required: false,
  },
  annualizedReturns: {
    type: Number,
    default: 0,
    required: false,
  },
  annualAppreciation: {
    type: Number,
    default: 0,
    required: false,
  },
  projectedGrossYield: {
    type: Number,
    default: 0,
    required: false,
  },
  projectedNetYield: {
    type: Number,
    default: 0,
    required: false,
  },
  daysLeft: {
    type: Number,
    default: 0,
    required: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
    required: true,
  },
  approvalTime: {
    type: Date,
    default: "",
    required: false,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  investors: [InvestorEntity.InvestorSchema],
});

ListingsSchema.post("save", async function (doc) {
  try {
    const newRecord = doc.toObject();
  } catch (error) {
    console.error("Error sending WebSocket message:", error);
  }
});

const ListingsModel = mongoose.model("listings", ListingsSchema);

export default ListingsModel;
