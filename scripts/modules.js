import "babel-polyfill";

////////////////////////////////////////////////////////////////////
//get cityIO method [polyfill]
export function getCityIO(cityIOtableURL) {
  console.log("trying to fetch " + cityIOtableURL);
  return fetch(cityIOtableURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      console.log("got cityIO table at " + cityIOdata.meta.timestamp);
      return cityIOdata;
    });
}

////////////////////////////////////////////////////////////////////
//remap color to RGB
export function remapCol(countRes) {
  let R = Math.ceil(255 - 255 * countRes);
  let G = Math.ceil(255 * countRes);
  let B = 0;

  return [R, G, B];
}

////////////////////////////////////////////////////////////////////
//TWEEN colors
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
//Animation TWEEN Loop method
function animate(t) {
  requestAnimationFrame(animate);
  TWEEN.update(t);
}
//start the loop
animate();
