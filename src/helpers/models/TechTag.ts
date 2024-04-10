import mongoose, { Schema, Document } from "mongoose";

export interface TechTag extends Document {
  tag: string;
}

const TechTagSchema: Schema<TechTag>  = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  }
});

export default mongoose.models.TechTags ||
  mongoose.model("TechTags", TechTagSchema);
