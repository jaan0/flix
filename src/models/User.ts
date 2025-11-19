import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'expired';
    startDate: Date;
    endDate: Date;
  };
  watchHistory: {
    movieId: string;
    watchedAt: Date;
    progress: number; // percentage watched
  }[];
  favorites: string[]; // movie IDs
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscription: {
      plan: { type: String, default: 'free' },
      status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
      startDate: { type: Date },
      endDate: { type: Date },
    },
    watchHistory: [
      {
        movieId: { type: String },
        watchedAt: { type: Date },
        progress: { type: Number, default: 0 },
      },
    ],
    favorites: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
