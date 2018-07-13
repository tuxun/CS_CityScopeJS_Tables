import * as THREE from "THREE";
import { SpriteText2D, textAlign } from "three-text2d";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  var names = ["W", "L", "G", "P"];
  var colors = [0xff4233, 0xf9ff33, 0x6aa84f, 0x3d85c6];
  var count = 0;
  var cellSize = 1;
  var cellGap = 0.9;
  var mesh = null;
  var grid = new THREE.Object3D();
  var geometry = null;
  var material = null;
  //get center of model for camera
  var thisCol = null;
  var thisName = null;
  var randNum;
  ///
  var tmpCounterP = 0;

  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      if (tmpCounterP > Math.sqrt(sizeX * sizeY)) {
        randNum = Math.floor(Math.random() * (names.length - 1));
      } else {
        randNum = Math.floor(Math.random() * names.length);
      }

      if (randNum === 3) {
        tmpCounterP++;
      }

      thisName = names[randNum];

      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellGap,
        0.1,
        cellSize * cellGap
      );
      //make material for each cell
      material = new THREE.MeshStandardMaterial({
        color: colors[randNum]
      });
      //make mesh for cell
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x * cellSize, 0.05, y * cellSize);
      mesh.name = thisName;
      //make text over cell
      let string = thisName + " " + count.toString();
      var text = new SpriteText2D(string.toString(), {
        align: textAlign.center,
        font: "50px arial",
        fillStyle: thisCol,
        antialias: true
      });
      text.scale.set(0.005, 0.005, 0.005);
      text.position.y = mesh.position.y + 0.5;
      mesh.add(text);

      grid.add(mesh);
      count++;
    }
  }

  return grid;
}
