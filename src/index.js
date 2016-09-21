import path from 'path';
import {
  parserPromise,
  readFilePromise,
} from './utils';
import {
  normalizeEntities,
  groupClips,
} from './normalize';
import splitClips from './split';


// main
const filename = path.join(__dirname, '../sample/test.xml');

readFilePromise(filename)
.then(data => parserPromise(data))
.then(normalizeEntities)
.then(groupClips)
.then(splitClips)
.then(d => d.map(cake => console.log(cake)))
.catch(e => console.log(e));
