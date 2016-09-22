import { Schema, arrayOf } from 'normalizr';
import uuid from 'uuid';
import { calculateFrames } from './utils';


const clip = new Schema('clips', {
  idAttribute: () => uuid(),
  defaults: { start: 0, lane: 0 },
  assignEntity: (output, key, value, input) => {
    if (key === 'clip') {
      delete output.clip;
    } else if (key === 'offset') {
      output.offset = calculateFrames(input.offset);
    } else if (key === 'duration') {
      output.duration = calculateFrames(input.duration);
    } else if (key === 'start') {
      output.start = calculateFrames(input.start);
    } else if (key === 'lane') {
      output.lane = Number(output.lane);
    } else if (key.startsWith('adjust')) {
      output.adjust = true;
    }
  },
});

clip.define({
  clip: arrayOf(clip),
});

const format = new Schema('formats');
const asset = new Schema('assets');
const effect = new Schema('effects');


export const clipSchema = clip;
export const clipArraySchema = arrayOf(clip);
export const formatSchema = format;
export const formatArraySchema = arrayOf(format);
export const assetSchema = asset;
export const assetArraySchema = arrayOf(asset);
export const effectSchema = effect;
export const effectArraySchema = arrayOf(effect);
