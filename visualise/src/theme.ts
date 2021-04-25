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
  margin: {top: 20, bottom: 20, left: 20, right: 20},
  colors: colorArray,
  theme,
};
