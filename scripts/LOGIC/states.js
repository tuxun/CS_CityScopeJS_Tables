// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import "babel-polyfill";
import { remapCol } from "./modules";
import { drawCell } from "./modules";
import * as PEDS from "../GRID/peds";

var colorsHold = ["#ed5085", "#fdcaa2", "#76a075", "#aceaf7", "#afafaf"];
/////////////// grid info  ///////////////////////

export function gridInfo(grid, cityIOdata, textHolder) {
  var names = ["P", "W", "L", "G", "Z"];

  for (let i = 0; i < grid.children.length; i++) {
    //base type
    if (cityIOdata.grid[i] === -1 || cityIOdata.grid[i] === 4) {
      grid.children[i].name = "Z";
    } else {
      grid.children[i].name = names[cityIOdata.grid[i]];
    }
    textHolder.children[i].text = i + "_" + grid.children[i].name;
  }
}

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
    drawCell(thisCell, cellCol, 5000);

    //add pedestrians per grid object
    let peds = PEDS.makePeds(
      [thisRGB[0], thisRGB[1], thisRGB[2]],
      NeigbhorsLen,
      countResults,
      1000,
      5,
      100,
      3
    );
    //add peds to cell
    thisCell.add(peds);
  }
}

/////////////// landUseGrid  ///////////////////////
export function landUseMap(grid, cityIOdata) {
  var colors = [0xed5085, 0xfdcaa2, 0x76a075, 0xaceaf7, 0xafafaf];
  var heights = [1, 5, 4, 3, 0.1];
  for (let i = 0; i < grid.children.length; i++) {
    //if exist, cleanup peds at state reset
    let subCell = grid.children[i];
    if (subCell.name) {
      // remove old peds from this cell
      if (subCell.children["0"]) {
        subCell.remove(subCell.children["0"]);
      }
      // set the land use color for each cell [WIP]
      subCell.material.color.set(colors[4]);
      //make all that is not recognize as type 4
      if (cityIOdata.grid[i] === -1 || cityIOdata.grid[i] === 4) {
        subCell.material.color.set(colors[4]);
        subCell.scale.y = 0.1;
        subCell.position.y = 0.05;
      } else {
        subCell.material.color.set(colors[cityIOdata.grid[i]]);
        subCell.scale.y = heights[cityIOdata.grid[i]];
        subCell.position.y = heights[cityIOdata.grid[i]] / 2;
      }
    }
  }
}
