// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawcalls.html
import * as THREE from "THREE";

export function makePeds(color, NeigbhorsArr, countRes) {
  var cellPeds;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];
  //ratio of particles to num of neighbors
  var particles = 100 * countRes + 10 / NeigbhorsArr.length;

  //size of bounding box in THREE units
  var n = 0.4,
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
    new THREE.Float32BufferAttribute(positions, 3).setDynamic(true)
  );
  geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  var material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: THREE.VertexColors
  });

  cellPeds = new THREE.Points(geometry, material);
  //grab the peds pos array
  var posArr = cellPeds.geometry.attributes.position.array;

  // animate
  function animate() {
    requestAnimationFrame(animate);
    updatePositions(posArr);
    cellPeds.geometry.attributes.position.needsUpdate = true;
  }
  //call anim at start
  animate();
  //send back to scene
  return cellPeds;

  ////////////////////////////////////////
  function updatePositions(positions) {
    for (let i = 0; i < positions.length; i = i + 3) {
      //set Y
      positions[i + 1] = 2;

      //set X
      if (positions[i] <= NeigbhorsArr.length / 2) {
        positions[i] += Math.random() / 20;
      }
      if (positions[i] >= 2) {
        positions[i] = 0;
      }
    }
  }
}
