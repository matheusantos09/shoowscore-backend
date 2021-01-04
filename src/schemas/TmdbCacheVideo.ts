import { Document, model, Schema } from 'mongoose';

interface TmdbCacheVideoInterface extends Document {
  id?: number;
  language: string;
  videos?: [];
}

const TmdbCacheVideoSchema = new Schema({
  id: Number,
  language: String,
  videos: Array,
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 0,
  },
});

TmdbCacheVideoSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_VIDEOS) },
);

export default model<TmdbCacheVideoInterface>(
  'TmdbCacheVideo',
  TmdbCacheVideoSchema,
  'tmdb_cache_videos',
);
