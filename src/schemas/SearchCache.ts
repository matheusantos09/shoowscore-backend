import { Document, model, Schema } from 'mongoose';

interface SearchCacheInterface extends Document {
  query: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  results: object;
  language: string;
  total_results: number;
}

const SearchCacheSchema = new Schema({
  query: String,
  language: String,
  results: Object,
  total_results: Number,
  // @TODO Set new time for expire register
  // expiresAt: {
  //   type: Date,
  //   default: Date.now,
  //   expires: 0,
  // },
});

// @TODO Set new time for expire register
// SearchCacheSchema.index(
//   { expiresAt: 1 },
//   { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_SEARCH) },
// );

export default model<SearchCacheInterface>(
  'SearchCache',
  SearchCacheSchema,
  'search_caches',
);
