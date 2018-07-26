import * as THREE from "THREE";
import { SpriteText2D, textAlign } from "three-text2d";

/////////////// GEOMETRY  ///////////////////////
export function makeGrid(sizeX, sizeY) {
  var cellSize = 1;
  var cellGap = 0.9;
  var mesh = null;
  var grid = new THREE.Object3D();
  var geometry = null;
  var material = null;
  //loop through grid making
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellGap,
        1,
        cellSize * cellGap
      );
      //make material for each cell
      material = new THREE.MeshPhongMaterial({
        color: "gray"
      });
      //make mesh for cell
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x * cellSize, 0.5, y * cellSize);
      grid.add(mesh);

      // make text over cell
      let text = textMaker(" ", "white");
      text.scale.set(0.005, 0.005, 0.005);
      text.position.y = mesh.position.y + 0.5;
      mesh.add(text);
    }
  }
  return grid;
}

/////////////// landUseGrid maker ///////////////////////
export function landUseGrid(grid, cityIOdata) {
  var names = ["P", "W", "L", "G"];
  var colors = [0x3d85c6, 0xff4233, 0xf9ff33, 0x6aa84f];

  for (let i = 0; i < grid.children.length; i++) {
    //reset all
    grid.children[i].position.y = 0;
    grid.children[i].scale.y = 1;
    // grid.children[i].children["0"].scale. = 1;

    grid.children[i].children["0"].text = i.toString();

    grid.children[i].material.color.set(colors[cityIOdata.grid[i] + 1]);
    grid.children[i].name = names[cityIOdata.grid[i] + 1];
    grid.children[i].children["0"].text += " > " + grid.children[i].name;
  }
}

/////////////// TEXT OVER  ///////////////////////
function textMaker(string, thisCol) {
  var text = new SpriteText2D(string.toString(), {
    align: textAlign.center,
    font: "30px arial",
    fillStyle: thisCol,
    antialias: true
  });
  return text;
}
