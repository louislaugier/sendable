#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Load environment variables from .env file
# This assumes .env is in the same directory as this script
if [ -f .env ]; then
    # Use 'source' to load variables into the current shell, if 'export $(...)' is problematic
    # Note: 'source' is bash-specific, consider '.' for broader compatibility if needed
    source .env
else
    echo "Error: .env file not found!" >&2
    exit 1
fi

# Check if SSH_PASSWORD and SERVER_IP_ADDRESS are set
if [ -z "$SSH_PASSWORD" ] || [ -z "$SERVER_IP_ADDRESS" ]; then
    echo "Error: SSH_PASSWORD or SERVER_IP_ADDRESS not set in .env!" >&2
    exit 1
fi

# Execute the remote command using sshpass with direct password input
# This bypasses the need for the SSHPASS environment variable
sshpass -p "$SSH_PASSWORD" ssh root@${SERVER_IP_ADDRESS} "cd sendable && git pull" 

# Air will auto rebuild on the remote server after pulling