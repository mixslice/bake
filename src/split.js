const splitClips = (data) => {
  const result = [];

  for (const lane of Object.keys(data).sort()) {
    console.log(lane);
    const clipsInLane = data[lane];
    for (const clip of clipsInLane) {
      console.log(clip);
    }
  }
  return result;
};

export default splitClips;
