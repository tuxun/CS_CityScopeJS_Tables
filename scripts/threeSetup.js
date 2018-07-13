// fixes Uncaught ReferenceError: regeneratorRuntime is not defined
import "babel-polyfill";
import * as THREE from "THREE";
import OrbitControls from "three-orbitcontrols";
import { makeGrid } from "./makeGrid.js";
import * as GRID from "./searchNearest.js";

export function threeInit() {
  //three vars
  var camera;
  var scene;
  var renderer;
  var controls;
  var gridX = 50;
  var gridY = 50;

  ///////////////SETUP SCENE///////////////////////
  let threeDiv = document.createElement("div");
  document.body.appendChild(threeDiv);
  threeDiv.id = "threeDiv";
  threeDiv.className = "threeDiv";

  //setup scene
  init();
  //call loop when done
  animate();

  function init() {
    scene = new THREE.Scene();

    // set up the renderer
    renderer = window.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(600, 600);

    //put to div
    threeDiv.appendChild(renderer.domElement);

    /////////////// CAMERA ///////////////////////
    if (camera === undefined) {
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(20, 20, 20);
    }
    //IMPORTANT: renderer.domElement solves DAT.GUI
    //issue with drop downmenu not reposniding
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0); //center of andorra models

    /////////////// LIGHTS ///////////////////////
    //Create a PointLight and turn on shadows for the light
    var ambLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
    scene.add(ambLight);

    ////AXIS GRID HELPERS
    let axes = new THREE.AxesHelper(100);
    scene.add(axes);

    //make grid geom

    let grid = makeGrid(gridX, gridY);
    scene.add(grid);

    document.body.addEventListener("keyup", function(e) {
      if (e.keyCode === 65) {
        GRID.searchNearest(grid, gridX, gridY);
      }
    });
  }

  //loop
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  //render
  function render() {
    controls.update();
    renderer.render(scene, camera);
  }
}
