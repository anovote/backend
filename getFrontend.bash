#! /bin/bash

mkdir tempBuild
cd tempBuild
git clone https://github.com/anovote/frontend.git
cd frontend
echo "*.yml
src" > ".eslintignore"
yarn
yarn build