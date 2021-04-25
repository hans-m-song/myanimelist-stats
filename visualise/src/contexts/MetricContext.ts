import {createContext} from 'react';
import anime from '../data/anime.json';

const metrics = {
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
  num_scoring_users: {
    max: -Infinity,
    min: Infinity,
  },
};

anime.forEach((anime: Anime) => {
  if (anime.mean > metrics.mean.max) {
    metrics.mean.max = anime.mean;
  }
  if (anime.mean < metrics.mean.min) {
    metrics.mean.min = anime.mean;
  }
  if (anime.rank > metrics.rank.max) {
    metrics.rank.max = anime.rank;
  }
  if (anime.rank < metrics.rank.min) {
    metrics.rank.min = anime.rank;
  }
  if (anime.popularity > metrics.popularity.max) {
    metrics.popularity.max = anime.popularity;
  }
  if (anime.popularity < metrics.popularity.min) {
    metrics.popularity.min = anime.popularity;
  }
  if (anime.num_scoring_users > metrics.num_scoring_users.max) {
    metrics.num_scoring_users.max = anime.num_scoring_users;
  }
  if (anime.num_scoring_users < metrics.num_scoring_users.min) {
    metrics.num_scoring_users.min = anime.num_scoring_users;
  }
});

export const MetricContext = createContext(metrics);
