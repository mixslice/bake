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
  return Number(result[1]) * 30;
};

const clip = new Schema('clips', {
  idAttribute: () => uuid(),
  assignEntity: (output, key, value, input) => {
    const newOutput = output;
    newOutput.$.lane = Number(newOutput.$.lane) || 0;
    if (key === 'clip') {
      input.clip.map((data) => {
        const newData = data;
        newData.$.offset = calculateFrames(newData.$.offset)
        + (calculateFrames(input.$.offset) - calculateFrames(input.$.start));
        return newData;
      });

      delete newOutput.clip;
    } else if (key === 'video') {
      newOutput.video = newOutput.video[0];
      newOutput.$.ref = newOutput.video.$.ref;
    } else if (key === '$') {
      newOutput.$.offset = calculateFrames(input.$.offset);
      newOutput.$.duration = calculateFrames(input.$.duration);
      newOutput.$.start = calculateFrames(input.$.start);
    } else if (key.startsWith('adjust')) {
      newOutput.$.adjust = true;
    }
  },
});

clip.define({
  clip: arrayOf(clip),
});

export const clipSchema = clip;
export const clipArraySchema = arrayOf(clip);
