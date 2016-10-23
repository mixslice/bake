import express from 'express';
import morgan from 'morgan';
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
  trimRendered,
} from './cakehash';
import Worker from './worker';


/**
 * init app
 */
const app = express();
app.use(morgan('combined'));

const workerAPIRoot = process.env.WORKER_API_ROOT || 'http://127.0.0.1:8080';
console.log('worker API:', workerAPIRoot);
const projectVolume = process.env.PROJECT_VOLUME || path.join(__dirname, '../sample/');
console.log('project volume:', projectVolume);
const worker = new Worker(workerAPIRoot);
const filename = path.join(projectVolume, 'demo.xml');

/**
 * provide root route
 */
app.get('/', (req, res) => {
  res.json({
    message: 'hello',
  });
});

app.get('/render', (req, res) => {
  // main
  const cakes = readFilePromise(filename)
  .then(data => parserPromise(data))
  .then(normalizeEntities)
  .then(groupClips)
  .then(splitClips)
  .then(calculateCakeHash);

  // cakes for worker to render
  cakes
  .then(mergeHashMap)
  .then(filterRendered)
  .then(data => Object.keys(data).map(key => ({ hash: key, ...data[key] })))
  .then((data) => {
    // send jobs to worker
    data.forEach((cake) => {
      worker.send({ cakes: [cake] });
    });

    return data;
  })
  .then((data) => {
    console.log('render jobs:', util.inspect(data, { depth: 3 }));
    res.json(data);
  })
  .catch((e) => {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  });
});

app.get('/export', (req, res) => {
  // main
  const cakes = readFilePromise(filename)
  .then(data => parserPromise(data))
  .then(normalizeEntities)
  .then(groupClips)
  .then(splitClips)
  .then(calculateCakeHash);

  // sequence for worker to concat
  cakes
  .then(data => data.map(({ hash, start, end }) => ({ hash, start, end })))
  .then(trimRendered)
  .then(data => worker.concat({ sequence: data }))
  .then((data) => {
    console.log('export job:', data);
    res.json(data);
  })
  .catch((e) => {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  });
});


/**
 * start app
 */
const server = app.listen(3000, () => {
  const port = server.address().port;
  console.log(`Example app listening on http://localhost:${port}`);
});

export default server;
