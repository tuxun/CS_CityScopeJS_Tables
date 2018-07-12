// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263

import * as THREE from "THREE";
var TWEEN = require("@tweenjs/tween.js");

export function searchNearest(grid, x, y) {
  console.log(x, y);

  var typeArr = [];
  for (let i = 0; i < grid.children.length; i++) {
    if (grid.children[i].name === "P") {
      grid.children[i].material.color.set("red");
      //find cells around [WIP]
      typeArr.push([
        grid.children[i + x],
        grid.children[i + y],
        grid.children[i - x],
        grid.children[i - y]
      ]);
    }
  }
  paintNeighbor(typeArr);
}

async function paintNeighbor(typeArr) {
  for (let i = 0; i < typeArr.length; i++) {
    typeArr[i].forEach(e => {
      if (e != null) {
        /* How to use */
        var target = new THREE.Color(0, 255, 0);
        animCol(e.material.color, target, {
          duration: 1000,
          easing: TWEEN.Easing.Quadratic.InOut,
          update: function(d) {
            // console.log("Updating: " + d);
          },
          callback: function() {
            // console.log("Completed");
          }
        });
      }
    });
  }
}

// async function tweenThis(e) {
//   var t1 = new TWEEN.Tween(e.material.color)
//     .to({ r: 0, g: 255, b: 0 }, 5000)
//     .easing(TWEEN.Easing.Quadratic.InOut)
//     .start();
// }

/* Animates a Vector3 to the target */
function animCol(colToAnim, targetCol, options) {
  options = options || {};
  // get targets from options or set to defaults
  var to = targetCol || THREE.Color(),
    easing = options.easing || TWEEN.Easing.Quadratic.In,
    duration = options.duration || 2000;
  // create the tween
  var tweenVector3 = new TWEEN.Tween(colToAnim)
    .to({ r: to.r, g: to.g, b: to.b }, duration)
    .easing(easing)
    .onUpdate(function(d) {
      if (options.update) {
        options.update(d);
      }
    })
    .onComplete(function() {
      if (options.callback) options.callback();
    });
  // start the tween
  tweenVector3.start();
  // return the tween in case we want to manipulate it later on
  return tweenVector3;
}

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);
