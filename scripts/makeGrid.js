import * as THREE from "THREE";
import { SpriteText2D, textAlign } from "three-text2d";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  var names = ["P", "W", "L", "G"];
  var colors = [0x3d85c6, 0xff4233, 0xf9ff33, 0x6aa84f];
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

  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      randNum = Math.floor(Math.random() * names.length);
      thisName = names[randNum];
      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellGap,
        Math.sqrt(1 + randNum),
        cellSize * cellGap
      );
      //make material for each cell
      material = new THREE.MeshPhongMaterial({
        color: colors[randNum]
      });
      //make mesh for cell
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x * cellSize, Math.sqrt(1 + randNum / 2), y * cellSize);
      mesh.name = thisName;
      //make text over cell
      let text = textMaker(thisName, thisCol, count);
      text.scale.set(0.005, 0.005, 0.005);
      text.position.y = mesh.position.y + 0.5;
      mesh.add(text);
      grid.add(mesh);
      count++;
    }
  }
  return grid;
}

function textMaker(thisName, thisCol, count) {
  let string = thisName + " " + count.toString();
  var text = new SpriteText2D(string.toString(), {
    align: textAlign.center,
    font: "50px arial",
    fillStyle: thisCol,
    antialias: true
  });
  return text;
}
