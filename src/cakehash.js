import crypto from 'crypto';

export default function cakeHash(cakes) {
  const newCake = cakes.map((cake) => {
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
      duration: cake.duration,
      clips: normalizedClips,
    };
  });

  const hashMap = {};
  for (const cake of newCake) {
    const { hash, start, duration, clips } = cake;
    const end = start + duration;
    const obj = hashMap[hash];
    if (!obj) {
      hashMap[hash] = {
        range: [{ start, end }],
        clips,
      };
    } else {
      obj.range.push({ start, end });
    }
  }
  return hashMap;
}
