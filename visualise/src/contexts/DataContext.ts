import {createContext} from 'react';

export const DataContext = createContext({
  anime: [] as Anime[],
  genres: {} as GenreMap,
  demographics: {} as GenreMap,
  periods: [] as string[],
  mean: {
    max: -Infinity,
    min: Infinity,
  },
  rank: {
    max: -Infinity,
    min: Infinity,
  },
  popularity: {
    max: -Infinity,
    min: Infinity,
  },
  numScoring: {
    max: -Infinity,
    min: Infinity,
  },
});
