import { model, Schema, Document } from 'mongoose'

interface TmdbCacheRecommendationInterface extends Document {
  id?: number,
  recommendations?: [],
}

const TmdbCacheRecommendationSchema = new Schema({
  id: Number,
  recommendations: Array,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: process.env.TMDB_CACHE_REQUEST_SECONDS },
  },
});

export default model<TmdbCacheRecommendationInterface>('TmdbCacheRecommendation', TmdbCacheRecommendationSchema, 'tmdb_cache_recommendations')
