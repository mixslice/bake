import { mergeRangesWithData } from './merge';

/**
 * simulate the rendered media database
 */
const rendered = {
/**
 * [hash]: [
 *   { start, end, data: [fileId] },
 * ],
 */
  // '9b9a6b534566e1425b9a59e4a3ad8934': [
  //   { start: 0, end: 200 },
  // ],
};

/**
 * get rendered object from database
 *
 * @param {String} hash
 * @returns {Object}
 */
export function getRenderedObjectWithHash(hash) {
  return rendered[hash];
}

/**
 * save rendered object to cache db
 *
 * @param {String} hash
 * @param {Object} newRendered
 */
export function saveRenderedObject(hash, newRendered) {
  rendered[hash] = mergeRangesWithData(rendered, newRendered);
}
