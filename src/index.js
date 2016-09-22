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
import cakeHash from './cakehash';


// main
const filename = path.join(__dirname, '../sample/test.xml');

readFilePromise(filename)
.then(data => parserPromise(data))
.then(normalizeEntities)
.then(groupClips)
.then(splitClips)
.then(cakeHash)
.then((data) => {
  console.log(util.inspect(data, { depth: 4 }));
  return data;
})
.catch(e => console.log(e));
