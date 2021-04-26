import {Chord} from '@nivo/chord';
import {useContext} from 'react';
import {DataContext} from '../contexts/DataContext';
import {defaultProps} from '../theme';
import ChartTitle from './ChartTitle';

export interface GenreOverlapChordProps {
  threshold?: number;
  padAngle?: number;
}

export const GenreOverlapChord = (props: GenreOverlapChordProps) => {
  const {anime, genres} = useContext(DataContext);

  const keys = Object.values(genres);
  const genreMap: Record<string, {name: string; index: number}> = {};

  Object.entries(genres).forEach(([key, name], index) => {
    genreMap[key] = {name, index};
  });

  const matrix: number[][] = keys.map(() => Array(keys.length).fill(0));

  anime.forEach(({genre}) => {
    // filter non-genre ids
    const actualGenres = genre.filter((id) => genres[id]);

    // no overlaps
    if (actualGenres.length === 1) {
      const id = actualGenres[0];
      matrix[genreMap[id].index][genreMap[id].index] += 1;
      return;
    }

    actualGenres.forEach((id) => {
      actualGenres.forEach((otherId) => {
        // skip self
        if (id === otherId) return;
        matrix[genreMap[id].index][genreMap[otherId].index] += 1;
      });
    });
  });

  matrix.forEach((row, x) => {
    row.forEach((col, y) => {
      if (col < (props.threshold || 0)) {
        matrix[x][y] = 0;
      }
    });
  });

  return (
    <div className="GenreOverlapChord">
      <ChartTitle>Most Common Genre Combinations</ChartTitle>
      <Chord
        {...defaultProps}
        width={500}
        height={500}
        keys={keys}
        matrix={matrix}
        padAngle={props.padAngle || 0.15}
        innerRadiusOffset={0.05}
      />
    </div>
  );
};
