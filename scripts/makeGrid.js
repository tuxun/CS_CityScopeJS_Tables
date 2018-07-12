import * as THREE from "THREE";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  // global holder for theme colors
  var allCols = [
    "rgb(237, 80, 102)",
    "rgb(244, 130, 125)",
    "rgb(244, 185, 158)",
    "rgb(253, 202, 162)",
    "rgb(246, 236, 212)",
    "rgb(204, 217, 206)",
    "rgb(165, 187, 185)",
    "rgb(163, 191, 162)",
    "rgb(128, 173, 169)",
    "rgb(102, 138, 135)",
    "rgb(64, 86, 84)",
    "rgb(38, 60, 58)",
    "rgb(38, 60, 58)",
    "rgb(20, 24, 26)"
  ];
  var colors = [
    "rgb(237, 80, 102)",
    "rgb(253, 202, 162)",
    "rgb(163, 191, 162)",
    "rgb(128, 173, 169)"
  ];
  var names = ["W", "L", "G", "P"];

  var cellSize = 1;
  var cellGap = 0.8;
  var mesh = null;
  var grid = new THREE.Object3D();
  var geometry = null;
  var material = null;
  //get center of model for camera
  var thisCol = null;
  var thisName = null;
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      // color
      thisCol = colors[Math.floor(Math.random() * colors.length)];
      thisName = names[Math.floor(Math.random() * names.length)];

      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellGap,
        1,
        cellSize * cellGap
      );
      //
      material = new THREE.MeshStandardMaterial({
        color: thisCol
      });
      //
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x * cellSize, 0.5, y * cellSize);
      mesh.name = thisName;
      mesh.castShadow = true; //default is false
      mesh.receiveShadow = true; //default
      grid.add(mesh);
    }
  }

  return grid;
}
