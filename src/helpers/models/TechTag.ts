import mongoose from "mongoose";

const TechTagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  }
});

export default mongoose.models.TechTags ||
  mongoose.model("TechTags", TechTagSchema);
