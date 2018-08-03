// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawcalls.html
import * as THREE from "THREE";
import * as texPath from "../images/ball.png";
import { rndInt } from "./modules";

export function makePeds(cellColor, NeigbhorsArr, countRes) {
  var cellPeds;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colArr = [];
  var texture = new THREE.TextureLoader().load(texPath.default);
  var maxparticles = 2000;

  //ratio of particles to num of neighbors
  var particles = (maxparticles * countRes) / NeigbhorsArr.length;

  //size of bounding box in THREE units
  var n = 1;
  // particles spread in the cube
  var n2 = n / 2;

  //FIXED COLORS -- MUST BE REMAPPED to 0-1 range!!
  let colR = rndInt(cellColor[0], cellColor[0] + 50) / 255;
  let colG = rndInt(cellColor[1], cellColor[1] + 50) / 255;
  let colB = rndInt(cellColor[2], cellColor[2] + 50) / 255;

  for (var i = 0; i < particles; i++) {
    colArr.push(colR, colG, colB);

    // positions
    var x = Math.random() * n - n2;
    var z = Math.random() * n - n2;
    positions.push(x, 2, z);
  }
  //
  let posBuffer = new THREE.Float32BufferAttribute(positions, 3).setDynamic(
    true
  );
  let colBuffer = new THREE.Float32BufferAttribute(colArr, 3);
  //
  geometry.addAttribute("position", posBuffer);
  geometry.addAttribute("color", colBuffer);
  //
  var material = new THREE.PointsMaterial({
    size: 3,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: false,
    map: texture,
    depthTest: false,
    vertexColors: THREE.VertexColors
  });

  cellPeds = new THREE.Points(geometry, material);

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
        //speed and dir of move
        posArr[i] += Math.cos(angle) / 200;
      }

      //set Z
      if (posArr[i + 2] >= 1 || posArr[i + 2] <= -1) {
        posArr[i + 2] = 0;
      } else if (posArr[i + 2] < 1 || posArr[i + 2] > -1) {
        posArr[i + 2] += Math.sin(angle) / 200;
      }

      if (angle < countRes * 360) {
        angle++;
      } else {
        angle = 0;
      }
    }
  }
}
