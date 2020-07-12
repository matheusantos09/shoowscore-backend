import { model, Schema, Document } from 'mongoose'

interface TmdbCacheInterface extends Document {
  tconst?: string,
  adult?: boolean,
  backdrop_path?: string,
  budget?: number,
  genres?: [],
  homepage?: string,
  id?: number,
  imdb_id?: string,
  original_language?: string,
  original_title?: string,
  overview?: string,
  popularity?: number,
  poster_path?: string,
  production_companies?: [],
  production_countries?: [],
  release_date?: string,
  revenue?: number,
  runtime?: number,
  spoken_languages?: [],
  status?: string,
  tagline?: string,
  title?: string,
  video?: boolean,
  vote_average?: number,
  vote_count?: number,
  expires_at?: {
    type: Date
  }
}

const TmdbCacheSchema = new Schema({
  tconst: String,
  adult: Boolean,
  backdrop_path: String,
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
  expires_at: {
    type: Date
  }
}, {
  timestamp: true
});

export default model<TmdbCacheInterface>('TmdbCache', TmdbCacheSchema)
