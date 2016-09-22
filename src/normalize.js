import { normalize } from 'normalizr';
import {
  formatSchema,
  assetArraySchema,
  effectArraySchema,
  clipArraySchema,
} from './schema';
import { calculateFrames } from './utils';


export const normalizeEntities = ({
  fcpxml: {
    resources,
    library,
  },
}) => {
  const { format, asset, effect } = resources;
  const assets = asset.constructor === Array ? asset : [asset];
  const effects = effect.constructor === Array ? effect : [effect];

  const clip = library.event.project.sequence.spine.clip;
  const clips = clip.constructor === Array ? clip : [clip];
  for (const cl of clips) {
    if (cl.clip) {
      const childClip = cl.clip;
      cl.clip = childClip.constructor === Array ? childClip : [childClip];

      for (const data of cl.clip) {
        data.offset = calculateFrames(data.offset)
        + (calculateFrames(cl.offset) - calculateFrames(cl.start));
      }
    }
  }

  const entities = {
    ...normalize(format, formatSchema).entities,
    ...normalize(assets, assetArraySchema).entities,
    ...normalize(effects, effectArraySchema).entities,
    ...normalize(clips, clipArraySchema).entities,
  };
  return entities;
};

export const groupClips = (data) => {
  const clips = data.clips;
  const groups = {};

  for (const clipId of Object.keys(clips)) {
    const clip = clips[clipId];
    const list = groups[clip.lane];
    if (list) {
      list.push(clip);
    } else {
      groups[clip.lane] = [clip];
    }
  }
  return groups;
};
