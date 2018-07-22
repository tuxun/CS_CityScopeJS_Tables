// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawcalls.html
import * as THREE from "THREE";
var TWEEN = require("@tweenjs/tween.js");
import { tweenVector3 } from "./tweenModules";

export function makePeds(color) {
  var cellPeds;
  var particles = 1;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];
  //size of bounding box in THREE units
  var n = 0.5,
    n2 = n / 2; // particles spread in the cube
  for (var i = 0; i < particles; i++) {
    // positions
    var x = Math.random() * n - n2;
    var y = Math.random() * n * 5;
    var z = Math.random() * n - n2;
    positions.push(x, y, z);
    // colors -WIP GET THIS IN RGB
    colors.push(color[0], color[1], color[2]);
  }
  geometry.addAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  var material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: THREE.VertexColors
  });
  cellPeds = new THREE.Points(geometry, material);

  // console.log(p);
  //https://stackoverflow.com/questions/17410761/how-to-quickly-update-a-large-buffergeometry/20422336#20422336
  ///
  //https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawcalls.html
  // let p = cellPeds.geometry.attributes.position.array;

  // for (let i = 0; i < p.length; i = i + 3) {
  //   let loc = [p[i], p[i + 1], p[i + 2]];
  //   pedPos(loc);
  // }

  return cellPeds;
}

//position Usage
async function pedPos(e) {
  var target = [e[0] + rndInt(0, 5), e[1], e[2] + rndInt(0, 5)]; // create on init
  tweenVector3(e.position, target, {
    duration: rndInt(0, 2000),
    easing: TWEEN.Easing.Quadratic.InOut
  });
}

////////////////////////////////////////
function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
