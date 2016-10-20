import crypto from 'crypto';
import { mergeRanges } from './merge';
import { getRenderedObjectWithHash } from './renderStore';
import { subtract } from './utils';

/**
 * calculate hash of cakes
 *
 * @export
 * @param {any[]} cakes
 * @returns
 */
export function calculateCakeHash(cakes) {
  const newCakes = cakes.map((cake) => {
    const firstStart = cake.clips[0].start;
    const normalizedClips = cake.clips.map(({
      lane: _lane,
      name: _name,
      tcFormat: _tcFormat,
      start,
      ...props
    }) => ({
      offset: firstStart - start,
      ...props,
    }));
    const hash = crypto
    .createHash('md5')
    .update(JSON.stringify(normalizedClips))
    .digest('hex');

    return {
      hash,
      start: firstStart,
      end: firstStart + cake.duration,
      duration: cake.duration,
      clips: normalizedClips,
    };
  });

  return newCakes;
}

export function mergeHashMap(cakes) {
  const hashMap = {};
  cakes.forEach((cake) => {
    const { hash, start, end, clips } = cake;
    const obj = hashMap[hash];
    if (!obj) {
      hashMap[hash] = {
        ranges: [{ start, end }],
        clips,
      };
    } else {
      obj.ranges = mergeRanges({ start, end }, ...obj.ranges);
    }
  });
  return hashMap;
}

/**
 * filter out already rendered media
 *
 * @param {Object} hashMap
 * @returns {Object} Returns the new cakes
 */
export function filterRendered(hashMap) {
  const result = {};
  Object.keys(hashMap).forEach((key) => {
    const renderedRanges = getRenderedObjectWithHash(key);
    const cake = hashMap[key];
    if (renderedRanges) {
      const { ranges, ...cakeProps } = cake;
      const newRanges = ranges
      .map(range => subtract(range, renderedRanges))
      .reduce((a, b) => [...a, ...b]);

      if (newRanges.length > 0) {
        result[key] = { ranges: newRanges, ...cakeProps };
      }
    } else {
      result[key] = cake;
    }
  });
  return result;
}


/**
 * trim rendered video for final output
 *
 * @export
 * @param {any} clips
 * @returns
 */
export function trimRendered(clips) {
  const result = [];
  clips.forEach((clip) => {
    const renderedRanges = getRenderedObjectWithHash(clip.hash);
    if (renderedRanges) {
      const { start, end } = clip;
      let cursor = start;
      const sortedRanges = renderedRanges.sort((a, b) => {
        if (a.start === b.start) {
          return a.end > b.end;
        }
        return a.start > b.start;
      });
      sortedRanges.every(({ start: rs, end: re }) => {
        const newClip = { src: `${clip.hash}-${rs}-${re}` };
        if (cursor >= rs && cursor <= re) {
          if (re > end) {
            newClip.start = cursor - rs;
            newClip.end = end - rs;
            result.push(newClip);
            return false;
          }

          if (cursor !== rs) {
            newClip.start = cursor - rs;
            newClip.end = re - rs;
          }

          cursor = re;
          result.push(newClip);
        }
        return true;
      });
    }
  });
  return result;
}
