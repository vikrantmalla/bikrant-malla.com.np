import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  allowSignUp: {
    type: Boolean,
    required: true,
  }
});

export default mongoose.models.Config ||
  mongoose.model("Config", ConfigSchema);
