// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import * as THREE from "THREE";
import { tweenCol } from "./tweenModules";
var TWEEN = require("@tweenjs/tween.js");
import * as PEDS from "./peds";

export function searchNearest(thisType, searchType, grid, x, y) {
  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    //draw all in black
    grid.children[i].material.color.set(0x181818);

    //check if grid cell is the type we look for
    if (grid.children[i].name === thisType) {
      let NeigbhorsArr = [];

      //if so, collect cells around [WIP]
      NeigbhorsArr.push(
        grid.children[i + 1],
        grid.children[i - 1],
        grid.children[i + x],
        grid.children[i - x]
      );
      let countRes = countNeigbhors(NeigbhorsArr, thisType, searchType);
      // text inner cell
      // typeArr[i][0].children[0].text += i + "_" + d / typeArr[i].length;
      let finalCol = remapCol(countRes);
      drawCell(grid.children[i], finalCol, 2000);
      // grid.children[i].scale.set(1, countRes + 1, 1);
      //pedestrians per object
      let peds = PEDS.makePeds(hslToRgb(countRes, 1, 0.5));
      grid.children[i].add(peds);
    }
  }
}

////////////////////////////////////////
function countNeigbhors(NeigbhorsArr, thisType, searchType) {
  let counter = 0;
  for (let i = 0; i < NeigbhorsArr.length; i++) {
    if (
      NeigbhorsArr[i] != null &&
      NeigbhorsArr[i].name != thisType &&
      NeigbhorsArr[i].name == searchType
    ) {
      counter++;
    }
  }
  return counter / NeigbhorsArr.length;
}

////////////////////////////////////////
//color each cell
//https://sole.github.io/tween.js/examples/03_graphs.html
function drawCell(obj, color, duration) {
  var target = new THREE.Color(color);
  tweenCol(obj.material.color, target, {
    duration: rndInt(0, duration),
    easing: TWEEN.Easing.Bounce.In
  });
}

////////////////////////////////////////
function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

////////////////////////////////////////
function remapCol(n) {
  let i = 100 * n;
  return "hsl(" + i + ",100%,50%)";
}

////////////////////////////////////////
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
