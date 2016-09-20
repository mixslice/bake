import { normalize } from 'normalizr';
import {
  clipArraySchema,
} from './schema';

let formats = [];
let assets = [];
let effects = [];


const mapReduce = arr => (
  arr
  .map(d => ({ [d.$.id]: d.$ }))
  .reduce((result, item) => {
    const newResult = result;
    const key = Object.keys(item)[0];
    newResult[key] = item[key];
    return newResult;
  })
);

export const normalizeEntities = ({
  fcpxml: {
    resources,
    library,
  },
}) => {
  const { format, asset, effect } = resources[0];
  formats = mapReduce(format);
  assets = mapReduce(asset);
  effects = mapReduce(effect);

  const project = library[0].event[0].project[0];
  const spine = project.sequence[0].spine[0];

  const entities = normalize(spine.clip, clipArraySchema).entities;
  return entities;
};

export const groupClips = (data) => {
  const clips = data.clips;
  const groups = {};

  for (const clipId of Object.keys(clips)) {
    const clip = clips[clipId];
    const list = groups[clip.$.lane];
    if (list) {
      list.push(clip);
    } else {
      groups[clip.$.lane] = [clip];
    }
  }
  return groups;
};
