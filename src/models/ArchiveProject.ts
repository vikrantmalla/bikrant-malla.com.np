import { SchemaMessage } from "@/types/enum";
import mongoose, { Schema, Document } from "mongoose";

export interface ArchiveProjects extends Document {
  title: string;
  subTitle: string;
  images: string;
  alt: string;
  projectView: string;
  build: string[];
  year: number;
  isnew: boolean;
  viewCode: string;
}
const ArchiveProjectsSchema: Schema<ArchiveProjects> = new Schema({
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
  projectView: {
    type: String,
    required: [true, SchemaMessage.PROJECTVIEW_IS_REQUIRED],
  },
  viewCode: {
    type: String,
    required: [true, SchemaMessage.VIEWCODE_IS_REQUIRED],
  },
  build: {
    type: [String],
    required: [true, SchemaMessage.TOOLS_ARE_REQUIRED],
  },
});

export default mongoose.models.ArchiveProject ||
  mongoose.model("ArchiveProject", ArchiveProjectsSchema);
