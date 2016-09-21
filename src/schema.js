import { Schema, arrayOf } from 'normalizr';
import uuid from 'uuid';


const calculateFrames = (timestamp) => {
  if (!timestamp) return 0;
  if (!isNaN(timestamp)) return timestamp;

  const fracRe = /(\d+)\/(\d+)s/i;
  const numRe = /(\d+)s/i;
  let result = timestamp.match(fracRe);
  if (result) {
    return (Number(result[1]) / Number(result[2])) * 30;
  }

  result = timestamp.match(numRe);
  return Number(result[1]);
};

const clip = new Schema('clips', {
  idAttribute: () => uuid(),
  assignEntity: (output, key, value, input) => {
    output.$.lane = Number(output.$.lane) || 0;
    if (key === 'clip') {
      input.clip.map((data) => {
        data.$.offset = calculateFrames(data.$.offset) + calculateFrames(input.$.offset);
        return data;
      });

      delete output.clip;
    } else if (key === 'video') {
      output.video = output.video[0];
      output.$.ref = output.video.$.ref;
    } else if (key === '$') {
      output.$.offset = calculateFrames(input.$.offset);
      output.$.duration = calculateFrames(input.$.duration);
      output.$.start = calculateFrames(input.$.start);
    } else if (key.startsWith('adjust')) {
      output.$.adjust = true;
    }
  },
});

clip.define({
  clip: arrayOf(clip),
});

export const clipSchema = clip;
export const clipArraySchema = arrayOf(clip);
