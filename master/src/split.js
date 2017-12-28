/**
 *
 *
 * @param {{start}[]} clips
 * @returns {any[]}
 */
function copyClips(clips) {
  return clips.map(({ start, ...props }) => ({
    start,
    ...props,
  }));
}

/**
 * merge clip into cakes
 *
 * @param {any[]} cakes
 * @param {{offset, duration, start, adjust}} clip
 * @returns {any[]}
 */
function mergeCake(cakes, clip) {
  const { offset, duration, start, adjust, ...props } = clip;
  const end = offset + duration;

  if (cakes.length > 0 && offset < cakes[cakes.length - 1].end) {
    // clips that not in the main storyline
    const result = [];
    cakes.forEach((cake) => {
      if (offset >= cake.end || end <= cake.offset) {
        result.push(cake);
      }
      if (offset > cake.offset && offset < cake.end) {
        // trim end
        const { duration: cakeDuration, end: cakeEnd, clips, ...cakeProps } = cake;
        result.push({
          ...cakeProps,
          duration: (cakeDuration - cakeEnd) + offset,
          end: offset,
          clips,
        });
      }
      if (adjust && end > cake.offset && offset < cake.end) {
        // merge layers
        const { offset: cakeOffset, end: cakeEnd, clips } = cake;
        const copiedClips = copyClips(clips);
        const newOffset = Math.max(cakeOffset, offset);
        const newEnd = Math.min(cakeEnd, end);
        // adjust clip start
        copiedClips[0].start += newOffset - cakeOffset;
        const newClip = {
          // start,
          start: start + (newOffset - offset),
          ...props,
        };
        // push new cake
        result.push({
          offset: newOffset,
          duration: newEnd - newOffset,
          end: newEnd,
          clips: [...copiedClips, newClip],
        });
      } else if (end > cake.offset && end <= cake.end) {
        // overwrite to main storyline
        const newClip = { start, ...props };
        result.push({
          offset,
          duration,
          end: offset + duration,
          clips: [newClip],
        });
      }
      if (end > cake.offset && end < cake.end) {
        // trim start
        const { offset: cakeOffset, end: cakeEnd, clips } = cake;
        const newOffset = end;

        result.push({
          offset: newOffset,
          duration: cakeEnd - newOffset,
          end: cakeEnd,
          clips: clips.map(({ start: cstart, ...others }) => ({
            start: cstart + (newOffset - cakeOffset),
            ...others,
          })),
        });
      }
    }); // end no adjust
    return result;
  }

  const newClip = { start, ...props };
  cakes.push({
    offset,
    duration,
    end: offset + duration,
    clips: [newClip],
  });
  return cakes;
}


/**
 * slice clips into cakes
 *
 * @param {{ lane: any[] }} data
 * @returns
 */
const splitClips = (data) => {
  const sortedKeys = Object.keys(data).sort();
  return [[], ...sortedKeys].reduce((cakes, lane) => {
    const clipsInLane = data[lane].sort((a, b) => a.offset - b.offset);
    return [cakes, ...clipsInLane]
    .reduce((result, clip) => mergeCake(result, clip));
  });
};

export default splitClips;
