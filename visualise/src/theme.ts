import {Theme} from '@nivo/core';
import {colorArray} from './colors';

export const theme: Theme = {
  axis: {
    ticks: {
      text: {
        fontSize: 14,
      },
    },
    legend: {
      text: {
        fontSize: 14,
      },
    },
  },
  labels: {
    text: {
      fontSize: 14,
    },
  },
};

export const defaultProps = {
  width: 900,
  height: 500,
  margin: {top: 40, bottom: 40, left: 40, right: 40},
  colors: {scheme: 'category10' as 'category10'},
  theme,
};
