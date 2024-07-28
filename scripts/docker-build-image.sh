#!/usr/bin/env bash

echo "Building the image with latest tag"

## Tag is the latest hash from git
tag=$(git rev-parse --short HEAD)
echo "Building tag:$tag"

export TAG=$tag

# Build the images
docker compose build

# Push the images
docker push trdockercris/tradewishes:app-"$tag"
docker push trdockercris/tradewishes:server-"$tag"
