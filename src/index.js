// main
const subtract = function (rgs, block) {
  const list = [];
  let start = block.x;
  let end;

  for (const rg of rgs) {
    if (rg.x < block.y && rg.y > block.x) {
      if (rg.x > start) {
        end = rg.x;
        list.push({ x: start, y: end });
      }

      start = rg.y;
    }
  }

  if (start < block.y) {
    list.push({ x: start, y: block.y });
  }
  return list;
};

// concat
const concat = function (r1, r2) {
  const newR1 = r1.map(({ x, y }) => ({
    x,
    y,
    r: y - x,
  }));

  return newR1;
};

// sorted array
const arr = [
  { x: 1, y: 3 },
  { x: 5, y: 8 },
  { x: 10, y: 12 },
  { x: 15, y: 19 },
];

const d = { x: 4, y: 11 };
const result = subtract(arr, d);
console.log(result);
console.log(concat(arr, result));
