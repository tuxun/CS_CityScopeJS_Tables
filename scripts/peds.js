// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawcalls.html
import * as THREE from "THREE";
import * as texPath from "../images/ball.png";

export function makePeds(color, NeigbhorsArr, countRes) {
  var cellPeds;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];

  var texture = new THREE.TextureLoader().load(texPath.default);

  var maxparticles = 100;

  //ratio of particles to num of neighbors
  var particles = (maxparticles * countRes) / NeigbhorsArr.length;

  //size of bounding box in THREE units
  var n = 1;
  // particles spread in the cube
  var n2 = n / 2;
  for (var i = 0; i < particles; i++) {
    // colors -WIP GET THIS IN RGB
    colors.push(color[0]);
    colors.push(color[1]);
    colors.push(color[2]);

    // positions
    var x = Math.random() * n - n2;
    var z = Math.random() * n - n2;
    positions.push(x, 2, z);
  }

  let posBuffer = new THREE.Float32BufferAttribute(positions, 3).setDynamic(
    true
  );

  geometry.addAttribute("position", posBuffer);
  geometry.addAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3).setDynamic(true)
  );

  geometry.computeBoundingSphere();
  var material = new THREE.PointsMaterial({
    size: 1,
    transparent: true,
    opacity: 0.8,
    vertexColors: THREE.VertexColors,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: false,
    map: texture,
    depthTest: false
  });

  cellPeds = new THREE.Points(geometry, material);
  // console.log(cellPeds.geometry.attributes.color.array);

  //grab the peds pos array for animation
  var posArr = posBuffer.array;

  // animate
  function animate() {
    requestAnimationFrame(animate);
    updatePositions();
    cellPeds.geometry.attributes.position.needsUpdate = true;
    cellPeds.geometry.attributes.color.needsUpdate = true;
  }

  //call anim looper
  animate();
  //send back to scene
  return cellPeds;

  ////////////////////////////////////////
  function updatePositions() {
    let angle = 0;
    //run through location array [x,y,z,x,y,z..]
    //of all peds in this cell

    for (let i = 0; i < posArr.length; i = i + 3) {
      //set fix Y
      posArr[i + 1] = 0;

      //set X NeigbhorsArr.length / 4
      if (posArr[i] >= 1 || posArr[i] <= -1) {
        posArr[i] = 0;
      } else if (posArr[i] < 1 || posArr[i] > -1) {
        // posArr[i] += Math.random() / 20;
        posArr[i] += Math.cos(angle) * 0.01;
      }

      //set Z
      if (posArr[i + 2] >= 1 || posArr[i + 2] <= -1) {
        posArr[i + 2] = 0;
      } else if (posArr[i + 2] < 1 || posArr[i + 2] > -1) {
        posArr[i + 2] += Math.sin(angle) * 0.01;
      }

      if (angle < countRes * 360) {
        angle++;
      } else {
        angle = 0;
      }
    }
  }
}
