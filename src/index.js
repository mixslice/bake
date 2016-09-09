import subtract from './subtract';
import concat from './concat';


// sample 1
const data1 = [
  { x: 1, y: 3 },
  { x: 5, y: 8 },
  { x: 10, y: 12 },
  { x: 15, y: 19 },
];
const data2 = { x: 4, y: 11 };

console.log('data1', data1);
console.log('data2', data2);
console.log('subtract', subtract(data1, data2));

// sample 2
const data3 = [
  { x: 1, y: 3, data: '[1:3]' },
  { x: 5, y: 8, data: '[5:8]' },
  { x: 10, y: 12, data: '[10:12]' },
  { x: 15, y: 19, data: '[15:19]' },
];
const data4 = [
  { x: 4, y: 11, data: '[4:11]' },
];

console.log('data3', data3);
console.log('data4', data4);
console.log('concat', concat(data3, data4));
