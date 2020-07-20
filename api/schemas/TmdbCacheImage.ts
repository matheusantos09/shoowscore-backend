import { model, Schema, Document } from 'mongoose'

interface TmdbCacheImageInterface extends Document {
  id?: number,
  imagess?: [],
}

const TmdbCacheImageSchema = new Schema({
  id: Number,
  imagess: Array,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: process.env.TMDB_CACHE_REQUEST_SECONDS },
  },
});

export default model<TmdbCacheImageInterface>('TmdbCacheImage', TmdbCacheImageSchema, 'tmdb_cache_images')
