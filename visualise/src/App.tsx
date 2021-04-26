import React from 'react';
import {DemographicGenres} from './charts/DemographicGenres';
import {DemographicMeanScore} from './charts/DemographicMeanScore';
import {GenreFrequencyLine} from './charts/GenreFrequencyLine';
import {GenreOverlapChord} from './charts/GenreOverlapChord';
import {MediaTypeDistribution} from './charts/MediaTypeDistribution';
import {PopularityPerYear} from './charts/PopularityPerYear';

export const App = () => (
  <div className="App">
    <DemographicGenres />
    <DemographicMeanScore />
    <MediaTypeDistribution />
    <PopularityPerYear />
    <GenreFrequencyLine />
    <GenreOverlapChord threshold={0} />
  </div>
);
