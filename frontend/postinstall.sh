#!/bin/bash

# This script ensures that node_modules are gathered from the container (amd64) and not installed locally. Modules are needed outside the container to develop without IDE-related issues.

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
    # Copy node_modules from the container to the local directory
    docker cp "$container_id:/frontend/node_modules" ./node_modules/
else
    echo "Container with name '$container_name' not found."
    exit 1
fi