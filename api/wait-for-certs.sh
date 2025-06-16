#!/bin/sh

set -e

HOST="${DOMAIN}"
CERT_PATH="/etc/letsencrypt/live/${HOST}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/${HOST}/privkey.pem"

while [ ! -f "${CERT_PATH}" ] || [ ! -f "${KEY_PATH}" ]; do
  sleep 5
done

exec "$@" 