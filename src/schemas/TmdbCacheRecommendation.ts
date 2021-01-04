import { Document, model, Schema } from 'mongoose';

interface TmdbCacheRecommendationInterface extends Document {
  id?: number;
  language: string;
  recommendations?: [];
}

const TmdbCacheRecommendationSchema = new Schema({
  id: Number,
  language: String,
  recommendations: Array,
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 0,
  },
});

TmdbCacheRecommendationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_RECOMMENDATIONS),
  },
);

export default model<TmdbCacheRecommendationInterface>(
  'TmdbCacheRecommendation',
  TmdbCacheRecommendationSchema,
  'tmdb_cache_recommendations',
);
