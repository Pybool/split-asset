import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  emailOtp: {
    type: Number,
    required: false,
  },
  phoneOtp: {
    type: Number,
    required: false,
  },
  emailOtpExpires: {
    type: Date,
    required: false,
  },
  phoneOtpExpires: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


OtpSchema.methods.isOtpValid = function (type:string, otpCode:number) {
  const now = new Date();
  const otpField = type === "email" ? "emailOtp" : "phoneOtp";
  const expiresField = type === "email" ? "emailOtpExpires" : "phoneOtpExpires";
  return (
    this[otpField].toString() === otpCode.toString() &&
    now < new Date(this[expiresField])
  );
};

const Otp = mongoose.model("otp", OtpSchema);
export default Otp;
