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

export default subtract;
