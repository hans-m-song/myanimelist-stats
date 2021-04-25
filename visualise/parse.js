const fs = require('fs');

const [inputfile, outputfile] = process.argv.slice(2);
console.log('parsing file', inputfile);

const buffer = fs.readFileSync(inputfile);
const csv = buffer.toString();

const data = [];
const [header, ...lines] = csv.split('\n');
const fields = header.split(',');

lines.forEach((line) => {
  if (line === '') return;

  const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  if (parts.length !== fields.length) {
    throw new Error(`invalid line: ${line} does not match ${fields}`);
  }

  const [
    id,
    title,
    mean,
    rank,
    popularity,
    num_scoring_users,
    media_type,
    status,
    genre,
    year,
    season,
  ] = parts;

  const anime = {
    id: Number(id),
    title,
    mean: Number(mean),
    rank: Number(rank),
    popularity: Number(popularity),
    num_scoring_users: Number(num_scoring_users),
    media_type,
    status,
    genre: genre.replace(/(^"?{)|(}"?$)/g, '').split(','),
    year: Number(year),
    season,
  };

  if (
    anime.year >= 2015 &&
    anime.genre.join('') !== '' &&
    ['tv', 'movie', 'ova'].includes(anime.media_type)
  ) {
    data.push(anime);
  }
});

console.log('writing parsed data to', outputfile);
fs.writeFileSync(outputfile, JSON.stringify(data, null, 2));
