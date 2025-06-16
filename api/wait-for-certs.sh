#!/bin/sh

set -e

# If DOMAIN is set, wait for TLS certificates
if [ -n "${DOMAIN}" ]; then
  HOST="${DOMAIN}"
  CERT_PATH="/etc/letsencrypt/live/${HOST}/fullchain.pem"
  KEY_PATH="/etc/letsencrypt/live/${HOST}/privkey.pem"

  echo "DOMAIN is set to ${DOMAIN}. Waiting for TLS certificates for ${HOST}..."
  i=0
  while [ ! -f "${CERT_PATH}" ] || [ ! -f "${KEY_PATH}" ]; do
    i=$((i+1))
    if [ $i -ge 60 ]; then
      echo "Timeout: Certificates not available after 5 minutes. Exiting."
      exit 1
    fi
    echo "Certificates not found yet, retrying in 5 seconds... (attempt $((i)))"
    sleep 5
  done
  echo "TLS Certificates found!"
else
  echo "DOMAIN environment variable not set. Skipping TLS certificate wait."
fi

echo "Starting application."
exec "$@" 