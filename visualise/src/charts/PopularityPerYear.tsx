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
  const {mean} = useContext(MetricContext);

  const data = anime.map((anime) => ({
    id: anime.title,
    media_type: anime.media_type,
    group: `${anime.year}`,
    season: anime.season,
    value: anime.popularity,
    mean: anime.mean,
  }));

  return (
    <div className="PopularityPerYear">
      <ChartTitle>Popularity of aired anime each year</ChartTitle>
      <SwarmPlot
        {...defaultProps}
        width={1000}
        height={700}
        margin={{...defaultProps.margin, left: 120, bottom: 60, right: 50}}
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
        layout="horizontal"
        axisLeft={{
          legend: 'Year',
          tickSize: 40,
          legendPosition: 'middle',
          legendOffset: -100,
        }}
        axisBottom={{
          legend: 'Popularity Ranking',
          legendOffset: 50,
          legendPosition: 'middle',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '1650px',
          left: '880px',
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
