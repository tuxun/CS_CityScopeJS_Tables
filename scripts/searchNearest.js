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

      //add pedestrians per grid object
      let peds = PEDS.makePeds(hslToRgb(countRes * 100, 1, 0.5));
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
// based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB

function hslToRgb(hue, saturation, lightness) {
  if (hue == undefined) {
    return [0, 0, 0];
  }

  var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  var huePrime = hue / 60;
  var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

  huePrime = Math.floor(huePrime);
  var red;
  var green;
  var blue;

  if (huePrime === 0) {
    red = chroma;
    green = secondComponent;
    blue = 0;
  } else if (huePrime === 1) {
    red = secondComponent;
    green = chroma;
    blue = 0;
  } else if (huePrime === 2) {
    red = 0;
    green = chroma;
    blue = secondComponent;
  } else if (huePrime === 3) {
    red = 0;
    green = secondComponent;
    blue = chroma;
  } else if (huePrime === 4) {
    red = secondComponent;
    green = 0;
    blue = chroma;
  } else if (huePrime === 5) {
    red = chroma;
    green = 0;
    blue = secondComponent;
  }

  var lightnessAdjustment = lightness - chroma / 2;
  red += lightnessAdjustment;
  green += lightnessAdjustment;
  blue += lightnessAdjustment;

  return [
    Math.round(red * 255),
    Math.round(green * 255),
    Math.round(blue * 255)
  ];
}
