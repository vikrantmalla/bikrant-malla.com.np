import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { SchemaMessage } from "@/types/enum";

export interface User extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: number;
  verifyToken: string;
  verifyTokenExpiry: number;
}

const userSchema: Schema<User> = new Schema({
  email: {
    type: String,
    required: [true, SchemaMessage.TITLE_IS_REQUIRED],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      SchemaMessage.INVALID_EMAIL,
    ],
  },
  password: {
    type: String,
    required: [true, SchemaMessage.PASSWORD_REQUIRED],
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.models.User || mongoose.model("User", userSchema);
