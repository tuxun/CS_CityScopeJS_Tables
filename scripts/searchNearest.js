// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import * as THREE from "THREE";
import { tweenCol } from "./modules";
var TWEEN = require("@tweenjs/tween.js");
import * as PEDS from "./peds";
import { remapCol } from "./modules";

export function searchNearest(thisType, searchType, grid, x, y, animDuration) {
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
      // update text inner cell with % of access

      grid.children[i].children["0"].text = countRes * 100 + "%";

      //remap neighbors count to color on a scale of green to red
      let cellCol =
        "rgb(" +
        remapCol(countRes)[0] +
        "," +
        remapCol(countRes)[1] +
        "," +
        remapCol(countRes)[2] +
        ")";

      grid.children[i].children["0"].text += " " + cellCol;

      //recolor the cells
      drawCell(grid.children[i], cellCol, animDuration);

      //add pedestrians per grid object
      let peds = PEDS.makePeds(
        [remapCol(countRes)[0], remapCol(countRes)[1], remapCol(countRes)[2]],
        NeigbhorsArr,
        countRes
      );
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
