import {createContext} from 'react';

import anime from '../data/anime.json';
import demographics from '../data/demographics.json';
import genres from '../data/genres.json';

const years = [2015, 2016, 2017, 2018, 2019, 2020];
const seasons = ['winter', 'spring', 'summer', 'fall'];
const periods: string[] = [];
years.forEach((year) => {
  seasons.forEach((season) => {
    periods.push(`${year} ${season}`);
  });
});

const data = {
  anime: anime as Anime[],
  genres: genres as GenreMap,
  demographics: demographics as GenreMap,
  periods,
};

export const DataContext = createContext(data);
