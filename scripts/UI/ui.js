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
  document.body.appendChild(logoDiv);

  logoDiv.id = "logoDiv";
  logoDiv.className = "logoDiv";
  var logo = document.createElement("img");
  logo.src = logoPath.default;
  logoDiv.appendChild(logo);
  logo.width = 100;
  logo.height = 100;

  //
  let infoDivState = document.createElement("div");
  infoDivState.id = "infoDivState";
  infoDivState.className = "infoDivState";
  infoDiv.appendChild(infoDivState);
}
