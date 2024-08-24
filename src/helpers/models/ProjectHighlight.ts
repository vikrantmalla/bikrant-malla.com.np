import { SchemaMessage } from "@/types/enum";
import mongoose, { Schema, Document } from "mongoose";

export interface ProjectHighlight extends Document {
  title: string;
  subTitle: string;
  images: string;
  imageUrl: string;
  alt: string;
  projectview: string;
  build: string[];
}

const ProjectHighlightSchema: Schema<ProjectHighlight> = new Schema({
  title: {
    type: String,
    required: [true, SchemaMessage.TITLE_IS_REQUIRED],
  },
  images: {
    type: String,
    required: [true, SchemaMessage.IMAGE_IS_REQUIRED],
  },
  imageUrl: {
    type: String,
    required: [true, SchemaMessage.IMAGE_IS_REQUIRED],
  },
  alt: {
    type: String,
    required: [true, SchemaMessage.ALT_IS_REQUIRED],
  },
  projectview: {
    type: String,
    required: [true, SchemaMessage.PROJECTVIEW_IS_REQUIRED],
  },
  build: {
    type: [String],
    required: [true, SchemaMessage.TOOLS_ARE_REQUIRED],
  },
});

export default mongoose.models.Projecthighlights ||
  mongoose.model("Projecthighlights", ProjectHighlightSchema);
