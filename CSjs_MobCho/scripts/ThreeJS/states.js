// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import "babel-polyfill";
import { remapCol } from "./THREEmodules";
import { drawCell } from "./THREEmodules";
import * as PEDS from "../GRID/peds";

/////////////// searchNearest  ///////////////////////

export function walkabilityMap(grid, thisType, searchType, NeigbhorsLen) {
  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    //reset  color
    let thisCell = grid.children[i];
    //check if not text
    let countResults = 0;
    //draw all in gray and reset scale/pos
    thisCell.material.color.set(0x000000);
    //remove peds from each cell children
    if (thisCell.children["0"]) {
      //remove old peds from this cell
      thisCell.remove(thisCell.children["0"]);
    }
    //check if grid cell is NOT our current search type
    if (thisCell.name !== thisType) {
      //return values for neighboring cells
      countResults = (function() {
        let counter = 0;
        let resCount = 0;
        for (let x = i - NeigbhorsLen; x < i + NeigbhorsLen; x++) {
          if (
            grid.children[x] != null &&
            grid.children[x].name === searchType
          ) {
            resCount++;
          }
          counter++;
        }
        return resCount / counter;
      })();
    }
    let thisRGB = remapCol(countResults);
    // remap neighbors count to color on a scale of green to red
    let cellCol =
      "rgb(" + thisRGB[0] + "," + thisRGB[1] + "," + thisRGB[2] + ")";
    //recolor the cells with TWEEN
    drawCell(thisCell, cellCol, 5000, makePeds);

    function makePeds() {
      //add pedestrians per grid object
      let peds = PEDS.makePeds(
        [thisRGB[0], thisRGB[1], thisRGB[2]],
        NeigbhorsLen,
        countResults,
        1000,
        5,
        100,
        2
      );
      //add peds to cell
      thisCell.add(peds);
    }
  }
}
