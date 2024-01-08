import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BookmarksSchema = new Schema({
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
  createdAt: {
    type: Date,
    required: false,
  },
});

BookmarksSchema.pre("save", function (next) {
  this.createdAt = new Date();
  next();
});

const BookmarksModel = mongoose.model("bookmarks", BookmarksSchema);

export default BookmarksModel;
