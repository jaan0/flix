import mongoose, { Schema, models } from 'mongoose';

export interface IMovie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  genre: string[];
  rating: number;
  year: number;
  duration: number; // in minutes
  cast: string[];
  director: string;
  language: string;
  quality: string; // HD, 4K, etc.
  views: number;
  featured: boolean;
  comingSoon: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    posterUrl: { type: String, required: true },
    trailerUrl: { type: String },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    genre: [{ type: String, required: true }],
    rating: { type: Number, default: 0, min: 0, max: 10 },
    year: { type: Number, required: true },
    duration: { type: Number, required: true },
    cast: [{ type: String }],
    director: { type: String, required: true },
    language: { type: String, required: true },
    quality: { type: String, default: 'HD' },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    comingSoon: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
MovieSchema.index({ title: 'text', description: 'text' });
MovieSchema.index({ genre: 1 });
MovieSchema.index({ featured: 1 });
MovieSchema.index({ views: -1 });

const Movie = models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);

export default Movie;
