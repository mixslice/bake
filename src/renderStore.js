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
  // d072965954c8755a672a4b65ee46fe3f: [
  //   { start: 43, end: 117 },
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
