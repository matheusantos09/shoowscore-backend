import { Document, model, Schema } from 'mongoose';

interface TmdbCacheMovieInterface extends Document {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: boolean;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  typeResource?: string;
  videos?: [];
  images?: [];
  recommendations?: [];
}

const TmdbCacheMovieSchema = new Schema({
  adult: Boolean,
  backdrop_path: String,
  belongs_to_collection: Boolean,
  budget: Number,
  genres: Array,
  homepage: String,
  id: Number,
  imdb_id: String,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  production_companies: Array,
  production_countries: Array,
  release_date: String,
  revenue: Number,
  runtime: Number,
  spoken_languages: Array,
  status: String,
  tagline: String,
  title: String,
  video: Boolean,
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

TmdbCacheMovieSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: Number(process.env.TMDB_CACHE_SECONDS_MOVIES) }
);

export default model<TmdbCacheMovieInterface>(
  'TmdbCacheMovie',
  TmdbCacheMovieSchema,
  'tmdb_cache_resources'
);
