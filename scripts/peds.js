// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawcalls.html
import * as THREE from "THREE";

export function makePeds(color) {
  var peds;
  var particles = 1000;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];
  var color = new THREE.Color();
  var n = 1,
    n2 = n / 2; // particles spread in the cube
  for (var i = 0; i < particles; i++) {
    // positions
    var x = Math.random() * n - n2;
    var y = Math.random() * n + n2;
    var z = Math.random() * n - n2;
    positions.push(x, y, z);
    // colors

    colors.push(color.r, color.g, color.b);
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
  peds = new THREE.Points(geometry, material);

  return peds;
}
