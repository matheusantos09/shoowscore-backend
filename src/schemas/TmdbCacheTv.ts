import { Document, model, Schema } from 'mongoose';

interface TmdbCacheTvInterface extends Document {
  language: string;
  backdrop_path?: string;
  created_by?: [];
  episode_run_time?: [];
  first_air_date?: string;
  genres?: [];
  homepage?: string;
  id?: number;
  in_production?: boolean;
  languages?: [];
  last_air_date?: string;
  last_episode_to_air?: {
    air_date?: string;
    episode_number?: number;
    id?: number;
    name: string;
    overview: string;
    production_code?: string;
    season_number: number;
    show_id?: number;
    still_path?: string;
    vote_average?: number;
    vote_count?: number;
  };
  name?: string;
  // next_episode_to_air?: boolean | [] | {} | string,
  next_episode_to_air?: any;
  networks?: {
    name: string;
    id: number;
    logo_path: string;
    origin_country: string;
  }[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: [];
  original_language?: string;
  original_name?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  production_companies?: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  seasons?: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview?: string;
    poster_path: string;
    season_number: number;
    episodes?: {
      _id: string;
      air_date: string;
      episodes: {
        air_date: string;
        episode_number: number;
        id: number;
        name: string;
        overview: string;
        production_code: string;
        season_number: number;
        show_id: number;
        still_path: string;
        vote_average: number;
        vote_count: number;
        crew: {
          id: number;
          credit_id: string;
          name: string;
          department: string;
          job: string;
          gender: number;
          profile_path: null;
        }[];
        guest_stars: {
          id: number;
          name: string;
          credit_id: string;
          character: string;
          order: number;
          gender: number;
          profile_path: string;
        }[];
      }[];
      name: string;
      overview: string;
      id: number;
      poster_path: string;
      season_number: number;
    }[];
  }[];
  status?: string;
  type?: string;
  vote_average?: number;
  vote_count?: number;
  typeResource?: string;
  videos?: [];
  images?: [];
  recommendations?: [];
}

const TmdbCacheTvSchema = new Schema({
  language: String,
  backdrop_path: String,
  created_by: Array,
  episode_run_time: Array,
  first_air_date: String,
  genres: Array,
  homepage: String,
  id: Number,
  in_production: Boolean,
  languages: Array,
  last_air_date: String,
  last_episode_to_air: Object,
  name: String,
  next_episode_to_air: Object || String,
  networks: Array,
  number_of_episodes: Number,
  number_of_seasons: Number,
  origin_country: Array,
  original_language: String,
  original_name: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  production_companies: Array,
  seasons: Array,
  status: String,
  type: String,
  vote_average: Number,
  vote_count: Number,
  typeResource: String,
  videos: Array,
  images: Array,
  recommendations: Array,
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 0,
  },
});

TmdbCacheTvSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_TV) },
);

export default model<TmdbCacheTvInterface>(
  'TmdbCacheTv',
  TmdbCacheTvSchema,
  'tmdb_cache_tv',
);
