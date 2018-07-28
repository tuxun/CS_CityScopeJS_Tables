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

// fixes Uncaught ReferenceError: regeneratorRuntime is not defined
import "babel-polyfill";
///
import * as threeSetup from "./threeSetup";
import { walkabilityMap } from "./states";
import { landUseMap } from "./states";

////////////////////////////////////////
async function init() {
  var tableName = "cityscopeJS";
  let cityIOtableURL =
    "https://cityio.media.mit.edu/api/table/" + tableName.toString();
  //call server once at start, just to setup the grid
  await getCityIO(cityIOtableURL);
}
//start app
init();

/////////////////////////////////////////////
//state Manager
function stateManager(cityIOdata) {
  if (cityIOdata.meta.timestamp) {
    var gridX = cityIOdata.header.spatial.ncols;
    var gridY = cityIOdata.header.spatial.nrows;
    //build threejs initial grid on load
    var grid = threeSetup.threeInit(gridX, gridY);
    //paint land use grid at start
    landUseMap(grid, cityIOdata);
    //then, set key listener
    document.body.addEventListener("keyup", function(e) {
      switch (e.keyCode) {
        //look for this keys
        case 71:
        case 76:
        case 80:
        case 87:
          walkabilityMap(
            String.fromCharCode(e.keyCode),
            "P",
            grid,
            gridX,
            gridY,
            3000
          );
          break;
        default:
          landUseMap(grid, cityIOdata);
          break;
      }
    });
  }
}

////////////////////////////////////////
//get cityIO method
function getCityIO(cityIOtableURL) {
  console.log("trying to fetch..");
  return fetch(cityIOtableURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      console.log("got cityIO table at " + cityIOdata.meta.timestamp);
      // return jsonData;
      stateManager(cityIOdata);
    });
}
