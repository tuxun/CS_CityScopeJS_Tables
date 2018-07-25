import { searchNearest } from "./searchNearest";
import { landUseGrid } from "./makeGrid";
/////////////////////////////////////////////
//interaction
export function stateManager(grid, gridX, gridY) {
  console.log(la);

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
        break;
    }
  });
}
