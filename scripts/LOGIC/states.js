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
  var colors = [0xed5085, 0xfdcaa2, 0x76a075, 0xaceaf7];
  for (let i = 0; i < grid.children.length; i++) {
    //if exist, cleanup peds at state reset
    for (let j = 0; j < grid.children[i].children.length; j++) {
      let subCell = grid.children[i].children[j];
      // remove old peds from this cell
      if ((subCell.type = "mesh" && subCell.children["0"])) {
        subCell.remove(subCell.children["0"]);
      }
      //reset all sizes and positions
      subCell.position.y = 0;
      subCell.scale.y = 0.1;
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
  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    //reset size, color, pos of all children
    for (let j = 0; j < grid.children[i].children.length; j++) {
      let subCell = grid.children[i].children[j];

      //draw all in gray and reset scale/pos
      subCell.material.color.set(0x454d4e);
      subCell.position.y = 0;
      subCell.scale.y = 0.1;

      //remove peds from each cell children
      if ((subCell.type = "mesh" && subCell.children["0"])) {
        //remove old peds from this cell
        subCell.remove(subCell.children["0"]);
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
      let countRes = countNeigbhors(NeigbhorsArr, thisType, searchType)[0];

      for (let j = 0; j < grid.children[i].children.length; j++) {
        let subCell = grid.children[i].children[j];

        //update size to show results
        if (countRes > 0) {
          subCell.scale.y = countRes * 2;
          subCell.position.y = subCell.scale.y / 4;
        }

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
          [remapCol(countRes)[0], remapCol(countRes)[1], remapCol(countRes)[2]],
          NeigbhorsArr,
          countRes
        );
        //add peds to cell
        subCell.add(peds);
      }
      //color the search type
      let foundArr = countNeigbhors(NeigbhorsArr, thisType, searchType)[1];
      if (foundArr.length > 0) {
        for (let x = 0; x < foundArr.length; x++) {
          for (let y = 0; y < foundArr[x].children.length; y++) {
            foundArr[x].children[y].material.color.set("white");
          }
        }
      }
    }
  }
}
