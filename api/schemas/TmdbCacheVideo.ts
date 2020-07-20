import { model, Schema, Document } from 'mongoose'

interface TmdbCacheVideoInterface extends Document {
  id?: number,
  videos?: [],
}

const TmdbCacheVideoSchema = new Schema({
  id: Number,
  videos: Array,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: process.env.TMDB_CACHE_REQUEST_SECONDS },
  },
});

export default model<TmdbCacheVideoInterface>('TmdbCacheVideo', TmdbCacheVideoSchema, 'tmdb_cache_videos')
