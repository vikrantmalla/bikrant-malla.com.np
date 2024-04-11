import { SchemaMessage } from "@/types/enum";
import mongoose, { Schema, Document } from "mongoose";

export interface BehanceHighlight extends Document {
  title: string;
  subTitle: string;
  images: string;
  alt: string;
  projectview: string;
  tools: string[];
}

const BehanceHighlightSchema: Schema<BehanceHighlight> = new Schema({
  title: {
    type: String,
    required: [true, SchemaMessage.TITLE_IS_REQUIRED],
  },
  subTitle: {
    type: String,
    required: [true, SchemaMessage.SUB_TITLE_IS_REQUIRED],
  },
  images: {
    type: String,
    required: [true, SchemaMessage.IMAGE_IS_REQUIRED],
  },
  alt: {
    type: String,
    required: [true, SchemaMessage.ALT_IS_REQUIRED],
  },
  tools: {
    type: [String],
    required: [true, SchemaMessage.TOOLS_ARE_REQUIRED],
  },
  projectview: {
    type: String,
    required: [true, SchemaMessage.PROJECTVIEW_IS_REQUIRED],
  },
});

export default mongoose.models.Behance ||
  mongoose.model("Behance", BehanceHighlightSchema);
