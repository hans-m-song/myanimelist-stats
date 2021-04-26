import {SwarmPlot} from '@nivo/swarmplot';
import {ReactNode, useContext} from 'react';
import {years, DataContext} from '../contexts/DataContext';
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

export const PopularityPerYear = () => {
  const {anime} = useContext(DataContext);
  const {mean, popularity} = useContext(MetricContext);

  const data = anime.map((anime) => ({
    id: anime.title,
    media_type: anime.media_type,
    group: `${anime.year}`,
    season: anime.season,
    value: popularity.max - anime.popularity,
    mean: anime.mean,
  }));

  return (
    <div className="PopularityPerYear">
      <ChartTitle>Popularity of aired anime each year</ChartTitle>
      <SwarmPlot
        {...defaultProps}
        width={700}
        height={900}
        margin={{...defaultProps.margin, top: 50, left: 80, bottom: 60}}
        data={data}
        colorBy={(node) => node.data.media_type}
        groups={years.map((year) => `${year}`)}
        forceStrength={0.1}
        value="value"
        size={{
          key: 'mean',
          values: [mean.min, mean.max],
          sizes: [0.5, 10],
        }}
        axisRight={null}
        axisTop={null}
        axisLeft={{
          legend: 'Popularity Ranking',
          legendPosition: 'middle',
          legendOffset: -60,
          format: (value) => popularity.max - (value as number),
        }}
        axisBottom={{
          legend: 'Year',
          legendPosition: 'middle',
          legendOffset: 50,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '2870px',
          left: '650px',
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
  );
};
