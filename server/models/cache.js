import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  answer: {
    type: String,
    required: true,
  },

  embedding: {
    type: [Number],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Cache = mongoose.model("Cache", cacheSchema);