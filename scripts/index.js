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

/*
Structure:

+------------+     +------------+     +----------------+   +-------------+
| index.js   +---> | interact   +---> + searchNearest  <---> TweenModules|
+-----+------+     +------------+     +--------+-------+   +-------------+
      |                                         ^
      v                                         |
+-----+------+    +-------------+               |
|threeSetup  +--->+   makeGrid  +----------------
+------------+    +-------------+
*/

/////////////////////////////////////////////////////////////////////////

import * as threeSetup from "./threeSetup";
import * as GRID from "./searchNearest.js";

document.onload = init();

function init() {
  var allCols = [
    "rgb(237, 80, 102)",
    "rgb(244, 130, 125)",
    "rgb(244, 185, 158)",
    "rgb(253, 202, 162)",
    "rgb(246, 236, 212)",
    "rgb(204, 217, 206)",
    "rgb(165, 187, 185)",
    "rgb(163, 191, 162)",
    "rgb(128, 173, 169)",
    "rgb(102, 138, 135)",
    "rgb(64, 86, 84)",
    "rgb(38, 60, 58)",
    "rgb(38, 60, 58)",
    "rgb(20, 24, 26)"
  ];

  /////////////////////////////////////

  var gridX = 20;
  var gridY = 20;
  var grid;
  //call threejs setup onload
  grid = threeSetup.threeInit(gridX, gridY);

  /////////////////////////////////////////////
  //interact for now
  document.body.addEventListener("keyup", function(e) {
    switch (e.keyCode) {
      //look for this keys
      case 71:
      case 76:
      case 80:
      case 87:
        GRID.searchNearest(
          String.fromCharCode(e.keyCode),
          "P",
          grid,
          gridX,
          gridY,
          3000
        );
        break;
      default:
        break;
    }
  });
}
