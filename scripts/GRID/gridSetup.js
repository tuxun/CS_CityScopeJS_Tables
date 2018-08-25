import * as THREE from "three";
import { SpriteText2D, textAlign } from "three-text2d";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  var cellSize = 1;
  var cellScale = 0.98;
  var mesh = null;
  var grid = new THREE.Object3D();
  var textHolder = new THREE.Object3D();
  var geometry = null;
  var material = null;

  //loop through grid making
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellScale,
        1,
        cellSize * cellScale
      );
      //make material for each cell
      material = new THREE.MeshPhongMaterial({
        color: "gray"
      });
      //make mesh for cell
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x * cellSize, -0.5, y * cellSize);
      grid.add(mesh);

      // // // make text over cell
      let text = textMaker("_", "white");
      text.name = "text";
      text.scale.set(0.003, 0.003, 0.003);
      text.position.set(x * cellSize, 6, y * cellSize - 0.2);
      textHolder.add(text);
    }
  }
  return [grid, textHolder];
}

/////////////// TEXT OVER  ///////////////////////
function textMaker(string, thisCol) {
  var text = new SpriteText2D(string, {
    align: textAlign.center,
    font: "50px helvetica",
    fillStyle: thisCol,
    antialias: true
  });
  return text;
}
