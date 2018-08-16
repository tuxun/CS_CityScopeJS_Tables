import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { makeGrid } from "./gridSetup";

//
export function threeInit(cityIOdata) {
  //get table dims
  var gridX = cityIOdata.header.spatial.ncols;
  var gridY = cityIOdata.header.spatial.nrows;
  //three vars
  var camera;
  var scene;
  var renderer;
  var controls;
  //could be edited - Square for now
  // var CANVAS_WIDTH = window.innerWidth;
  // var CANVAS_HEIGHT = window.innerHeight;
  //fixed resolution for canvas
  var CANVAS_WIDTH = 1000;
  var CANVAS_HEIGHT = 1000;
  ///////////////SETUP SCENE///////////////////////
  let threeDiv = document.createElement("div");
  document.body.appendChild(threeDiv);
  threeDiv.id = "threeDiv";
  threeDiv.className = "threeDiv";
  // add prjmaping

  scene = new THREE.Scene();

  // set up the renderer
  renderer = window.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

  renderer.domElement.id = "THREEcanvas";

  //put to div
  threeDiv.appendChild(renderer.domElement);

  /////////////// CAMERA ///////////////////////
  if (camera === undefined) {
    //pers. cam
    // camera = new THREE.PerspectiveCamera(
    //   70,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   10000
    // );
    // camera.position.set(gridX, 20, gridY);

    /////////////
    var frustumSize = 100;
    var aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    var zoomFactor = 12;
    camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -zoomFactor,
      (frustumSize * aspect) / zoomFactor,
      frustumSize / zoomFactor,
      frustumSize / -zoomFactor,
      0,
      50
    );

    // camera = new THREE.PerspectiveCamera(
    //   80,
    //   CANVAS_WIDTH / CANVAS_HEIGHT,
    //   1,
    //   100
    // );
  }
  //set camera in accordance to grid
  camera.position.set(gridX / 2, 10, gridY / 2);
  //
  //rotate camera around axis if needed
  // camera.up.set(-1, -1, 0);
  //
  //IMPORTANT: renderer.domElement solves DAT.GUI
  //issue with drop down-menu not responding
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(gridX / 2, 0, gridY / 2);

  /////////////// LIGHTS ///////////////////////
  //Create a PointLight and turn on shadows for the light
  var ambLight = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
  scene.add(ambLight);
  // Spotlight for specific illumination

  var spotLight = new THREE.DirectionalLight(0xfffffff, 1, 100);
  spotLight.position.set(gridX * 2, 20, gridY * 2);
  spotLight.shadow.camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -zoomFactor,
    (frustumSize * aspect) / zoomFactor,
    frustumSize / zoomFactor,
    frustumSize / -zoomFactor,
    0,
    50
  );

  spotLight.castShadow = true;
  spotLight.shadow.bias = 0.000001;
  spotLight.shadow.mapSize.width = 512; // Shadow Quality
  spotLight.shadow.mapSize.height = 512; // Shadow Quality
  scene.add(spotLight);

  ////AXIS GRID HELPERS
  // let axes = new THREE.AxesHelper(100);
  // scene.add(axes);

  //make grid geom
  let grid = makeGrid(gridX, gridY);
  scene.add(grid);

  //call loop when done
  animate();

  //loop
  function animate() {
    render();

    requestAnimationFrame(animate);
  }
  //render
  function render() {
    renderer.render(scene, camera);

    controls.update();
  }

  return grid;
}
