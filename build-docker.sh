#!/bin/bash

cd "$(dirname $0)"

LABEL=$1;shift
ZIP=build/results/procan-frontend.zip

if [ "$LABEL" == "" ]; then
    echo "USAGE: $0 label"
    exit 1
fi

if [ ! -f "$ZIP" ]; then
    echo "Must run 'npm run build' before push docker."
    exit 2
fi

PUSH=${PUSH:-}

set -ue

rm -rf build/docker
mkdir -p build/docker

cp -prf docker/nginx build/docker/nginx
mkdir build/docker/static-html-directory
unzip -o $ZIP -d build/docker/nginx/static-html-directory

rm -rf build/docker
mkdir -p build/docker

cp -prf docker/nginx build/docker/nginx
mkdir build/docker/static-html-directory
unzip -o $ZIP -d build/docker/nginx/static-html-directory

docker build --tag="nwada/procan-web:$LABEL" build/docker/nginx
