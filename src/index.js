import path from 'path';
import { normalize } from 'normalizr';
import {
  parserPromise,
  readFilePromise,
} from './utils';
import {
  clipArraySchema,
} from './schema';


let formats = [];
let assets = [];
let effects = [];


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

const normalizeEntities = ({
  fcpxml: {
    resources,
    library,
  },
}) => {
  const { format, asset, effect } = resources[0];
  formats = mapReduce(format);
  assets = mapReduce(asset);
  effects = mapReduce(effect);

  const project = library[0].event[0].project[0];
  const spine = project.sequence[0].spine[0];

  const entities = normalize(spine.clip, clipArraySchema).entities;
  return entities;
};

// main
const filename = path.join(__dirname, '../sample/test.xml');

readFilePromise(filename)
.then(data => parserPromise(data))
.then(normalizeEntities)
.then(d => console.log(d))
.catch(e => console.log(e));
