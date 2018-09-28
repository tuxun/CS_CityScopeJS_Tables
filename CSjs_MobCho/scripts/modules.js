import "babel-polyfill";
import "./Storage";
var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import { threeGridProp } from "./ThreeJS/gridSetup";

/////////////////////////////////////////////////////////////////////////////////////////////////////////

export function makeMap() {
  // make the table div
  let mapDIV = document.createElement("div");
  mapDIV.id = "mapDIV";
  mapDIV.className = "mapDIV";
  document.body.appendChild(mapDIV);
  //base map
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag";
  var map = new mapboxgl.Map({
    container: "mapDIV",
    style: "mapbox://styles/relnox/cjlu6w5sc1dy12rmn4kl2zljn",
    center: [-71.085202, 42.36479],
    bearing: 30,
    zoom: 17.5
  });
  Storage.map = map;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * get cityIO method [uses polyfill]
 * @param cityIOtableURL cityIO API endpoint URL
 */
export async function getCityIO() {
  let cityIOtableURL = Storage.cityIOurl;
  // console.log("trying to fetch " + cityIOtableURL);
  return fetch(cityIOtableURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      // console.log("got cityIO table at " + cityIOdata.meta.timestamp);
      return cityIOdata;
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * controls the cityIO streeam
 */
export async function update() {
  let cityIOtableURL = Storage.cityIOurl;
  Storage.cityIOdata = await getCityIO(cityIOtableURL);
  //update the grid props
  threeGridProp();
}
