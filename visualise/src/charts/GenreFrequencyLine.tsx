import React, {useContext} from 'react';
import {Line} from '@nivo/line';
import {DataContext} from '../contexts/DataContext';
import {defaultProps} from '../theme';
import ChartTitle from './ChartTitle';

export const GenreFrequencyLine = () => {
  const {anime, genres, periods} = useContext(DataContext);

  const keys = Object.values(genres);
  const data: Record<string, Record<string, number>> = {};

  keys.forEach((genre) => {
    data[genre] = {};
    periods.forEach((period) => {
      data[genre][period] = 0;
    });
  });

  anime.forEach((item) => {
    const {year, season, genre} = item;
    const period = `${year} ${season}`;
    genre.forEach((id) => {
      if (!data[genres[id]]) {
        return;
      }
      data[genres[id]][period] += 1;
    });
  });

  const flattened = Object.entries(data).map(([genre, periods]) => {
    const data = Object.entries(periods).map(([x, y]) => ({x, y}));
    return {id: genre, data};
  });

  return (
    <div className="GenreFrequencyLine">
      <ChartTitle>Genre Frequency per Season</ChartTitle>
      <Line
        {...defaultProps}
        margin={{top: 10, right: 90, bottom: 120, left: 50}}
        data={flattened}
        axisBottom={{
          legend: 'Time Period',
          legendPosition: 'middle',
          legendOffset: 110,
          tickValues: periods,
          tickRotation: 90,
        }}
        axisLeft={{
          legend: 'Number of anime',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            itemWidth: 80,
            itemHeight: 20,
            translateX: 90,
          },
        ]}
      />
    </div>
  );
};
