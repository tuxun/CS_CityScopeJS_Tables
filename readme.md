# CityScopeJS Tables Modules

Repo contains several examples for deployable CityScopeJS table for web/browser environment. These modules can be used 'out of the box' with any modern web browser. Modules are designed to work best with [CityScopeJS](https://github.com/CityScope/CS_cityscopeJS) but will accept any cityIO data if properly formulated.

Each module should include at least:

- CityScope grid retrieved from cityIO server on interval
- Visual rep. of cityIO data feature [3d model, land use or other]
- Analysis of grid+spatial data, such as: walkability, energy, mobility etc.

#### how to build a table module with `parcel` into GitHub pages

- make an empty `gh-pages` branch and push it to GH

- Build production into `dist` folder:

  - use `GH.sh` to build the a local `dist` folder
  - make changes to `.sh` to fit static `https` and Table location

