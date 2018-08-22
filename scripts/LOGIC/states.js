// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import "babel-polyfill";
import { remapCol } from "./modules";
import { countNeigbhors, drawCell } from "./modules";
import * as PEDS from "../GRID/peds";

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
    textHolder.children[i].text = grid.children[i].name;
  }
}

var colorsHold = ["#ed5085", "#fdcaa2", "#76a075", "#aceaf7", "#afafaf"];

/////////////// searchNearest  ///////////////////////
export function walkabilityMap(
  thisType,
  searchType,
  grid,
  cityIOdata,
  animDuration
) {
  let allGridArr = [];

  //get table x
  var gridX = cityIOdata.header.spatial.ncols;
  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    //reset size, color, pos of all children
    let thisCell = grid.children[i];
    //check if not text
    if (thisCell.name) {
      let NeigbhorsArr = [];
      let countResults = 0;
      allGridArr[i] = 0;
      //draw all in gray and reset scale/pos
      thisCell.material.color.set(0x454d4e);

      //remove peds from each cell children

      if (thisCell.children["0"]) {
        //remove old peds from this cell
        thisCell.remove(thisCell.children["0"]);
      }

      //check if grid cell is the type we look for
      if (thisCell.name === thisType) {
        //reset count array

        //if so, collect cells around [WIP]
        NeigbhorsArr.push(
          grid.children[i + 1],
          grid.children[i - 1],
          grid.children[i + gridX],
          grid.children[i - gridX],
          grid.children[i + gridX + 1],
          grid.children[i - gridX - 1]
        );
        countResults = countNeigbhors(NeigbhorsArr, thisType, searchType)[0];
      }
      // allGridArr[i] = countRes;
      //remap neighbors count to color on a scale of green to red
      let cellCol =
        "rgb(" +
        remapCol(countResults)[0] +
        "," +
        remapCol(countResults)[1] +
        "," +
        remapCol(countResults)[2] +
        ")";

      //recolor the cells with TWEEN
      drawCell(thisCell, cellCol, animDuration);

      //add pedestrians per grid object
      let peds = PEDS.makePeds(
        [
          remapCol(countResults)[0],
          remapCol(countResults)[1],
          remapCol(countResults)[2]
        ],
        NeigbhorsArr,
        countResults,
        1000,
        10,
        100,
        3 * countResults
      );
      //add peds to cell
      thisCell.add(peds);
    }
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
