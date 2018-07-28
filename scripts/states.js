// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import "babel-polyfill";

import * as THREE from "THREE";
import { tweenCol } from "./modules";
import { remapCol } from "./modules";
var TWEEN = require("@tweenjs/tween.js");
import * as PEDS from "./peds";

/////////////// landUseGrid maker ///////////////////////
export function landUseMap(grid, cityIOdata) {
  var names = ["P", "W", "L", "G"];
  var colors = [0x3d85c6, 0xff4233, 0xf9ff33, 0x6aa84f];

  for (let i = 0; i < grid.children.length; i++) {
    //cleanup peds at state reset
    if (grid.children[i].children[1]) {
      grid.children[i].remove(grid.children[i].children[1]);
    }
    //reset all sizes and positions
    grid.children[i].position.y = 0;
    grid.children[i].scale.y = 1;
    // grid.children[i].children["0"].scale. = 1;
    //cell number display
    grid.children[i].children["0"].text = i.toString();

    // set the type for each cell [WIP]
    grid.children[i].material.color.set(colors[cityIOdata.grid[i] + 1]);
    grid.children[i].name = names[cityIOdata.grid[i] + 1];
    //add name to cell text display
    grid.children[i].children["0"].text += " > " + grid.children[i].name;
  }
}

/////////////// searchNearest  ///////////////////////
export function walkabilityMap(thisType, searchType, grid, x, y, animDuration) {
  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    //draw all in black and reset scale/pos
    grid.children[i].material.color.set(0x181818);
    grid.children[i].position.y = 0;
    grid.children[i].scale.y = 1;
    //remove old peds from this cell
    if (grid.children[i].children[1]) {
      grid.children[i].remove(grid.children[i].children[1]);
    }
    //;

    //check if grid cell is the type we look for
    if (grid.children[i].name === thisType) {
      let NeigbhorsArr = [];

      //if so, collect cells around [WIP]
      NeigbhorsArr.push(
        grid.children[i + 1],
        grid.children[i - 1],
        grid.children[i + x],
        grid.children[i - x],
        grid.children[i + x + 1],
        grid.children[i - x - 1]
      );
      let countRes = countNeigbhors(NeigbhorsArr, thisType, searchType);
      //update size to show results
      grid.children[i].scale.y += countRes * 2;
      grid.children[i].position.y += countRes;
      // update text inner cell with % of access
      grid.children[i].children["0"].text = Math.floor(countRes * 100) + "%";
      // if (countRes === 1) console.log(grid.children[i]);
      //grid.children[i].children["0"].text += " " + cellCol;

      //remap neighbors count to color on a scale of green to red
      let cellCol =
        "rgb(" +
        remapCol(countRes)[0] +
        "," +
        remapCol(countRes)[1] +
        "," +
        remapCol(countRes)[2] +
        ")";

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
