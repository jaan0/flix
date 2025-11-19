import mongoose from "mongoose";

const movieRequestSchema = new mongoose.Schema(
  {
    movieTitle: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    releaseYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 5,
    },
    directorActors: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    notifyWhenAvailable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for searching
movieRequestSchema.index({ movieTitle: "text", directorActors: "text" });

export default mongoose.models.MovieRequest ||
  mongoose.model("MovieRequest", movieRequestSchema);
