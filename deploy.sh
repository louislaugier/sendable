#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Source common functions
source ./deploy/common.sh

# --- Main Deployment Logic --- #

# Load environment variables from .env file
load_env_vars ".env"

# Check if necessary environment variables are set
check_env_vars "SERVER_IP_ADDRESS" "SSH_PRIVATE_KEY_PATH"

# Example usage of the common function for deployment
execute_remote_ssh_command "root" "${SERVER_IP_ADDRESS}" "${SSH_PRIVATE_KEY_PATH}" "cd sendable && git pull" 