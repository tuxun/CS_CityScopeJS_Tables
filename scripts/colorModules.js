////////////////////////////////////////
export function remapCol(countRes) {
  let R = Math.ceil(255 - 255 * countRes);
  let G = Math.ceil(255 * countRes);
  let B = 0;

  return [R, G, B];
}
