import React from 'react';
import {DataContext} from './contexts/DataContext';
import anime from './data/anime.json';
import genres from './data/genres.json';
import demographics from './data/demographics.json';

const years = [2015, 2016, 2017, 2018, 2019, 2020];
const seasons = ['winter', 'spring', 'summer', 'fall'];
const periods: string[] = [];
years.forEach((year) => {
  seasons.forEach((season) => {
    periods.push(`${year} ${season}`);
  });
});

const data = {
  anime,
  genres,
  periods,
  demographics,
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
};

anime.forEach((anime: Anime) => {
  if (anime.mean > data.mean.max) {
    data.mean.max = anime.mean;
  }
  if (anime.mean < data.mean.min) {
    data.mean.min = anime.mean;
  }
  if (anime.rank > data.rank.max) {
    data.rank.max = anime.rank;
  }
  if (anime.rank < data.rank.min) {
    data.rank.min = anime.rank;
  }
  if (anime.popularity > data.popularity.max) {
    data.popularity.max = anime.popularity;
  }
  if (anime.popularity < data.popularity.min) {
    data.popularity.min = anime.popularity;
  }
  if (anime.num_scoring_users > data.numScoring.max) {
    data.numScoring.max = anime.num_scoring_users;
  }
  if (anime.num_scoring_users < data.numScoring.min) {
    data.numScoring.min = anime.num_scoring_users;
  }
});

export const App = () => (
  <div className="App">
    <DataContext.Provider value={data}></DataContext.Provider>
  </div>
);
