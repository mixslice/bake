import { Parser } from 'xml2js';
import fs from 'fs';

const parser = new Parser();

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
