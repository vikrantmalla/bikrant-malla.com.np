import mongoose from "mongoose";

const MetatagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pageTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  fbID: {
    type: String,
    required: true,
  },
  twitterID: {
    type: String,
    required: true,
  },
  googleSiteID: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Metatag ||
  mongoose.model("Metatag", MetatagSchema);
