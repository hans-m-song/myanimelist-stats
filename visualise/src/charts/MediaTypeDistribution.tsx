import {Bar} from '@nivo/bar';
import {Stream} from '@nivo/stream';
import React, {useContext} from 'react';
import {DataContext} from '../contexts/DataContext';
import {defaultProps} from '../theme';
import ChartTitle from './ChartTitle';

export const MediaTypeDistribution = () => {
  const {anime, periods} = useContext(DataContext);

  const periodMap: Record<string, Record<string, number>> = {};
  periods.forEach((period) => {
    periodMap[period] = {tv: 0, movie: 0, ova: 0};
  });

  anime.forEach((anime) => {
    const period = `${anime.year} ${anime.season}`;
    periodMap[period][anime.media_type] += 1;
  });

  const data = Object.entries(periodMap).map(([period, data]) => ({
    period,
    ...data,
  }));

  return (
    <div className="MediaTypeDistribution">
      <ChartTitle>Media Type distribution per Season</ChartTitle>
      <Stream
        {...defaultProps}
        margin={{...defaultProps.margin, left: 70, bottom: 120}}
        data={data}
        keys={['tv', 'movie', 'ova']}
        offsetType="none"
        curve="linear"
        legends={[
          {
            anchor: 'top-right',
            direction: 'column',
            translateY: 0,
            itemWidth: 60,
            itemHeight: 20,
          },
        ]}
        axisLeft={{
          legend: 'Number of anime in format',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        axisBottom={{
          tickRotation: 90,
          legend: 'Season',
          legendPosition: 'middle',
          legendOffset: 110,
          format: (value) => periods[value as number],
        }}
      />
      <Bar
        {...defaultProps}
        margin={{...defaultProps.margin, left: 70, bottom: 120}}
        keys={['tv', 'movie', 'ova']}
        data={data}
        labelSkipHeight={12}
        labelTextColor="white"
        enableGridY
        axisLeft={{
          legend: 'Number of anime in format',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        indexBy="period"
        axisBottom={{
          tickRotation: 90,
          legend: 'Season',
          legendPosition: 'middle',
          legendOffset: 110,
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'column',
            translateY: 0,
            itemWidth: 60,
            itemHeight: 20,
          },
        ]}
      />
    </div>
  );
};
