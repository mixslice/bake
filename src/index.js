import path from 'path';
import {
  parserPromise,
  readFilePromise,
} from './utils';

const filename = path.join(__dirname, 'sample/test.xml');

readFilePromise(filename)
.then(data => parserPromise(data))
.then(result => console.dir(result))
.catch(e => console.err(e));
