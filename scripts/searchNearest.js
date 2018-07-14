// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import * as THREE from "THREE";
import { tweenCol } from "./tweenModules";
var TWEEN = require("@tweenjs/tween.js");

export function searchNearest(thisType, searchType, grid, x, y) {
  var typeArr = [];

  for (let i = 0; i < grid.children.length; i++) {
    if (grid.children[i].name === thisType) {
      //find cells around [WIP]
      typeArr.push([
        // this brick
        grid.children[i],
        //bricks around
        grid.children[i + 1],
        grid.children[i - 1],
        grid.children[i + x],
        grid.children[i - x]
      ]);
    } else {
      grid.children[i].material.color.set(0x181818);
    }
  }
  vizNeigbhor(typeArr);
  ////////////////////////////////////////
  async function vizNeigbhor(typeArr) {
    for (let i = 0; i < typeArr.length; i++) {
      let d = 0;
      typeArr[i].forEach(e => {
        if (e != null && e.name != thisType && e.name == searchType) {
          d++;
          cellColor(e, 0xa1ff00, 5000);
        } else if (e != null && e.name != thisType) {
        }
      });
      typeArr[i][0].children[0].text = i + "_" + d / typeArr[i].length;
      cellColor(typeArr[i][0], remapToCol(d / typeArr[i].length), 5000);
    }
  }
}
////////////////////////////////////////
//color  for each cell
//https://sole.github.io/tween.js/examples/03_graphs.html
function cellColor(obj, color, duration) {
  var target = new THREE.Color(color);
  tweenCol(obj.material.color, target, {
    duration: rndInt(0, duration),
    easing: TWEEN.Easing.Bounce.InOut
  });
}
////////////////////////////////////////
function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
////////////////////////////////////////

function remapToCol(n) {
  let i = 255 * n;
  return "hsl(" + i + ",100%,50%)";
}
