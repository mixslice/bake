// concat
const extract = function ({ x: x1, y: y1, data }, { x: x2, y: y2 }) {
  if (x1 === x2 && y1 === y2) {
    return data;
  }
  return `${data}{${x2}:${y2}}`;
};

const merge = function (a, b) {
  return a + b;
};

const concat = function (r1, r2) {
  const els = [...r1, ...r2]
  .sort(({ x: ax }, { x: bx }) => ax - bx);

  const list = [];
  let { x: start, y: end, data } = els[0];
  for (const el of els) {
    if (el.x > end) {
      list.push({ x: start, y: end, data });
      start = el.x;
      end = el.y;
      data = el.data;
    }

    if (end < el.y) {
      data = merge(data, extract(el, { x: Math.max(end, el.x), y: el.y }));
      end = el.y;
    }
  }

  list.push({ x: start, y: end, data });
  return list;
};

export default concat;
