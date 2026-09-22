export interface TvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}

export interface CreatedBy {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface TvShowDetails extends Omit<TvShow, 'genre_ids'> {
  genres: import('./genre.model').Genre[];
  tagline: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  seasons: Season[];
  created_by: CreatedBy[];
  networks: { id: number; name: string; logo_path: string | null }[];
  in_production: boolean;
  homepage: string | null;
}
