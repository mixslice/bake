import path from 'path';
import util from 'util';
import {
  parserPromise,
  readFilePromise,
} from './utils';
import {
  normalizeEntities,
  groupClips,
} from './normalize';
import splitClips from './split';
import {
  calculateCakeHash,
  mergeHashMap,
  filterRendered,
} from './cakehash';


// main
const filename = path.join(__dirname, '../sample/test.xml');

const cakes = readFilePromise(filename)
.then(data => parserPromise(data))
.then(normalizeEntities)
.then(groupClips)
.then(splitClips)
.then(calculateCakeHash);

cakes
.then(mergeHashMap)
.then(filterRendered)
.then((data) => {
  console.log(util.inspect(data, { depth: 3 }));
  // console.log(JSON.stringify(data));
  return data;
})
.catch(e => console.log(e));
