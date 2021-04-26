import {Bar, BarItemProps} from '@nivo/bar';
import React, {useContext} from 'react';
import {DataContext} from '../contexts/DataContext';
import {defaultProps} from '../theme';
import ChartTitle from './ChartTitle';

const BarComponent = (props: BarItemProps) => {
  const isWhisker = (props.data.id as string).includes('Whisker');
  const isOffset = props.data.id === 'offset';

  const color =
    props.data.id === 'upperWhisker'
      ? 'black'
      : props.data.id === 'upperBox'
      ? 'green'
      : props.data.id === 'lowerBox'
      ? 'red'
      : props.data.id === 'lowerWhisker'
      ? 'black'
      : 'white';

  const width = isWhisker ? 3 : props.width;
  const offsetX = props.x + props.width / 2;

  const value =
    props.data.id === 'upperWhisker'
      ? props.data.data.max
      : props.data.id === 'upperBox'
      ? props.data.data.q3
      : props.data.id === 'lowerBox'
      ? props.data.data.median
      : props.data.id === 'lowerWhisker'
      ? props.data.data.q1
      : props.data.data.offset;

  return (
    <>
      <rect
        x={isWhisker ? offsetX : props.x}
        y={props.y}
        width={width}
        height={props.height}
        fill={color}
        opacity={isOffset ? 0 : 1}
      />
      <text
        x={
          offsetX -
          (['upperWhisker', 'offset'].includes(props.data.id as string)
            ? props.width * 0.4
            : props.width * 0.8)
        }
        y={
          props.y +
          (props.data.id === 'upperBox'
            ? -10
            : props.data.id === 'lowerWhisker'
            ? 10
            : 0)
        }
        textAnchor="middle"
        dominantBaseline="central"
      >
        {(value as number).toFixed(2)}
      </text>
    </>
  );
};

export const DemographicMeanScore = () => {
  const {anime, demographics} = useContext(DataContext);

  const demographicGroups: Record<string, Anime[]> = {};
  anime.forEach((anime) => {
    anime.genre.forEach((genre) => {
      if (!demographics[genre]) {
        return;
      }

      if (!demographicGroups[demographics[genre]]) {
        demographicGroups[demographics[genre]] = [];
      }

      demographicGroups[demographics[genre]].push(anime);
    });
  });

  const plots = Object.entries(demographicGroups).map(
    ([demographic, anime]) => {
      const sorted = anime.sort((a, b) => a.mean - b.mean);
      const quartileWidth = Math.floor(sorted.length / 4);
      const q1 = sorted[quartileWidth].mean;
      const median = sorted[quartileWidth * 2].mean;
      const q3 = sorted[quartileWidth * 3].mean;

      let min = Infinity;
      let max = -Infinity;
      sorted.forEach(({mean}) => {
        if (mean < min) min = mean;
        if (mean > max) max = mean;
      });

      return {
        demographic,
        offset: min,
        lowerWhisker: q1 - min,
        lowerBox: median - q1,
        upperBox: q3 - median,
        upperWhisker: max - q3,
        q1,
        median,
        q3,
        max,
      };
    },
  );

  return (
    <div className="DemographicMeanScore">
      <ChartTitle>Mean Score per Demographic</ChartTitle>
      <Bar
        {...defaultProps}
        margin={{...defaultProps.margin, left: 50, bottom: 50}}
        data={plots}
        keys={[
          'offset',
          'lowerWhisker',
          'lowerBox',
          'upperBox',
          'upperWhisker',
        ]}
        indexBy="demographic"
        barComponent={BarComponent}
        axisLeft={{
          legend: 'Mean Score',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        maxValue={9.5}
        minValue={3}
        axisBottom={{
          legend: 'Demographic',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        padding={0.5}
      />
    </div>
  );
};
