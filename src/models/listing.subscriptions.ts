import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubscriptionsSchema = new Schema({
  user: {
    type: String,
    default: "",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.Mixed,
    default: "",
    required: true,
  },
  shares: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

SubscriptionsSchema.pre("save", function (next) {
  this.createdAt = new Date();
  next();
});

const SubscriptionsModel = mongoose.model("subscriptions", SubscriptionsSchema);
export default SubscriptionsModel;
