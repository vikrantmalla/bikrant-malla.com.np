import mongoose from "mongoose";

const ContactDetailsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  ctaMessage: {
    type: String,
    required: true,
  },
  emailUrl: {
    type: String,
    required: true,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  behanceUrl: {
    type: String,
    required: true,
  },
  linkedinUrl: {
    type: String,
    required: true,
  },
  twitterUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactDetailsSchema);
