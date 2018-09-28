import * as THREE from "three";
import * as texPath from "../ThreeJS/ball.png";
import "../Storage";

export function callAgents(scene) {
  //add pedestrians per grid object
  let agents = makeAgents(1, [255, 0, 0], 1000, 10, 50, 2);
  scene.add(agents);
}

function makeAgents(
  boxSize,
  cellColor,
  maxparticles,
  particleSize,
  speed,
  distance
) {
  var agents;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colArr = [];
  var texture = new THREE.TextureLoader().load(texPath.default);
  //ratio of particles to num of neighbors
  var particles = maxparticles;

  // particles spread in the cube
  var halfBox = boxSize / 2;
  //FIXED COLORS -- MUST BE REMAPPED to 0-1 range!!
  let colR = cellColor[0] / 255;
  let colG = cellColor[1] / 255;
  let colB = cellColor[2] / 255;

  for (var i = 0; i < particles; i++) {
    colArr.push(colR, colG, colB);
    // positions
    var x = Math.random() * boxSize - halfBox;
    var z = Math.random() * boxSize - halfBox;
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
    size: particleSize,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: false,
    map: texture,
    // depthTest: false,
    vertexColors: THREE.VertexColors
  });

  agents = new THREE.Points(geometry, material);
  //set name for agents to delete after
  agents.name = "agents";

  //grab the agents pos array for animation
  var posArr = posBuffer.array;

  //call anim looper
  animate();

  // animate
  function animate() {
    requestAnimationFrame(animate);
    updateAgentsPositions();
    agents.geometry.attributes.position.needsUpdate = true;
    agents.geometry.attributes.color.needsUpdate = true;
  }

  return agents;

  ////////////////////////////////////////
  function updateAgentsPositions() {
    let angle = 0;
    //run through location array [x,y,z,x,y,z..]
    //of all agents in this cell
    for (let i = 0; i < posArr.length; i = i + 3) {
      //set fix Y
      posArr[i + 1] = 0.5;

      //set X NeigbhorsArr.length / 4
      if (posArr[i] >= distance || posArr[i] <= -distance) {
        posArr[i] = 0;
      } else if (posArr[i] < distance || posArr[i] > -distance) {
        //speed and dir of move
        posArr[i] += Math.cos(angle) / speed;
      }
      //set Z
      if (posArr[i + 2] >= distance || posArr[i + 2] <= -distance) {
        posArr[i + 2] = 0;
      } else if (posArr[i + 2] < distance || posArr[i + 2] > -distance) {
        posArr[i + 2] += Math.sin(angle) / speed;
      }
      if (angle < 360) {
        angle++;
      } else {
        angle = 0;
      }
    }
  }
}
