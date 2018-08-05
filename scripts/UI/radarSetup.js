import * as d3 from "d3";
console.log("d3 version: ", d3.version);
///
import { RadarChart } from "./radarChart";
import { Maptastic } from "./maptastic";

//declare as global for both init and update
let radarChartMethod;

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

  var color = d3.scaleBand().range(globalColors);
  //old
  // d3.scale.ordinal().range(globalColors);
  //fix
  // d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  // d3.scaleBand().rangeRound([0, width]);

  //size of radar
  let docRatio = window.innerHeight / window.innerWidth;

  var radarChartOptions = {
    width: window.innerWidth * docRatio,
    height: window.innerWidth * docRatio,
    color: color
  };
  //call the radar function for init
  radarChartMethod = RadarChart();
  d3.select("#radarDiv").call(radarChartMethod);
  //make empty radar without data for now
  radarChartMethod.options(radarChartOptions).update();
}

//////////////////

//radar updates upon cityIO new data
export function radarUpdate(cityIOjson) {
  const tableFeatures = new radarFeatures(cityIOjson);

  var data = [
    {
      key: "Kendall Sq.",
      values: [
        { axis: "Density", value: tableFeatures.typeRatio("1") },
        { axis: "Diversity", value: tableFeatures.typeRatio("2") },
        { axis: "Proximity", value: tableFeatures.typeRatio("3") },
        { axis: "Amenities", value: tableFeatures.typeRatio("4") },
        { axis: "Energy", value: tableFeatures.typeRatio("5") },
        { axis: "Mix use", value: tableFeatures.uniqueTypes() },
        { axis: "Land Value", value: tableFeatures.typeRatio("6") },
        { axis: "Mobility", value: tableFeatures.typeRatio("4") },
        { axis: "Temp.", value: tableFeatures.typeRatio("5") },
        { axis: "Public Space", value: tableFeatures.uniqueTypes() },
        { axis: "Coolness", value: tableFeatures.typeRatio("6") }
      ]
    }
  ];

  radarChartMethod
    .data(data)
    .duration(500)
    .update();
  radarChartMethod.options({ legend: { display: true } });
}
