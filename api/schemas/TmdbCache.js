import { model, Schema } from 'mongoose'

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

export default model('TmdbCache', TmdbCacheSchema)
