// https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263
import "babel-polyfill";

import { remapCol } from "./modules";
import { countNeigbhors, drawCell } from "./modules";
import * as PEDS from "../GRID/peds";

export function gridInfo(grid, cityIOdata) {
  var names = ["P", "W", "L", "G"];
  for (let i = 0; i < grid.children.length; i++) {
    //base type
    grid.children[i].name = "G";
    //then
    if (cityIOdata.grid[i] === -1) {
      grid.children[i].name = "G";
    } else {
      grid.children[i].name = names[cityIOdata.grid[i]];
    }
  }
}

/////////////// landUseGrid  ///////////////////////
export function landUseMap(grid, cityIOdata) {
  var colors = [0xaceaf7, 0xed5085, 0xfdcaa2, 0x76a075];
  for (let i = 0; i < grid.children.length; i++) {
    //if exist, cleanup peds at state reset
    for (let j = 0; j < grid.children[i].children.length; j++) {
      let subCell = grid.children[i].children[j];
      //remove old peds from this cell
      if (
        (subCell.type =
          "mesh" &&
          subCell.children["0"] &&
          subCell.children["0"].type != "Sprite")
      ) {
        subCell.remove(subCell.children["0"]);
      } else if (subCell.name === "text") {
        //cell number display
        subCell.text = grid.children[i].name;
      } else {
        //reset all sizes and positions
        subCell.position.y = 0;
        subCell.scale.y = 1;
        // set the land use color for each cell [WIP]
        subCell.material.color.set(colors[3]);
        if (cityIOdata.grid[i] === -1) {
          subCell.material.color.set(colors[2]);
        } else {
          subCell.material.color.set(colors[cityIOdata.grid[i]]);
        }
      }
    }
  }
}

/////////////// searchNearest  ///////////////////////
export function walkabilityMap(
  thisType,
  searchType,
  grid,
  cityIOdata,
  animDuration
) {
  //get table dims
  var gridX = cityIOdata.header.spatial.ncols;
  var textObjPos = null;
  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    for (let j = 0; j < grid.children[i].children.length; j++) {
      let subCell = grid.children[i].children[j];
      //remove peds from each cell children
      if (
        (subCell.type =
          "mesh" &&
          subCell.children["0"] &&
          subCell.children["0"].type != "Sprite")
      ) {
        //remove old peds from this cell
        subCell.remove(subCell.children["0"]);
      }
      if (subCell.name === "text") {
        textObjPos = j;
        continue;
      } else {
        //draw all in black and reset scale/pos
        subCell.material.color.set(0x454d4e);
        subCell.position.y = 0;
        subCell.scale.y = 1;
      }
    }

    //check if grid cell is the type we look for
    if (grid.children[i].name === thisType) {
      //reset count array
      let NeigbhorsArr = [];

      //if so, collect cells around [WIP]
      NeigbhorsArr.push(
        grid.children[i + 1],
        grid.children[i - 1],
        grid.children[i + gridX],
        grid.children[i - gridX],
        grid.children[i + gridX + 1],
        grid.children[i - gridX - 1]
      );
      let countRes = countNeigbhors(NeigbhorsArr, thisType, searchType);

      // update text inner cell with % of access
      grid.children[i].children[textObjPos].text =
        Math.floor(countRes * 100) + "%";

      for (let j = 0; j < grid.children[i].children.length; j++) {
        let subCell = grid.children[i].children[j];

        if (subCell.name === "text") {
          continue;
        } else {
          //update size to show results
          subCell.scale.y = countRes * 2 + 0.2;
          subCell.position.y = (countRes * 2 + 0.2) / 2;

          //remap neighbors count to color on a scale of green to red
          let cellCol =
            "rgb(" +
            remapCol(countRes)[0] +
            "," +
            remapCol(countRes)[1] +
            "," +
            remapCol(countRes)[2] +
            ")";

          //recolor the cells with TWEEN
          drawCell(subCell, cellCol, animDuration);

          //add pedestrians per grid object
          let peds = PEDS.makePeds(
            [
              remapCol(countRes)[0],
              remapCol(countRes)[1],
              remapCol(countRes)[2]
            ],
            NeigbhorsArr,
            countRes
          );
          //add peds to cell
          subCell.add(peds);
        }
      }
    }
  }
}
