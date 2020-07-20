import { model, Schema, Document } from 'mongoose'

interface SearchCacheInterface extends Document {
  query: string,
  results: object,
}

const SearchCacheSchema = new Schema({
  query: String,
  results: Object,
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 0,
  },
});

SearchCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_SEARCH) });

export default model<SearchCacheInterface>('SearchCache', SearchCacheSchema, 'search_caches')
