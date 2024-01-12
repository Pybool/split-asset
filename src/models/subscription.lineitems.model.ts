import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubscriptionsLineItemSchema = new Schema({
  subscription: {
    type: mongoose.Schema.Types.Mixed,
    default: "",
    required: true,
  },
  shares: {
    type: Number,
    required: true,
  },
  user:{
    type: String,
    required: false,
    default:'',
  },
  isPaid: {
    type: Boolean,
    default:false,
    required: true,
  },
  fundReceived: {
    type: Number,
    default:0.00,
    required: false,
  },
  proofImages: {
    type: [],
    default: [],
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

SubscriptionsLineItemSchema.pre("save", function (next) {
  this.createdAt = new Date();
  next();
});

const SubscriptionsLineItemsModel = mongoose.model("subscriptions.lineitems", SubscriptionsLineItemSchema);
export default SubscriptionsLineItemsModel;
