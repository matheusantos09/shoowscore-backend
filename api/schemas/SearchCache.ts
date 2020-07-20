import { model, Schema, Document } from 'mongoose'

interface SearchCacheInterface extends Document {
  query: string,
  results: object,
}

const SearchCacheSchema = new Schema({
  query: String,
  results: Object,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: process.env.TMDB_CACHE_QUERY_SECONDS },
  },
});

export default model<SearchCacheInterface>('SearchCache', SearchCacheSchema, 'search_caches')
