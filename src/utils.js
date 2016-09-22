import { Parser } from 'xml2js';
import fs from 'fs';

const parser = new Parser({
  mergeAttrs: true,
  explicitArray: false,
});

export function parserPromise(data) {
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

export function readFilePromise(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

export const calculateFrames = (timestamp) => {
  if (!timestamp) return 0;
  if (!isNaN(timestamp)) return timestamp;

  const fracRe = /(\d+)\/(\d+)s/i;
  const numRe = /(\d+)s/i;
  let result = timestamp.match(fracRe);
  if (result) {
    return (Number(result[1]) / Number(result[2])) * 30;
  }

  result = timestamp.match(numRe);
  return Number(result[1]) * 30;
};
