#!/bin/sh

git pull

git submodule update
git commit -m "submodules updated"
git push

git checkout gh-pages
git pull
git merge master
git push
git checkout master
