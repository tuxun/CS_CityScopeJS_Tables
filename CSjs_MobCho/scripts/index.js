/*
/////////////////////////////////////////////////////////////////////////////////////////////////////////

{{ CityScope Choice Models }}
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////

"@context": "https://github.com/CityScope/", "@type": "Person", "address": {
"@type": "75 Amherst St, Cambridge, MA 02139", "addressLocality":
"Cambridge", "addressRegion": "MA",}, 
"jobTitle": "Research Scientist", "name": "Ariel Noyman",
"alumniOf": "MIT", "url": "http://arielnoyman.com", 
"https://www.linkedin.com/", "http://twitter.com/relno",
https://github.com/RELNO]

///////////////////////////////////////////////////////////////////////////////////////////////////////
*/
import "babel-polyfill";
//Import Storage class
import "./Storage";
import { Maptastic } from "./maptastic";
import { getCityIO, update, makeMap } from "./modules";
import { threeInit } from "./ThreeJS/gridSetup";

//start applet
window.onload = init();

async function init() {
  //make the base map
  // makeMap();
  //GET CITYIO
  var tableName = window.location.search.substring(1);
  if (tableName == "") {
    console.log("using default cityIO endpoint @ CityScopeJS");
    tableName = "CityScopeJS";
  }
  let cityIOtableURL =
    "https://cityio.media.mit.edu/api/table/" + tableName.toString();

  Storage.cityIOurl = cityIOtableURL;
  //call server once at start, just to init the grid
  const cityIOjson = await getCityIO(cityIOtableURL);
  //save to storage
  Storage.cityIOdata = cityIOjson;
  console.log(Storage.cityIOdata);

  //init the threejs module
  threeInit();

  //ONLY WAY TO M/S THREE.JS
  let THREEcanvas = document.querySelector("#THREEcanvas");
  let mapDIV = document.querySelector("#mapDIV");
  //maptastic the div
  Maptastic(mapDIV, THREEcanvas);

  var interval = 1000;
  //run the update
  window.setInterval(update, interval);
}
