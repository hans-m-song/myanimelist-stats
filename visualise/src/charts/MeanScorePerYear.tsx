import {SwarmPlot} from '@nivo/swarmplot';
import {ReactNode, useContext} from 'react';
import {DataContext} from '../contexts/DataContext';
import {MetricContext} from '../contexts/MetricContext';
import {defaultProps} from '../theme';
import ChartTitle from './ChartTitle';

const Box = (props: {color: string}) => (
  <div
    style={{
      backgroundColor: props.color,
      width: '10px',
      height: '10px',
      marginRight: '4px',
    }}
  />
);

const Row = (props: {children?: ReactNode}) => (
  <div {...props} style={{display: 'flex', alignItems: 'center'}} />
);

export const MeanScorePerYear = () => {
  const {anime, periods} = useContext(DataContext);
  const {popularity, num_scoring_users} = useContext(MetricContext);

  const data = anime.map((anime) => ({
    id: anime.title,
    media_type: anime.media_type,
    group: `${anime.year} ${anime.season}`,
    mean: anime.mean,
    popularity: popularity.max - anime.popularity,
    numScores: anime.num_scoring_users,
  }));

  return (
    <div className="PopularityPerYear">
      <ChartTitle>Mean score of aired anime each year</ChartTitle>
      <SwarmPlot
        {...defaultProps}
        width={1000}
        height={900}
        margin={{...defaultProps.margin, top: 50, left: 80, bottom: 120}}
        data={data}
        colorBy={(node) => node.data.media_type}
        groups={periods}
        forceStrength={0.1}
        value="mean"
        size={{
          key: 'numScores',
          values: [num_scoring_users.min, num_scoring_users.max],
          sizes: [3, 15],
        }}
        axisRight={null}
        axisTop={null}
        axisLeft={{
          legend: 'Mean score',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        axisBottom={{
          legend: 'Season',
          legendPosition: 'middle',
          tickRotation: 90,
          legendOffset: 100,
        }}
      />
      <div style={{position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            top: '-220px',
            left: '900px',
            backgroundColor: 'white',
            padding: '8px',
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Row>
              <Box color="rgb(31,119,180)" />
              TV
            </Row>
            <Row>
              <Box color="rgb(255,127,14)" />
              Movie
            </Row>
            <Row>
              <Box color="rgb(44,160,44)" />
              OVA
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
