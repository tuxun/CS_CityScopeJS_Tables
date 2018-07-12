var TWEEN = require("@tweenjs/tween.js");

//
export function searchNearest(grid, x, y) {
  console.log(x, y);

  var typeArr = [];
  for (let i = 0; i < grid.children.length; i++) {
    if (grid.children[i].name === "P") {
      grid.children[i].material.color.set("white");
      //find cells around [WIP]
      typeArr.push([
        grid.children[i + x],
        grid.children[i + y],
        grid.children[i - x],
        grid.children[i - y]
      ]);
    }
  }
  colorNeighbor(typeArr);
}

async function colorNeighbor(typeArr) {
  console.log(typeArr);

  for (let i = 0; i < typeArr.length; i++) {
    typeArr[i].forEach(e => {
      if (e != null) {
        console.log(e);

        animate(e);
      }
    });
  }
}

function animate(e) {
  requestAnimationFrame(animate);
  render(e);
}

function render(e) {
  tween = new TWEEN.Tween(e.material.color)
    .to({ r: 0, g: 25, b: 155 }, 2000)
    .easing(TWEEN.Easing.Quartic.In)
    .start();
}
