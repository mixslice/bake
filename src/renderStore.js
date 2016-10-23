// import { mergeRangesWithData } from './merge';
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
});

client.on('error', (err) => {
  console.log('Error', err);
});

/**
 * simulate the rendered media database
 */
// const rendered = {
// /**
//  * [hash]: [
//  *   { start, end, data: [fileId] },
//  * ],
//  */
// };

/**
 * get rendered object from database
 *
 * @param {String} hash
 * @returns {Object}
 */
export function getRenderedObjectWithHash(hash) {
  return new Promise((resolve, reject) => {
    client.hkeys(hash, (err, replies) => {
      if (err) {
        reject(err);
      } else {
        const result = replies.map((reply) => {
          const r = reply.split(',');
          const start = Number(r[0]);
          const end = Number(r[1]);
          return { start, end };
        });
        resolve(result);
      }
    });
  });
}

/**
 * save rendered object to cache db
 *
 * @param {String} hash
 * @param {Object} newRendered
 */
export function saveRenderedObject(hash, ranges) {
  // rendered[hash] = mergeRangesWithData(rendered, newRendered);
  ranges.forEach(({ start, end }) => {
    client.hset(hash, `${start},${end}`, 'continue', redis.print);
  });
}
