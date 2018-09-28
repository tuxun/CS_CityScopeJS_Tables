import * as THREE from "three";
import * as texPath from "../ThreeJS/ball.png";

export function callAgents(scene, sizeX, sizeY) {
  //add pedestrians per grid object
  let agents = makeAgents(sizeX, sizeY, [255, 255, 255], 1000, 2.5, 50);
  scene.add(agents);
}
function makeAgents(
  sizeX,
  sizeY,
  cellColor,
  maxparticles,
  particleSize,
  speed
) {
  var agents;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colArr = [];
  var texture = new THREE.TextureLoader().load(texPath.default);
  //ratio of particles to num of neighbors
  var particles = maxparticles;

  //FIXED COLORS -- MUST BE REMAPPED to 0-1 range!!
  let colR = cellColor[0] / 255;
  let colG = cellColor[1] / 255;
  let colB = cellColor[2] / 255;

  for (var i = 0; i < particles; i++) {
    colArr.push(colR, colG, colB);
    // positions
    var x = Math.random() * sizeX;
    var z = Math.random() * sizeY;
    positions.push(x, 0.5, z);
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
  // return agents for adding to scene
  return agents;
  // animate
  function animate() {
    requestAnimationFrame(animate);
    updateAgentsPositions();
    agents.geometry.attributes.position.needsUpdate = true;
    agents.geometry.attributes.color.needsUpdate = true;
  }

  ////////////////////////////////////////

  function updateAgentsPositions() {
    let angle = 0;
    //run through location array [x,y,z,x,y,z..]
    //of all agents in this cell
    for (let i = 0; i < posArr.length; i = i + 3) {
      //set X
      if (posArr[i] >= sizeX || posArr[i] <= -0.5) {
        posArr[i] = (sizeX / 2) * Math.random();
      } else {
        //speed and dir of move
        posArr[i] += Math.cos(angle) / speed;
      }

      //set Z
      if (posArr[i + 2] >= sizeY || posArr[i + 2] <= -0.5) {
        posArr[i + 2] = (sizeY / 2) * Math.random();
      } else {
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
