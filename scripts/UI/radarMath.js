////////////////////////////////////////////////////////////////////////////////////
//a class to preform math on data arriving from cityIO and return to radar
////////////////////////////////////////////////////////////////////////////////////

export class RadarMath {
  constructor(data) {
    this.data = data;
  }
  ///////////////////////////
  uniqueTypes() {
    var uniqueItems = Array.from(new Set(this.data.grid));
    return uniqueItems.length / this.data.grid.length;
  }

  ///////////////////////////

  typeRatio(type) {
    let ratioCount = 0;
    let d = this.data.grid;

    for (let i = 0; i < d.length; i++) {
      if (d[i].toString() === type) {
        ratioCount += 1;
      }
    }
    return ratioCount / d.length;
  }
}
