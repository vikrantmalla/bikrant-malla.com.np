import { SchemaMessage } from "@/types/enum";
import mongoose, { Schema, Document } from "mongoose";

export interface AboutMeDetail extends Document {
  title: string;
  jobTitle: string;
  subTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  skill1: string[];
  skill2: string[];
}

const AboutMeDetailsSchema: Schema<AboutMeDetail> = new Schema({
  title: {
    type: String,
    required: [true, SchemaMessage.TITLE_IS_REQUIRED],
  },
  jobTitle: {
    type: String,
    required: [true, SchemaMessage.JOB_TITLE_IS_REQUIRED],
  },
  subTitle: {
    type: String,
    required: [true, SchemaMessage.SUB_TITLE_IS_REQUIRED],
  },
  aboutDescription1: {
    type: String,
    required: [true, SchemaMessage.ABOUT_DESCRIPTION_IS_REQUIRED],
  },
  aboutDescription2: {
    type: String,
    required: [true, SchemaMessage.ABOUT_DESCRIPTION_IS_REQUIRED],
  },
  skill1: {
    type: [String],
    required: [true, SchemaMessage.SKILL_REQUIRED],
  },
  skill2: {
    type: [String],
    required: [true, SchemaMessage.SKILL_REQUIRED],
  },
});

export default mongoose.models.Aboutme ||
  mongoose.model("Aboutme", AboutMeDetailsSchema);
