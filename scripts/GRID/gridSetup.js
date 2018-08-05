import * as THREE from "three";
import { SpriteText2D, textAlign } from "three-text2d";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  var cellSize = 1;
  var cellGap = 0.95;
  var mesh = null;
  var grid = new THREE.Object3D();
  var geometry = null;
  var material = null;
  var cellObjs = 2;
  //loop through grid making
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      //
      let cellGrp = new THREE.Object3D();
      for (var i = 0; i < cellObjs; i++) {
        for (var j = 0; j < cellObjs; j++) {
          //
          geometry = new THREE.BoxBufferGeometry(
            (cellSize * cellGap) / cellObjs,
            0.5,
            (cellSize * cellGap) / cellObjs
          );
          //make material for each cell
          material = new THREE.MeshPhongMaterial({
            color: "gray"
          });
          //make mesh for cell
          mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          // mesh.position.set(x * cellSize, 0.5, y * cellSize);
          mesh.position.set(
            x * cellSize + i / cellObjs,
            0.5,
            y * cellSize + j / cellObjs
          );
          cellGrp.add(mesh);
        }
      }
      grid.add(cellGrp);
      // make text over cell
      let text = textMaker(" ", "white");
      text.name = "text";
      text.scale.set(0.005, 0.005, 0.005);
      text.position.set(x * cellSize, 1.5, y * cellSize);
      cellGrp.add(text);
    }
  }
  return grid;
}

/////////////// TEXT OVER  ///////////////////////
function textMaker(string, thisCol) {
  var text = new SpriteText2D(string.toString(), {
    align: textAlign.center,
    font: "50px helvetica",
    fillStyle: thisCol,
    antialias: true
  });
  return text;
}
