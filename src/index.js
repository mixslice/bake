import path from 'path';
import { normalize } from 'normalizr';
import {
  parserPromise,
  readFilePromise,
} from './utils';
import {
  clipArraySchema,
} from './schema';

const mapReduce = arr => (
  arr
  .map(d => ({ [d.$.id]: d.$ }))
  .reduce((result, item) => {
    const newResult = result;
    const key = Object.keys(item)[0];
    newResult[key] = item[key];
    return newResult;
  })
);

const processData = ({
  fcpxml: {
    resources,
    library,
  },
}) => {
  const { format, asset, effect } = resources[0];
  const formats = mapReduce(format);
  const assets = mapReduce(asset);
  const effects = mapReduce(effect);

  const project = library[0].event[0].project[0];
  const spine = project.sequence[0].spine[0];

  const entities = normalize(spine.clip, clipArraySchema).entities;
  console.log(entities.clips);
};

const filename = path.join(__dirname, '../sample/test.xml');

readFilePromise(filename)
.then(data => parserPromise(data))
.then(processData)
.catch(e => console.log(e));
