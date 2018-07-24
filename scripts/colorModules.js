////////////////////////////////////////
export function remapCol(countRes) {
  let i = 100 * countRes;
  // return "hsl(" + i + ",100%,50%)";

  let R = Math.ceil(255 - 255 * (i / 100));
  let G = Math.ceil(255 * (i / 100));
  let B = 0;

  return [R, G, B];
}
