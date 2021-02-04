import { Document, model, Schema } from 'mongoose';

interface TmdbCacheImageInterface extends Document {
  id?: number;
  language: string;
  images?: [];
}

const TmdbCacheImageSchema = new Schema({
  id: Number,
  language: String,
  images: Array,
  // @TODO Set new time for expire register
  // expiresAt: {
  //   type: Date,
  //   default: Date.now,
  //   expires: 0,
  // },
});

// TmdbCacheImageSchema.index(
//   { expiresAt: 1 },
//   { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_IMAGES) },
// );

export default model<TmdbCacheImageInterface>(
  'TmdbCacheImage',
  TmdbCacheImageSchema,
  'tmdb_cache_images',
);
