// concat
function trim({ start: x1, end: y1, data }, { start: x2, end: y2 }) {
  if (x1 === x2 && y1 === y2) {
    return data;
  }
  return `${data}{${x2}:${y2}}`;
}

function concat(a, b) {
  return a + b;
}

export function mergeRanges(...ranges) {
  const rgs = ranges.sort(({ start: a }, { start: b }) => a - b);

  const list = [];
  let { start, end } = rgs[0];
  rgs.forEach((rg) => {
    if (rg.start > end) {
      list.push({ start, end });
      start = rg.start;
      end = rg.end;
    }

    if (end < rg.end) {
      end = rg.end;
    }
  });

  list.push({ start, end });
  return list;
}

export function mergeRangesWithData(...ranges) {
  const rgs = ranges.sort(({ start: a }, { start: b }) => a - b);

  const list = [];
  let { start, end, data } = rgs[0];
  rgs.forEach((rg) => {
    if (rg.start > end) {
      list.push({ start, end, data });
      start = rg.start;
      end = rg.end;
      data = rg.data;
    }

    if (end < rg.end) {
      data = concat(data, trim(rg, { start: Math.max(end, rg.start), end: rg.end }));
      end = rg.end;
    }
  });

  list.push({ start, end, data });
  return list;
}
