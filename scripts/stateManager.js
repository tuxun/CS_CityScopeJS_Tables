import * as threeSetup from "./threeSetup";
import { searchNearest } from "./searchNearest";
import { landUseGrid } from "./makeGrid";

/////////////////////////////////////////////
//interaction
export function stateManager(cityIOdata) {
  if (cityIOdata.header.spatial.ncols) {
    var gridX = cityIOdata.header.spatial.ncols;
    var gridY = cityIOdata.header.spatial.nrows;
    //build threejs baseline grid onload
    var grid = threeSetup.threeInit(gridX, gridY);
    //paint land use grid at start
    landUseGrid(grid, cityIOdata);
    //then, set key listener
    document.body.addEventListener("keyup", function(e) {
      switch (e.keyCode) {
        //look for this keys
        case 71:
        case 76:
        case 80:
        case 87:
          searchNearest(
            String.fromCharCode(e.keyCode),
            "P",
            grid,
            gridX,
            gridY,
            3000
          );
          break;
        default:
          landUseGrid(grid, cityIOdata);
          break;
      }
    });
  }
}
