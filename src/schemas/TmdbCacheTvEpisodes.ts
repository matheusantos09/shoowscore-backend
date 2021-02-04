import { Document, model, Schema } from 'mongoose';

interface TmdbCacheTvEpisodesInterface extends Document {
  id?: number;
  typeResource: string;
  language: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  payload: object;
}

const TmdbCacheTvEpisodesSchema = new Schema({
  id: Number,
  typeResource: String,
  language: String,
  payload: Object,
  // @TODO Set new time for expire register
  // expiresAt: {
  //   type: Date,
  //   default: Date.now,
  //   expires: 0,
  // },
});

// @TODO Set new time for expire register
// TmdbCacheTvEpisodesSchema.index(
//   { expiresAt: 1 },
//   { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_IMAGES) },
// );

export default model<TmdbCacheTvEpisodesInterface>(
  'TmdbCacheTvEpisodes',
  TmdbCacheTvEpisodesSchema,
  'tmdb_cache_tv_episodes',
);
