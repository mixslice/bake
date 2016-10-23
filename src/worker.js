import fetch from 'isomorphic-fetch';

export default class Worker {
  constructor(apiRoot) {
    this.apiRoot = apiRoot;
  }

  send(body) {
    fetch(`${this.apiRoot}/app/render`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then((data) => {
      console.log('worker request succeeded with JSON response', data);
    })
    .catch((error) => {
      console.log('request failed', error);
    });
  }

  concat(body) {
    return fetch(`${this.apiRoot}/app/concat`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
