import mongoose, { Schema, models } from 'mongoose';

export interface IWatchParty {
  _id: string;
  name: string;
  movieId: string;
  hostId: string;
  password?: string;
  partyCode: string;
  currentTime: number;
  isPlaying: boolean;
  participants: {
    userId: string;
    username: string;
    joinedAt: Date;
  }[];
  messages: {
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  expiresAt: Date;
}

const WatchPartySchema = new Schema<IWatchParty>(
  {
    name: { type: String, required: true },
    movieId: { type: String, required: true },
    hostId: { type: String, required: true },
    password: { type: String },
    partyCode: { type: String, required: true, unique: true },
    currentTime: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    participants: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    messages: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired parties
WatchPartySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const WatchParty = models.WatchParty || mongoose.model<IWatchParty>('WatchParty', WatchPartySchema);

export default WatchParty;
