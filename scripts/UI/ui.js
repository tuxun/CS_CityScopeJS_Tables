import * as logoPath from "../../images/logo.png";
//
export function info() {
  let infoDiv = document.createElement("div");
  infoDiv.id = "infoDiv";
  infoDiv.className = "infoDiv";
  document.body.appendChild(infoDiv);
  infoDiv.innerHTML = "CityScopeJS" + "<p>" + "Walkability Simulation";
  //
  let logoDiv = document.createElement("div");
  logoDiv.id = "logoDiv";
  logoDiv.className = "logoDiv";
  infoDiv.appendChild(logoDiv);
  var logo = document.createElement("img");
  logo.src = logoPath.default;
  logo.width = 50;
  logo.height = 50;
  logoDiv.appendChild(logo);
}
