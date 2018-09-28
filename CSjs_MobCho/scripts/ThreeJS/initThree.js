//fixes Uncaught ReferenceError: regeneratorRuntime is not defined
import "babel-polyfill";
import { createScene, landUseMap } from "./gridSetup";
import "../Storage";

////////////////////////////////////////
export async function threeInit() {
  let cityIOdata = Storage.cityIOdata;
  //build threejs initial grid on load
  var initCityIOdata = createScene(cityIOdata);
  var grid = initCityIOdata[0];
  var textHolder = initCityIOdata[1];
  //populate grid with data from cityIO
  landUseMap(grid, cityIOdata, textHolder);
}
