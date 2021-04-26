import {Bar} from '@nivo/bar';
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

  console.log(data);

  return (
    <div className="MediaTypeDistribution">
      <ChartTitle>Media Type distribution per Season</ChartTitle>
      <Bar
        {...defaultProps}
        margin={{...defaultProps.margin, left: 70, right: 70, bottom: 120}}
        keys={['tv', 'movie', 'ova']}
        data={data}
        enableGridY
        axisLeft={{
          legend: 'Number of anime in format',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        indexBy="period"
        axisBottom={{
          tickRotation: 90,
          legend: 'Period',
          legendPosition: 'middle',
          legendOffset: 110,
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 80,
            itemWidth: 80,
            itemHeight: 20,
          },
        ]}
      />
    </div>
  );
};
