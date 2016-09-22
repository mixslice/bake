function copyClips(clips) {
  return clips.map(({ start, ...others }) => ({
    start,
    ...others,
  }));
}

function mergeCake(cakes, clip) {
  const { $: { offset, duration, start, adjust }, ...nodes } = clip;
  const end = offset + duration;

  if (cakes.length > 0 && offset < cakes[cakes.length - 1].$.end) {
    // clips that not in the main storyline
    const result = [];
    for (const cake of cakes) {
      if (offset >= cake.$.end || end <= cake.$.offset) {
        result.push(cake);
      }
      if (offset > cake.$.offset && offset < cake.$.end) {
        // trim end
        const { $: { duration: cakeDuration, end: cakeEnd, ...params }, clips } = cake;
        result.push({
          $: {
            ...params,
            duration: (cakeDuration - cakeEnd) + offset,
            end: offset,
          },
          clips,
        });
      }
      if (adjust && end > cake.$.offset && offset < cake.$.end) {
        // merge layers
        const { $: { offset: cakeOffset, end: cakeEnd }, clips } = cake;
        const copiedClips = copyClips(clips);
        const newOffset = Math.max(cakeOffset, offset);
        const newEnd = Math.min(cakeEnd, end);
        // adjust clip start
        copiedClips[0].start += newOffset - cakeOffset;
        const newClip = {
          // start,
          start: start + (newOffset - offset),
          ...nodes,
        };
        // push new cake
        result.push({
          $: {
            offset: newOffset,
            duration: newEnd - newOffset,
            end: newEnd,
          },
          clips: [...copiedClips, newClip],
        });
      } else if (end > cake.$.offset && end <= cake.$.end) {
        // overwrite to main storyline
        const newClip = { start, ...nodes };
        result.push({
          $: {
            offset,
            duration,
            end: offset + duration,
          },
          clips: [newClip],
        });
      }
      if (end > cake.$.offset && end < cake.$.end) {
        // trim start
        const { $: { offset: cakeOffset, end: cakeEnd }, clips } = cake;
        const newOffset = end;

        result.push({
          $: {
            offset: newOffset,
            duration: cakeEnd - newOffset,
            end: cakeEnd,
          },
          clips: clips.map(({ start: cstart, ...others }) => ({
            start: cstart + (newOffset - cakeOffset),
            ...others,
          })),
        });
      }
    } // end no adjust
    return result;
  }

  const newClip = { start, ...nodes };
  cakes.push({
    $: {
      offset,
      duration,
      end: offset + duration,
    },
    clips: [newClip],
  });
  return cakes;
}

const splitClips = (data) => {
  let cakes = [];

  for (const lane of Object.keys(data).sort()) {
    const clipsInLane = data[lane].sort((a, b) => a.$.offset - b.$.offset);
    for (const clip of clipsInLane) {
      cakes = mergeCake(cakes, clip);
    }
  }
  return cakes;
};

export default splitClips;
