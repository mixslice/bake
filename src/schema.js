import { Schema, arrayOf } from 'normalizr';
import uuid from 'uuid';


const clip = new Schema('clips', {
  idAttribute: () => uuid(),
  assignEntity: (output, key, value, input) => {
    output.$.lane = Number(output.$.lane) || 0;
    if (key === 'clip') {
      input.clip.map((data) => {
        data.$.offset = `${data.$.offset}+${input.$.offset}`;
        return data;
      });

      delete output.clip;
    } else if (key === 'video') {
      output.video = output.video[0];
      output.$.ref = output.video.$.ref;
    }
  },
});

clip.define({
  clip: arrayOf(clip),
});

export const clipSchema = clip;
export const clipArraySchema = arrayOf(clip);
