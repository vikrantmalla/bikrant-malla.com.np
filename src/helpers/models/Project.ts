import mongoose, { model } from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  isnew: {
    type: Boolean,
    required: true,
  },
  projectview: {
    type: String,
    required: true,
  },
  viewcode: {
    type: String,
    required: true,
  },
  build: {
    type: [String],
    required: true,
  },
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
