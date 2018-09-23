# CityScopeJS Tables Modules

Repo contains several examples for deployable CityScopeJS table for web/browser environment. These modules can be used 'out of the box' with any modern web browser. Modules are designed to work best with [CityScopeJS](https://github.com/CityScope/CS_cityscopeJS) but will accept any cityIO data if properly formulated.

Each module should include at least:

- CityScope grid retrieved from cityIO server on interval
- Visual rep. of cityIO data feature [3d model, land use or other]
- Analysis of grid+spatial data, such as: walkability, energy, mobility etc.

---

## how to build with `parcel` for GitHub pages

### Building production into `dist` folder

`sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_CityScopeJS_Tables/`

## Deploying `dist` to GitHub Pages

### Step 1

Remove the `dist` directory from the project’s `.gitignore` (or skip and force-add afterwards).

### Step 2

Make sure git knows about your subtree (the subfolder with your site).

```sh
git add dist
```

or force-add it if you don't want to change your `.gitignore`

```sh
git add dist -f
```

### Step 3

Commit!

```sh
git commit -m "gh-pages commit"
```

### Step 4

Use subtree push to send it to the `gh-pages` branch on GitHub.

```sh
git subtree push --prefix dist origin gh-pages
```

### Step 4.1

If this gets an error [see below], try `force` push:

```sh
git push origin `git subtree split --prefix dist master`:gh-pages --force
```
