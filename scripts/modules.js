////////////////////////////////////////
////////////////////////////////////////
export function remapCol(countRes) {
  let R = Math.ceil(255 - 255 * countRes);
  let G = Math.ceil(255 * countRes);
  let B = 0;

  return [R, G, B];
}

////////////////////////////////////////
/*///////////////////////////////////////
//postion Usage example
function cellPos(e) {
  var target = new THREE.Vector3(e.position.x, e.position.y + 1, e.position.z); // create on init
  tweenVector3(e.position, target, {
    duration: 5000,
    easing: TWEEN.Easing.Quadratic.InOut
  });
}
////////////////////////////////////////*/

import * as THREE from "THREE";
var TWEEN = require("@tweenjs/tween.js");

//Animates a Vector3 to the target
export function tweenCol(colToAnim, targetCol, options) {
  options = options || {};
  // get targets from options or set to defaults
  var to = targetCol || THREE.Color(),
    easing = options.easing || TWEEN.Easing.Quadratic.In,
    duration = options.duration || 2000;
  // create the tween
  var tweenColor = new TWEEN.Tween(colToAnim)
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
  tweenColor.start();
  // return the tween in case we want to manipulate it later on
  return tweenColor;
}
////////////////////////////////////////////////////////////////////

/* Animates a Vector3 to the target */
export function tweenThreeVec3(vectorToAnimate, target, options) {
  options = options || {};
  // get targets from options or set to defaults
  var to = target || THREE.Vector3(),
    easing = options.easing || TWEEN.Easing.Quadratic.In,
    duration = options.duration || 2000;
  // create the tween
  var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
    .to({ x: to.x, y: to.y, z: to.z }, duration)
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

////////////////////////////////////////////////////////////////////

/* Animates a move to the target */
export async function tweenMoveObj(Obj, target, options) {
  options = options || {};
  // get targets from options or set to defaults
  var to = target || [0, 0, 0],
    easing = options.easing || TWEEN.Easing.Quadratic.In,
    duration = options.duration || 2000;
  // create the tween
  var tweenVector3 = new TWEEN.Tween(Obj)
    .to({ x: to.x, y: to.y, z: to.z }, duration)
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
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//Animation Loop method
function animate(t) {
  requestAnimationFrame(animate);
  TWEEN.update(t);
}
animate();
