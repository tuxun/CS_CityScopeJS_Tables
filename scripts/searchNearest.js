// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import * as THREE from "THREE";
import { tweenCol, tweenVector3 } from "./tweenModules";
var TWEEN = require("@tweenjs/tween.js");

export function searchNearest(grid, x, y) {
  var typeArr = [];
  for (let i = 0; i < grid.children.length; i++) {
    if (grid.children[i].name === "P") {
      grid.children[i].material.color.set("white");
      //find cells around [WIP]
      typeArr.push([
        grid.children[i + 1],
        grid.children[i - 1],
        grid.children[i + x],
        grid.children[i - x]
      ]);
    } else {
      grid.children[i].material.color.set(0x000000);
    }
  }
  vizNeigbhor(typeArr);
}

async function vizNeigbhor(typeArr) {
  for (let i = 0; i < typeArr.length; i++) {
    let d = 0;

    typeArr[i].forEach(e => {
      if (e != null && e.name != "P" && e.name === "L") {
        d++;
        // cellPos(e);
        cellColor(e, 0xa1ff00, 5000);
      }
    });
    console.log(i + ")" + d / typeArr[i].length);
  }
}

//color  for each cell
function cellColor(obj, color, duration) {
  var target = new THREE.Color(color);
  tweenCol(obj.material.color, target, {
    duration: Math.floor(Math.random() * duration),
    easing: TWEEN.Easing.Quadratic.InOut,
    update: function(d) {
      // console.log("Updating: " + d);
    },
    callback: function() {
      // console.log("Completed");
    }
  });
}

//postion for each cell
function cellPos(e) {
  /* How to use */
  var target = new THREE.Vector3(e.position.x, e.position.y + 1, e.position.z); // create on init
  tweenVector3(e.position, target, {
    duration: 5000,
    easing: TWEEN.Easing.Quadratic.InOut,
    update: function(d) {
      // console.log("Updating: " + d);
    },
    callback: function() {
      // console.log("Completed");
    }
  });
}
