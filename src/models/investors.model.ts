import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const InvestorSchema = new Schema({
  isActive: {
    type: Boolean,
    default:false
  },
});

const InvestorModel = mongoose.model('investors', InvestorSchema);
export default {InvestorModel,InvestorSchema}