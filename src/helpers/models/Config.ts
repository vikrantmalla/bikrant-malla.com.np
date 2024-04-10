import mongoose, { Schema, Document } from "mongoose";

export interface Config extends Document {
  allowSignUp: boolean;
}

const ConfigSchema: Schema<Config> = new Schema({
  allowSignUp: {
    type: Boolean,
    required: true,
  }
});

export default mongoose.models.Config ||
  mongoose.model("Config", ConfigSchema);
