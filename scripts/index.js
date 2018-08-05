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

      //update radar
      radarUpdate(cityIOdata);

      //if stateHolder array has no walkabilityMap setup in it
      if (stateHolder.length < 2) {
        landUseMap(grid, cityIOdata);
      } else {
        //read state details and make a map in accordance
        walkabilityMap(stateHolder[0], stateHolder[1], grid, cityIOdata, 2000);
      }
    }
  }

  ////////////////////////////////////////////////////////
  //also, set key listener
  document.body.addEventListener("keyup", function(e) {
    switch (e.keyCode) {
      //look for these keys
      case 71:
      case 76:
      case 80:
      case 87:
        //put  state details in a stateHolder var,
        //so we can go back and read them after next cityIO update
        stateHolder.splice(0, 2, String.fromCharCode(e.keyCode), "P");

        walkabilityMap(
          String.fromCharCode(e.keyCode),
          "P",
          grid,
          cityIOdata,
          2000
        );
        break;
      default:
        landUseMap(grid, cityIOdata);
        stateHolder.splice(0, 5);
        break;
    }
  });
}

////////////////////////////////////////
//start the app
init();
