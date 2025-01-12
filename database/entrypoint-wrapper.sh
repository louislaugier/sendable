#!/bin/bash
echo "[$(date)] Starting entrypoint wrapper" >> /var/log/cron.log 2>&1

# Debug environment variables
echo "[$(date)] DEBUG: All environment variables:" >> /var/log/cron.log 2>&1
env | sort >> /var/log/cron.log 2>&1

# Export environment variables (excluding readonly vars)
env | grep -v "BASH" | grep -v "DIRSTACK" | while read -r line; do
    echo "export $line" >> /root/project_env.sh
done

# Debug project_env.sh contents
echo "[$(date)] DEBUG: Contents of project_env.sh:" >> /var/log/cron.log 2>&1
cat /root/project_env.sh >> /var/log/cron.log 2>&1

chmod +x /root/project_env.sh

echo "[$(date)] Starting cron" >> /var/log/cron.log 2>&1
service cron start
status=$?
if [ $status -ne 0 ]; then
    echo "[$(date)] Failed to start cron: $status" >> /var/log/cron.log 2>&1
    exit $status
fi

# Start PostgreSQL in background
echo "[$(date)] Starting PostgreSQL" >> /var/log/cron.log 2>&1
docker-entrypoint.sh postgres & 

# Wait for PostgreSQL to be ready
echo "[$(date)] Waiting for PostgreSQL to be ready..." >> /var/log/cron.log 2>&1
for i in {1..60}; do
    if pg_isready -h localhost -U $POSTGRES_USER; then
        echo "[$(date)] PostgreSQL is ready" >> /var/log/cron.log 2>&1
        break
    fi
    echo "[$(date)] Waiting for PostgreSQL... attempt $i" >> /var/log/cron.log 2>&1
    sleep 1
done

# Run initial backup test
echo "[$(date)] Running initial backup test" >> /var/log/cron.log 2>&1
. /root/project_env.sh && /scripts/backup.sh

# Keep the container running
wait 