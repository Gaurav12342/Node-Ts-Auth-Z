import mongoose from "mongoose";

const refreshTokenModal = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export const RefreshToken = mongoose.model(
  "Refresh-Token",
  refreshTokenModal
);
