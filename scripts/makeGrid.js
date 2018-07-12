import * as THREE from "THREE";
import { SpriteText2D, textAlign } from "three-text2d";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  // global holder for theme colors

  var names = ["W", "L", "G", "P"];
  let count = 0;
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
      thisName = names[Math.floor(Math.random() * names.length)];

      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellGap,
        0.1,
        cellSize * cellGap
      );
      //
      material = new THREE.MeshStandardMaterial({
        color: "white"
      });
      //
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x * cellSize, 0.05, y * cellSize);
      mesh.name = thisName;
      mesh.castShadow = true; //default is false
      mesh.receiveShadow = true; //default

      let string = thisName + "\n" + count.toString();
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
