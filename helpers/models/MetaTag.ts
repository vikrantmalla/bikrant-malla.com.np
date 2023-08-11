import mongoose from "mongoose";

const MetatagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
});

export default mongoose.models.Metatag ||
  mongoose.model("MetaTag", MetatagSchema);
