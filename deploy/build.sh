#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Source common functions
source ./deploy/common.sh

# Load environment variables from .env file
load_env_vars "./deploy/.env"

# Check if SSH_PASSWORD and SERVER_IP_ADDRESS are set
check_env_vars "SSH_PASSWORD" "SERVER_IP_ADDRESS"

# Execute the remote command using sshpass with direct password input
execute_remote_sshpass_command "$SSH_PASSWORD" "root" "${SERVER_IP_ADDRESS}" "cd sendable && git pull && docker-compose build --no-cache && docker-compose up -d --force-recreate"

# Air will auto rebuild on the remote server after pulling