import mongoose, { Schema, Document } from "mongoose";

export interface Config extends Document {
  allowBackupImages: boolean
}

const ConfigSchema: Schema<Config> = new Schema({
  allowBackupImages: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.models.Config ||
  mongoose.model("Config", ConfigSchema);
