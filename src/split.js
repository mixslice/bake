function mergeCake(cakes, clip) {
  const { $: { offset, duration, start, adjust }, ...nodes } = clip;
  // if (adjust) console.log(clip);

  const end = offset + duration;
  const newClip = { start, ...nodes };
  if (cakes.length > 0 && offset < cakes[cakes.length - 1].$.end) {
    const result = [];
    for (const cake of cakes) {
      if (offset >= cake.$.end || end <= cake.$.offset) {
        result.push(cake);
      }
      if (offset > cake.$.offset && offset < cake.$.end) {
        const { $: { duration: cakeDuration, end: cakeEnd, ...params }, ...others } = cake;
        result.push({
          $: {
            ...params,
            duration: (cakeDuration - cakeEnd) + offset,
            end: offset,
          },
          ...others,
        });
      }
      if (adjust && end > cake.$.offset && offset < cake.$.end) {
        const { $: { offset: cakeOffset, end: cakeEnd }, clips } = cake;
        const newOffset = Math.max(cakeOffset, offset);
        const newEnd = Math.min(cakeEnd, end);
        result.push({
          $: {
            offset: newOffset,
            duration: newEnd - newOffset,
            end: newEnd,
          },
          clips: [...clips, newClip],
        });
      } else if (end > cake.$.offset && end <= cake.$.end) {
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
        const { $: { end: cakeEnd }, ...others } = cake;
        result.push({
          $: {
            offset: end,
            duration: cakeEnd - end,
            end: cakeEnd,
          },
          ...others,
        });
      }
    } // end no adjust
    return result;
  }

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
