#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Common SSH Function (with sshpass) --- #
# execute_remote_sshpass_command <ssh_password> <remote_user> <remote_host> <remote_command>
function execute_remote_sshpass_command() {
    local ssh_password="$1"
    local remote_user="$2"
    local remote_host="$3"
    local remote_command="$4"

    if [ -z "$ssh_password" ] || [ -z "$remote_user" ] || [ -z "$remote_host" ] || [ -z "$remote_command" ]; then
        echo "Usage: execute_remote_sshpass_command <ssh_password> <remote_user> <remote_host> <remote_command>" >&2
        exit 1
    fi

    echo "Executing on ${remote_user}@${remote_host} using sshpass: '${remote_command}'"
    sshpass -p "$ssh_password" ssh "${remote_user}@${remote_host}" "${remote_command}"
}
# --- End Common SSH Function (with sshpass) --- #

# --- Common Environment Loading --- #
function load_env_vars() {
    local env_file="$1"
    if [ -f "$env_file" ]; then
        source "$env_file"
    else
        echo "Error: $env_file file not found!" >&2
        exit 1
    fi
}

function check_env_vars() {
    local required_vars=("$@")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "Error: $var not set in .env!" >&2
            exit 1
        fi
    done
}

# --- End Common Environment Loading --- # 