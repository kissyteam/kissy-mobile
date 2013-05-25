#!/bin/sh

git pull
git commit -m "tmp commit for pub doc"
git push
git submodule update
git submodule foreach git pull origin master

git checkout gh-pages
git pull
git merge master
git push
git checkout master
