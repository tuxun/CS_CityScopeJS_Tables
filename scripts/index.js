/*/////////////////////////////////////////////////////////////////////////////

{{ CityScopeJS_Walkability }}
Copyright (C) {{ 2018 }}  {{ Ariel Noyman }}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

///////////////////////////////////////////////////////////////////////////////

CityScopeJS_Walkability -- Walkability analysis for various land use types.
"@context": "TBD", "@type": "Person", "address": {
"@type": "75 Amherst St, Cambridge, MA 02139", "addressLocality":
"Cambridge", "addressRegion": "MA",}, 
"jobTitle": "Research Scientist", "name": "Ariel Noyman",
"alumniOf": "MIT", "url": "http://arielnoyman.com", 
"https://www.linkedin.com/", "http://twitter.com/relno",
https://github.com/RELNO]

*/ ///////////////////////////////////////////////////////////////////////////

//fixes Uncaught ReferenceError: regeneratorRuntime is not defined
import "babel-polyfill";
import { getCityIO } from "./LOGIC/modules";
import * as threeSetup from "./GRID/threeSetup";
import { gridInfo } from "./LOGIC/states";
import { landUseMap } from "./LOGIC/states";
import { walkabilityMap } from "./LOGIC/states";
import { info } from "./UI/ui";
import { radarInit, radarUpdate } from "./UI/radarSetup";
import { Maptastic } from "../scripts/UI/maptastic";

//
// import * as radarChart from "./radar";
// console.log(radarChart);

// global vars for fun
let tableName = "cityscopeJSwalk";
let cityIOtableURL =
  "https://cityio.media.mit.edu/api/table/" + tableName.toString();
console.log(cityIOtableURL);

//update interval
let interval = 500;

////////////////////////////////////////
async function init() {
  info();
  //call server once at start, just to setup the grid
  let cityIOdata = await getCityIO(cityIOtableURL);

  //build threejs initial grid on load
  var grid = threeSetup.threeInit(cityIOdata);
  //populate grid with data from cityIO
  gridInfo(grid, cityIOdata);

  //init the radar
  let radarChartObj = radarInit();
  //send a barebone radar to update function
  stateManager(grid, radarChartObj, cityIOdata);

  //Maptastic keystone
  let radarDiv = document.querySelector("#radarDiv");
  let infoDiv = document.querySelector("#infoDiv");
  //ONLY WAY TO M/S THREE.JS
  let THREEcanvas = document.querySelector("#THREEcanvas");

  Maptastic(THREEcanvas, radarDiv, infoDiv);
}

/////////////////////////////////////////////
/**
 * state Manager for keyboard input
 * @param grid THREE.js grid.
 * @param initalCityIOdata the results of the init call to cityIO.
 */

function stateManager(grid, radarChartObj, initalCityIOdata) {
  //paint land use grid at start
  landUseMap(grid, initalCityIOdata);

  let stateHolder = [];
  let cityIOdata;
  let lastUpdateDate = initalCityIOdata.meta.timestamp;
  //loop cityIO update recursively
  setInterval(updateCityIO, interval);
  //update grid if cityIO new data arrives
  async function updateCityIO() {
    //get the data through promise
    cityIOdata = await getCityIO(cityIOtableURL);

    // update to radar
    radarUpdate(cityIOdata, radarChartObj, interval / 2);

    //check for new cityIO update using a timestamp
    if (lastUpdateDate == cityIOdata.meta.timestamp) {
      // console.log("no new data");
      return;
    }
    //or, if new cityIO data
    else {
      lastUpdateDate = cityIOdata.meta.timestamp;
      // console.log("New CityIO data");
      //update the grid info
      gridInfo(grid, cityIOdata);

      //if stateHolder array has no walkabilityMap setup in it
      if (stateHolder.length < 2) {
        landUseMap(grid, cityIOdata);
      } else {
        //read state details and make a map in accordance
        walkabilityMap(stateHolder[0], stateHolder[1], grid, cityIOdata, 10);
      }
    }
  }

  ////////////////////////////////////////////////////////
  //set an array of states for demo
  let statesArr = [
    ["L", "W"],
    ["W", "L"],
    ["L", "P"],
    ["W", "P"],
    ["G", "L"],
    ["LU"]
  ];
  let infoDivState = document.querySelector("#infoDivState");

  let statesArrCounter = 0;
  //also, set key listener
  document.body.addEventListener("keyup", function(e) {
    switch (e.keyCode) {
      //look for these keys

      //case foot pedal
      case 66:
        console.log(statesArrCounter, statesArr.length);
        if (statesArrCounter === 0) {
          //clean up stateHolder so next cityIO update will recreate land use map
          stateHolder.splice(0, 5);
          //make the LU map
          landUseMap(grid, cityIOdata);
          infoDivState.innerHTML = "Land Use Map";
        } else {
          //put state details in a stateHolder var,
          //so we can go back and read them after next cityIO update
          stateHolder.splice(
            0,
            2,
            statesArr[statesArrCounter][0],
            statesArr[statesArrCounter][1]
          );
          //call the map
          walkabilityMap(
            statesArr[statesArrCounter][0],
            statesArr[statesArrCounter][1],
            grid,
            cityIOdata,
            2000
          );
          infoDivState.innerHTML =
            "Walkability Map from " +
            statesArr[statesArrCounter][0] +
            " to " +
            statesArr[statesArrCounter][1];
        }
        //move one state forward every click
        if (statesArrCounter === statesArr.length - 1) {
          statesArrCounter = 0;
        } else {
          statesArrCounter++;
        }
        break;
      default:
        landUseMap(grid, cityIOdata);
        //clean up stateHolder so next cityIO update will recreate land use map
        stateHolder.splice(0, 5);
        break;
    }
  });
}

////////////////////////////////////////
//start the app
init();
