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
import cakeHash from './cakehash';


// main
const filename = path.join(__dirname, '../sample/test.xml');

readFilePromise(filename)
.then(data => parserPromise(data))
.then(normalizeEntities)
.then(groupClips)
.then(splitClips)
.then(cakeHash)
// .then(cakes => cakes.map(cake => console.log(cake)))
.then(cakes => console.log(JSON.stringify(cakes)))
.catch(e => console.log(e));
