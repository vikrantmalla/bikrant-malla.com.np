import { SchemaMessage } from "@/types/enum";
import mongoose, { Schema, Document } from "mongoose";

export interface ProjectHighlight extends Document {
  title: string;
  subTitle: string;
  images: string;
  alt: string;
  projectview: string;
  build: string[];
}

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, SchemaMessage.TITLE_IS_REQUIRED],
  },
  year: {
    type: Number,
    required: [true, SchemaMessage.YEAR_IS_REQUIRED],
  },
  isnew: {
    type: Boolean,
    required: [true, SchemaMessage.ISNEW_IS_REQUIRED],
  },
  projectview: {
    type: String,
    required: [true, SchemaMessage.PROJECTVIEW_IS_REQUIRED],
  },
  viewcode: {
    type: String,
    required: [true, SchemaMessage.VIEWCODE_IS_REQUIRED],
  },
  build: {
    type: [String],
    required: [true, SchemaMessage.TOOLS_ARE_REQUIRED],
  },
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
