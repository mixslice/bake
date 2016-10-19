// import { mergeRangesWithData } from './merge';

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
  //   { start: 0, end: 50 },
  //   { start: 20, end: 110 },
  //   { start: 50, end: 100 },
  //   { start: 100, end: 140 },
  //   { start: 786, end: 901 },
  // ],
  // e19cb00c065230a22f3ee596d9d2f3da: [
  //   { start: 0, end: 156 },
  //   { start: 325, end: 463 },
  //   { start: 784, end: 915 },
  // ],
  // dee075b4358e45d991a3862698b686f4: [
  //   { start: 0, end: 169 },
  // ],
  // '79a36da9e910f3e97677ecf9d4ef0092': [
  //   { start: 580, end: 786 },
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
  // rendered[hash] = mergeRangesWithData(rendered, newRendered);
  const { start, end } = newRendered;
  rendered[hash] = rendered[hash] || [];
  rendered[hash].push({ start, end });
}
