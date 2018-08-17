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
      1000
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
  camera.up.set(1, -1, 0);
  //
  //IMPORTANT: renderer.domElement solves DAT.GUI
  //issue with drop down-menu not responding
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(gridX / 2, 0, gridY / 2);

  /////////////// LIGHTS ///////////////////////
  //Create a PointLight and turn on shadows for the light
  // var ambLight = new THREE.AmbientLight(0xffffff, 0.3); // soft white light
  // scene.add(ambLight);
  // // Spotlight for specific illumination

  // var spotLight = new THREE.SpotLight(0xffffff, 0.7, 200);
  // spotLight.castShadow = true;
  // spotLight.shadow.bias = 0.0000001;
  // spotLight.shadow.mapSize.width = 1024; // Shadow Quality
  // spotLight.shadow.mapSize.height = 1024; // Shadow Quality
  // //solves shadow issue for ortho cams
  // spotLight.shadow.camera.left = -3000;
  // spotLight.shadow.camera.top = -3000;
  // spotLight.shadow.camera.right = 3000;
  // spotLight.shadow.camera.bottom = 3000;
  // spotLight.position.set(gridX / 2, 30, 0);
  // scene.add(spotLight);

  // LIGHTS
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
  hemiLight.color.setHSL(1, 1, 0.9);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);
  // var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);
  //
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.color.setHSL(1, 1, 0.95);
  dirLight.position.set(-gridX, 20, -gridY);
  // dirLight.position.multiplyScalar(3);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2000;
  dirLight.shadow.mapSize.height = 2000;
  var d = 30;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 300;
  dirLight.shadow.bias = 0.000001;
  // var dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
  // scene.add(dirLightHeper);

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
    var x = dirLight.position.x,
      z = dirLight.position.z,
      rotSpeed = 0.0005;
    dirLight.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    dirLight.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
    renderer.render(scene, camera);

    controls.update();
  }

  return grid;
}
