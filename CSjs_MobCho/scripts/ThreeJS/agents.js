import * as THREE from "three";
import * as texPath from "../ThreeJS/flare.png";

export function callAgents(scene, sizeX, sizeY) {
  //add pedestrians per grid object
  let agents = makeAgents(sizeX, sizeY, [0.2, 0.5, 0.1, 0.2], 1000, 20, 5, 50);
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
  var colors = [[255, 0, 150], [50, 150, 255], [0, 50, 170], [50, 200, 0]];

  var agents;
  var geometry = new THREE.BufferGeometry();
  var posArr = [];
  var colArr = [];
  var typesArr = [];
  var distanceArr = [];
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
    distanceArr.push(0);
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
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: false,
    map: texture,
    depthTest: true,
    vertexColors: THREE.VertexColors
  });
  agents = new THREE.Points(geometry, material);
  //set name for agents to delete after
  agents.name = "agents";

  //grab the agents pos array for animation
  var posArr = posBuffer.array;
  var typesBufferArr = typesBuffer.array;

  //call anim looper
  animate();

  console.log(agents);

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

    let p1 = Storage.agentSpawnArr[1];

    //run through location array [x,y,z,x,y,z..]
    //of all agents in this cell
    for (let i = 0; i < posArr.length; i = i + 3) {
      // find random pos to spawn out of active cells array
      let rndPosObj =
        Storage.agentSpawnArr[
          Math.floor(Math.random() * Storage.agentSpawnArr.length)
        ];

      //set bounderies
      if (
        posArr[i] >= sizeX + buffer ||
        posArr[i] <= -buffer ||
        posArr[i + 2] >= sizeY + buffer ||
        posArr[i + 2] <= -buffer
      ) {
        //renew position after spwan
        // posArr[i] = rndPosObj.x;
        // posArr[i + 2] = rndPosObj.z;

        posArr[i] = Math.random() * sizeX;
        posArr[i + 2] = Math.random() * sizeY;
      } else {
        //speed and dir of move
        // posArr[i] += Math.cos(angle) / speed / (typesBufferArr[i / 3] + 1);
        // posArr[i + 2] += Math.sin(angle) / speed / (typesBufferArr[i / 3] + 1);

        // var angleDeg =
        //   (Math.atan2(posArr[i + 2] - p1.z, posArr[i].x - p1.x) * 180) /
        //   Math.PI;
        // console.log((Math.atan2(p1.z - posArr[i + 2], p1.x) * 180) / Math.PI);
        let a =
          (Math.atan2(p1.z - posArr[i + 2], p1.x - -posArr[i]) * 180) / Math.PI;
        posArr[i] += Math.sin(a) / 10;
        posArr[i + 2] += Math.cos(a) / 10;
      }

      if (angle < 20) {
        angle++;
      } else {
        angle = 0;
      }
    }
  }
}