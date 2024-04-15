#!/bin/bash

# This script ensures that build directory is gathered from the container (amd64) and not generated locally.

# Get the absolute directory path of the script
script_dir=$(dirname "$(readlink -f "$0")")

# Get the name of the grandparent directory of the script
grandparent_dir_name=$(basename "$(dirname "$script_dir")")

# Define the container name using the grandparent directory name
container_name="${grandparent_dir_name}-frontend-1"

# Get the container ID based on the container name
container_id=$(docker ps -aqf "name=$container_name")

# Check if the container ID is not empty
if [ -n "$container_id" ]; then
    # Create local build directory if it doesn't exist
    mkdir -p frontend/build
    # Copy build directory from the container to the local directory
    docker cp "$container_id:/frontend/build/." frontend/build/
else
    echo "Container with name '$container_name' not found."
    exit 1
fi
