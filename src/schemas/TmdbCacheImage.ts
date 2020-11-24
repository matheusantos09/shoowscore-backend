import { Document, model, Schema } from 'mongoose';

interface TmdbCacheImageInterface extends Document {
  id?: number;
  images?: [];
}

const TmdbCacheImageSchema = new Schema({
  id: Number,
  images: Array,
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 0,
  },
});

TmdbCacheImageSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_IMAGES) }
);

export default model<TmdbCacheImageInterface>(
  'TmdbCacheImage',
  TmdbCacheImageSchema,
  'tmdb_cache_images'
);
