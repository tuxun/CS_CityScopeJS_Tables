# #!/bin/bash
# directory="./dist"

# # bash check if dist directory already exists
# if [ -d $directory ]; then
# 	echo "Dist exists, removing"
sudo rm -rf dist

# build the dist for public url 
sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_CityScopeJS_Walk/
# make sure to add dist 
git add dist -f
#commit the GH pages changes 
git commit -m "gh-pages commit"
#push to subtree remote 
git subtree push --prefix dist origin gh-pages
