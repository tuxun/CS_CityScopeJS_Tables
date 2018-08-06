import * as d3 from "d3";
console.log("d3 version: ", d3.version);
import { RadarChart } from "./radarChart";
import { RadarMath } from "./radarMath";

//declare as global for both init and update
// let radarChartMethod;

export function radarInit() {
  var globalColors = [
    "#ED5066",
    "#F4827D",
    "#F4B99E",
    "#FDCAA2",
    "#F6ECD4",
    "#CCD9CE",
    "#A5BBB9",
    "#A3BFA2",
    "#80ADA9",
    "#668a87",
    "#405654",
    "#263C3A",
    "#263C3A",
    "#14181a"
  ];

  let radarDiv = document.createElement("div");
  radarDiv.id = "radarDiv";
  radarDiv.className = "radarDiv";
  document.body.appendChild(radarDiv);
  //
  var color = d3.scale.ordinal().range(globalColors);
  //size of radar
  let docRatio = window.innerHeight / window.innerWidth;
  var radarChartOptions = {
    width: window.innerWidth * docRatio,
    height: window.innerWidth * docRatio,
    color: color
  };
  //call the radar function for init
  let radarChartObj = RadarChart();
  d3.select("#radarDiv").call(radarChartObj);
  //make empty radar without data for now
  radarChartObj.options(radarChartOptions).update();

  return radarChartObj;
}

//////////////////
/**
 * radar updates upon cityIO new data
 * @param cityIOjson data from cityIO.
 */

export function radarUpdate(cityIOjson, radarChartObj, interval) {
  const radarMath = new RadarMath(cityIOjson);

  var data = [
    {
      key: "Walkability",
      values: [
        { axis: "Work", value: radarMath.typeRatio("0") },
        { axis: "Live", value: radarMath.typeRatio("1") },
        { axis: "Park", value: radarMath.typeRatio("2") },
        { axis: "Open", value: radarMath.typeRatio("3") }
      ]
    }
  ];

  radarChartObj
    .data(data)
    .duration(interval)
    .update();
  radarChartObj.options({ legend: { display: true } });
}
