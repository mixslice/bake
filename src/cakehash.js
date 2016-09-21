import crypto from 'crypto';

export default function cakeHash(cakes) {
  return cakes.map((cake) => {
    const firstStart = cake.clips[0].start;
    const normalizedCake = cake.clips.map(({ start, ...others }) => ({
      offset: firstStart - start,
      ...others,
    }));
    const md5 = crypto
    .createHash('md5')
    .update(JSON.stringify(normalizedCake))
    .digest('hex');
    return {
      [md5]: cake,
    };
  });
}
