import subtract from './subtract';
import concat from './concat';


// sample 1
const rendered = [
  { x: 1, y: 3, data: '[1:3]' },
  { x: 5, y: 8, data: '[5:8]' },
  { x: 10, y: 12, data: '[10:12]' },
  { x: 15, y: 19, data: '[15:19]' },
];
const renderRange = { x: 4, y: 11 };

console.log('rendered cache for block', rendered);
console.log('render range for block', renderRange);
const needToRender = subtract(rendered, renderRange);
console.log('need to render', needToRender);
const newRendered = needToRender.map(({ x, y }) => ({ x, y, data: `[${x}:${y}]` }));
console.log('new rendered', newRendered);
console.log('save new rendered to block cache', concat(rendered, newRendered));
