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
      grid.children[i].name = "L";
    } else {
      grid.children[i].name = names[cityIOdata.grid[i]];
    }
  }
}

/////////////// landUseGrid  ///////////////////////
export function landUseMap(grid, cityIOdata) {
  var colors = [0xaceaf7, 0xed5085, 0xfdcaa2, 0x76a075];

  for (let i = 0; i < grid.children.length; i++) {
    // console.log(grid.children[i]);

    //reset all sizes and positions
    grid.children[i].position.y = 0;
    grid.children[i].scale.y = 1;

    //if exist, cleanup peds at state reset
    for (let j = 0; j < grid.children[i].children.length; j++) {
      if (grid.children[i].children[j].name === "peds") {
        grid.children[i].children[j].remove(grid.children[i].children[j]);
      } else if (grid.children[i].children[j].name === "text") {
        //cell number display
        grid.children[i].children[j].text = grid.children[i].name;
      } else {
        // set the land use color for each cell [WIP]
        grid.children[i].children[j].material.color.set(colors[3]);

        if (cityIOdata.grid[i] === -1) {
          grid.children[i].children[j].material.color.set(colors[2]);
        } else {
          grid.children[i].children[j].material.color.set(
            colors[cityIOdata.grid[i]]
          );
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

  // go through all grid cells
  for (let i = 0; i < grid.children.length; i++) {
    for (let j = 0; j < grid.children[i].children.length; j++) {
      if ((grid.children[i].children[j].type = "mesh")) {
        grid.children[i].children[j].remove(
          grid.children[i].children[j].children["0"]
        );
        //remove old peds from this cell
      }
      if (grid.children[i].children[j].name === "text") {
        continue;
      } else {
        //draw all in black and reset scale/pos
        grid.children[i].children[j].material.color.set(0x454d4e);
        grid.children[i].children[j].position.y = 0;
        grid.children[i].children[j].scale.y = 1;
      }
    }
    ///
    //check if grid cell is the type we look for
    if (grid.children[i].name === thisType) {
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

      for (let j = 0; j < grid.children[i].children.length; j++) {
        if (grid.children[i].children[j].name === "text") {
        } else {
          //update size to show results
          grid.children[i].children[j].scale.y = countRes + 0.2;
          grid.children[i].children[j].position.y = (countRes + 0.1) / 2;

          // update text inner cell with % of access
          // grid.children[i].children["0"].text = Math.floor(countRes * 100) + "%";
          // if (countRes === 1) console.log(grid.children[i]);
          //grid.children[i].children["0"].text += " " + cellCol;

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
          drawCell(grid.children[i].children[j], cellCol, animDuration);

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
          grid.children[i].children[j].add(peds);
        }
      }
    }
  }
}
