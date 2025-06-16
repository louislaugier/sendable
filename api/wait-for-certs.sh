#!/bin/sh

set -e

HOST="${DOMAIN}"
CERT_PATH="/etc/letsencrypt/live/${HOST}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/${HOST}/privkey.pem"

echo "Waiting for TLS certificates for ${HOST} to be available..."

i=0
while [ ! -f "${CERT_PATH}" ] || [ ! -f "${KEY_PATH}" ]; do
  i=$((i+1))
  if [ $i -ge 60 ]; then
    echo "Timeout: Certificates not available after 5 minutes. Exiting."
    exit 1
  fi
  echo "Certificates not found yet, waiting... (attempt $((i)))"
  sleep 5
done

echo "Certificates found! Starting application."
exec "$@" 