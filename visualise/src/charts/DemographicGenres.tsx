import {Bar} from '@nivo/bar';
import {useContext} from 'react';
import {DataContext} from '../contexts/DataContext';
import {defaultProps} from '../theme';
import ChartTitle from './ChartTitle';

export const DemographicGenres = () => {
  const {anime, genres, demographics} = useContext(DataContext);

  const demographicMap: Record<string, Record<string, number>> = {};
  Object.keys(demographics).forEach((key) => {
    demographicMap[key] = {};
    Object.values(genres).forEach((genre) => {
      demographicMap[key][genre] = 0;
    });
  });

  anime.forEach((anime) => {
    const demographic = anime.genre.find((key) => key in demographics);
    if (!demographic) {
      return;
    }

    anime.genre.forEach((key) => {
      if (!genres[key]) {
        return;
      }

      const genre = genres[key];
      demographicMap[demographic][genre] += 1;
    });
  });

  const data = Object.entries(demographicMap).map(
    ([demographicKey, genres]) => ({
      demographic: demographics[demographicKey],
      ...genres,
    }),
  );

  const percentageData = data.map(({demographic, ...genres}) => {
    const sum = Object.values(genres).reduce((sum, value) => sum + value, 0);
    const result: Record<string, number> = {};
    Object.entries(genres).forEach(([genre, value]) => {
      result[genre] = Number(((value / sum) * 100).toFixed(2));
    });
    return {demographic, ...result};
  });

  return (
    <div className="DemographicGenres">
      <ChartTitle>Genres of Anime Aired per Demographic</ChartTitle>
      <Bar
        {...defaultProps}
        margin={{...defaultProps.margin, left: 60, bottom: 60}}
        data={data}
        keys={Object.values(genres)}
        indexBy="demographic"
        labelSkipHeight={12}
        labelTextColor="white"
        legends={[
          {
            anchor: 'top',
            dataFrom: 'keys',
            direction: 'row',
            itemWidth: 80,
            itemHeight: 20,
            translateY: -30,
          },
        ]}
        axisBottom={{
          legend: 'Demographic',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          legend: 'Total anime aired',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
      />
      <Bar
        {...defaultProps}
        margin={{...defaultProps.margin, left: 60, bottom: 60}}
        data={percentageData}
        keys={Object.values(genres)}
        labelFormat={(value) => `${value}%`}
        indexBy="demographic"
        labelSkipHeight={12}
        labelTextColor="white"
        legends={[
          {
            anchor: 'top',
            dataFrom: 'keys',
            direction: 'row',
            itemWidth: 80,
            itemHeight: 20,
            translateY: -30,
          },
        ]}
        axisBottom={{
          legend: 'Demographic',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          legend: 'Percentage total anime aired ',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
      />
    </div>
  );
};
