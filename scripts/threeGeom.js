import * as THREE from "THREE";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  // global holder for theme colors
  var colors = [
    "#ED5066",
    "#F4827D",
    "#F4B99E",
    "#FDCAA2",
    "#F6ECD4",
    "#CCD9CE",
    "#A5BBB9",
    "#A3BFA2",
    "#80ADA9",
    "#668a87",
    "#405654",
    "#263C3A",
    "#263C3A",
    "#14181a"
  ];
  var cellSize = 1;
  var mesh = null;
  var grid = new THREE.Object3D();
  var geometry = null;
  var material = null;
  //get center of model for camera
  var thisCol;
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      geometry = new THREE.BoxBufferGeometry(cellSize * 0.8, 2, cellSize * 0.8);
      // color
      thisCol = Math.floor(Math.random() * colors.length);
      //
      material = new THREE.MeshStandardMaterial({
        color: thisCol
      });
      //
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x * cellSize, 1, y * cellSize);
      mesh.castShadow = true; //default is false
      mesh.receiveShadow = true; //default
      grid.add(mesh);
    }
  }
  return grid;
}
