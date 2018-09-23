# #!/bin/bash
# clear dist folder 
sudo rm -rf CSjs_MobCho/dist
# build the dist for public url 
sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_CityScopeJS_Tables/
# make sure to add dist 
git add CSjs_MobCho/dist -f
#commit the GH pages changes 
git commit -m "gh-pages commit"
#push to subtree remote [Force] 
# git subtree push --prefix dist origin gh-pages
git push origin `git subtree split --prefix dist master`:gh-pages --force


