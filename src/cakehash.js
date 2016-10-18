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
      ...props,
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
  for (const cake of cakes) {
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
  }
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
  for (const key of Object.keys(hashMap)) {
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
  }
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
  for (const clip of clips) {
    const renderedRanges = getRenderedObjectWithHash(clip.hash);
    if (renderedRanges) {
      const { start, end } = clip;
      for (const { start: rs, end: re } of renderedRanges) {
        const newClip = { src: `${clip.hash}-${rs}-${re}` };
        if (start <= re && end >= rs) {
          // clip range inside rendered ranges
          if ((start < rs && end > re) ||
          (Math.max(rs, start) === rs && Math.min(re, end) === re)) {
            // using rendered range without trim
            result.push(newClip);
          } else if (start >= rs && start <= re) {
            // trim start
            const newEnd = Math.min(re, end);
            newClip.start = start - rs;
            newClip.end = newEnd - rs;
            result.push(newClip);
          } else {
            newClip.start = 0;
            newClip.end = end - rs;
            result.push(newClip);
          }
        }
      }
    } else {
      throw new Error('Still rendering');
    }
  }
  return result;
}
