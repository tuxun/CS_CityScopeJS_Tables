import * as THREE from "three";
import * as texPath from "../ThreeJS/ball.png";

export function callAgents(scene, sizeX, sizeY) {
  //add pedestrians per grid object
  let agents = makeAgents(sizeX, sizeY, [0.2, 0.5, 0.1, 0.2], 5000, 3, 3, 20);
  scene.add(agents);
}
function makeAgents(
  sizeX,
  sizeY,
  colorRatioArr,
  maxparticles,
  particleSize,
  buffer,
  speed
) {
  var colors = [[0, 50, 170], [124, 252, 0], [255, 0, 150], [50, 150, 255]];

  var agents;
  var geometry = new THREE.BufferGeometry();
  var posArr = [];
  var colArr = [];
  var typesArr = [];
  var texture = new THREE.TextureLoader().load(texPath.default);
  //ratio of particles to num of neighbors
  var particles = maxparticles;

  for (var i = 0; i < particles; i++) {
    let colListRnd = Math.floor(Math.random() * colors.length);
    //push color number to array as flag for agent type
    typesArr.push(colListRnd);
    //colors from array
    let rndCol = colors[colListRnd];
    //MUST BE REMAPPED to 0-1 range!!
    let colR = rndCol[0] / 255;
    let colG = rndCol[1] / 255;
    let colB = rndCol[2] / 255;

    colArr.push(colR, colG, colB);
    // positions
    var x = Math.random() * sizeX;
    var z = Math.random() * sizeY;
    posArr.push(x, 0.5, z);
  }
  //
  let posBuffer = new THREE.Float32BufferAttribute(posArr, 3).setDynamic(true);
  let colBuffer = new THREE.Float32BufferAttribute(colArr, 3).setDynamic(true);
  let typesBuffer = new THREE.Float32BufferAttribute(typesArr, 1);
  //
  geometry.addAttribute("position", posBuffer);
  geometry.addAttribute("color", colBuffer);
  geometry.addAttribute("type", typesBuffer);
  //
  var material = new THREE.PointsMaterial({
    size: particleSize,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    map: texture,
    // depthTest: false,
    vertexColors: THREE.VertexColors
  });
  agents = new THREE.Points(geometry, material);
  //set name for agents to delete after
  agents.name = "agents";

  //grab the agents pos array for animation
  var posArr = posBuffer.array;
  var colBufferArr = colBuffer.array;
  var typesBufferArr = typesBuffer.array;

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
    let slider = Storage.slider;
    let angle = 0;
    //run through location array [x,y,z,x,y,z..]
    //of all agents in this cell
    for (let i = 0; i < posArr.length; i = i + 3) {
      // find random pos to spawn out of active cells array
      let agentType = Storage.agentSpawnArr[typesBufferArr[i / 3]];
      let rndPosObj = agentType[Math.floor(Math.random() * agentType.length)];

      //set bounderies
      if (
        posArr[i] >= sizeX + buffer ||
        posArr[i] <= -buffer ||
        posArr[i + 2] >= sizeY + buffer ||
        posArr[i + 2] <= -buffer
      ) {
        //renew position after spwan
        posArr[i] = rndPosObj.x;
        posArr[i + 2] = rndPosObj.z;
      } else {
        //speed and dir of move
        posArr[i] += Math.cos(angle) / speed / (typesBufferArr[i / 3] + 1);
        posArr[i + 2] += Math.sin(angle) / speed / (typesBufferArr[i / 3] + 1);
      }

      if (angle < 20) {
        angle++;
      } else {
        angle = 0;
      }
    }
  }
}
