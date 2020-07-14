import { model, Schema, Document } from 'mongoose'

interface SearchCacheInterface extends Document {
  query: string,
  payload: object,
}

const SearchCacheSchema = new Schema({
  query: String,
  payload: Object,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: process.env.TMDB_CACHE_QUERY_SECONDS },
  },
});

export default model<SearchCacheInterface>('SearchCache', SearchCacheSchema)
