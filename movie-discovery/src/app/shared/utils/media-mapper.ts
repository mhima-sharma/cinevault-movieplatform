import { Movie, TvShow } from '../../core/models';
import { MovieCardItem } from '../components/movie-card/movie-card.component';

export function movieToCard(movie: Movie): MovieCardItem {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
  };
}

export function tvToCard(show: TvShow): MovieCardItem {
  return {
    id: show.id,
    title: show.name,
    posterPath: show.poster_path,
    releaseDate: show.first_air_date,
    voteAverage: show.vote_average,
  };
}
