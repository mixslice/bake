import fetch from 'isomorphic-fetch';
import { saveRenderedObject } from './renderStore';

export default class Worker {
  constructor(apiRoot) {
    this.apiRoot = apiRoot;
  }

  send(cake) {
    fetch(`${this.apiRoot}/app/render`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cakes: [cake] }),
    })
    .then(response => response.json())
    .then((data) => {
      console.log('worker request succeeded with JSON response', data);
      saveRenderedObject(cake.hash, cake.ranges);
    })
    .catch((error) => {
      console.log('request failed', error);
    });
  }

  concat(sequence) {
    return fetch(`${this.apiRoot}/app/concat`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence }),
    })
    .then(response => response.json())
    .then((data) => {
      console.log('concat request succeeded with JSON response', data);
      return data;
    })
    .catch((error) => {
      console.log('request failed', error);
    });
  }
}
