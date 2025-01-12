FROM --platform=linux/amd64 postgres:15

# Define email configuration only
ENV BACKUP_EMAIL_FROM=louis.laugier.backups@gmail.com
ENV BACKUP_EMAIL_TO=l.laugier@pm.me

# Install required packages
RUN apt-get update && apt-get install -y \
    postgresql-client \
    msmtp \
    msmtp-mta \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Create backup script
RUN mkdir -p /scripts
COPY ./migrations/. /docker-entrypoint-initdb.d/

# Create backup script with improved logging
RUN echo '#!/bin/bash\n\
TIMESTAMP=$(date +%Y%m%d_%H%M%S)\n\
BACKUP_FILE="/tmp/db_backup_$TIMESTAMP.sql"\n\
LOGFILE="/var/log/backup.log"\n\
\n\
echo "[$TIMESTAMP] Starting backup" >> $LOGFILE\n\
echo "[$TIMESTAMP] Environment variables:" >> $LOGFILE\n\
echo "SMTP_PASSWORD exists: $(if [ -n "$SMTP_PASSWORD" ]; then echo "yes (length: ${#SMTP_PASSWORD})"; else echo "no"; fi)" >> $LOGFILE\n\
\n\
if [ -z "$SMTP_PASSWORD" ]; then\n\
    echo "[$TIMESTAMP] Error: SMTP_PASSWORD is not set" >> $LOGFILE\n\
    exit 1\n\
fi\n\
\n\
# Configure msmtp\n\
echo "[$TIMESTAMP] Configuring msmtp..." >> $LOGFILE\n\
cat > /etc/msmtprc << EOF\n\
defaults\n\
auth           on\n\
tls            on\n\
tls_trust_file /etc/ssl/certs/ca-certificates.crt\n\
logfile        /var/log/msmtp.log\n\
\n\
account        default\n\
host           smtp.gmail.com\n\
port           587\n\
from           $BACKUP_EMAIL_FROM\n\
user           $BACKUP_EMAIL_FROM\n\
password       "${SMTP_PASSWORD}"\n\
tls_starttls   on\n\
EOF\n\
\n\
chmod 600 /etc/msmtprc\n\
\n\
# Debug msmtp config (hide password)\n\
echo "[$TIMESTAMP] msmtp config:" >> $LOGFILE\n\
grep -v password /etc/msmtprc >> $LOGFILE\n\
\n\
# Create backup\n\
echo "[$TIMESTAMP] Running pg_dump..." >> $LOGFILE\n\
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h localhost -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE 2>> $LOGFILE\n\
\n\
if [ $? -ne 0 ]; then\n\
    echo "[$TIMESTAMP] Error: pg_dump failed" >> $LOGFILE\n\
    exit 1\n\
fi\n\
\n\
echo "[$TIMESTAMP] Backup file created, size: $(ls -lh $BACKUP_FILE | awk '"'"'{print $5}'"'"')" >> $LOGFILE\n\
\n\
# Create email with attachment\n\
echo "[$TIMESTAMP] Sending email..." >> $LOGFILE\n\
(\n\
echo "To: $BACKUP_EMAIL_TO"\n\
echo "From: $BACKUP_EMAIL_FROM"\n\
echo "Subject: Sendable Database Backup $TIMESTAMP"\n\
echo "MIME-Version: 1.0"\n\
echo "Content-Type: multipart/mixed; boundary=\\"boundary\\""\n\
echo ""\n\
echo "--boundary"\n\
echo "Content-Type: text/plain"\n\
echo ""\n\
echo "Database backup is attached."\n\
echo "Backup timestamp: $TIMESTAMP"\n\
echo ""\n\
echo "--boundary"\n\
echo "Content-Type: application/sql"\n\
echo "Content-Disposition: attachment; filename=\\"db_backup_$TIMESTAMP.sql\\""\n\
echo "Content-Transfer-Encoding: base64"\n\
echo ""\n\
base64 $BACKUP_FILE\n\
echo ""\n\
echo "--boundary--"\n\
) | msmtp -v -a default $BACKUP_EMAIL_TO 2>> $LOGFILE\n\
\n\
if [ $? -ne 0 ]; then\n\
    echo "[$TIMESTAMP] Error: Failed to send email" >> $LOGFILE\n\
    exit 1\n\
fi\n\
\n\
echo "[$TIMESTAMP] Backup completed successfully" >> $LOGFILE\n\
\n\
# Clean up\n\
rm $BACKUP_FILE' > /scripts/backup.sh \
    && chmod +x /scripts/backup.sh

# Configure msmtp with logging
RUN echo '#!/bin/bash\n\
echo "Creating msmtp configuration..."\n\
echo "defaults\n\
auth           on\n\
tls            on\n\
tls_trust_file /etc/ssl/certs/ca-certificates.crt\n\
logfile        /var/log/msmtp.log\n\
\n\
account        default\n\
host           smtp.gmail.com\n\
port           587\n\
from           $BACKUP_EMAIL_FROM\n\
user           $BACKUP_EMAIL_FROM\n\
password       $SMTP_PASSWORD" > /etc/msmtprc\n\
chmod 600 /etc/msmtprc' > /scripts/configure-msmtp.sh \
    && chmod +x /scripts/configure-msmtp.sh

# Set up cron with proper environment
RUN echo '#!/bin/bash\n\
echo "[$(date)] Starting entrypoint wrapper" >> /var/log/cron.log 2>&1\n\
\n\
# Debug environment variables\n\
echo "[$(date)] DEBUG: All environment variables:" >> /var/log/cron.log 2>&1\n\
env | sort >> /var/log/cron.log 2>&1\n\
\n\
# Export environment variables (excluding readonly vars)\n\
env | grep -v "BASH" | grep -v "DIRSTACK" | while read -r line; do\n\
    echo "export $line" >> /root/project_env.sh\n\
done\n\
\n\
# Debug project_env.sh contents\n\
echo "[$(date)] DEBUG: Contents of project_env.sh:" >> /var/log/cron.log 2>&1\n\
cat /root/project_env.sh >> /var/log/cron.log 2>&1\n\
\n\
chmod +x /root/project_env.sh\n\
\n\
echo "[$(date)] Starting cron" >> /var/log/cron.log 2>&1\n\
service cron start\n\
status=$?\n\
if [ $status -ne 0 ]; then\n\
    echo "[$(date)] Failed to start cron: $status" >> /var/log/cron.log 2>&1\n\
    exit $status\n\
fi\n\
\n\
# Start PostgreSQL in background\n\
echo "[$(date)] Starting PostgreSQL" >> /var/log/cron.log 2>&1\n\
docker-entrypoint.sh postgres & \n\
\n\
# Wait for PostgreSQL to be ready\n\
echo "[$(date)] Waiting for PostgreSQL to be ready..." >> /var/log/cron.log 2>&1\n\
for i in {1..60}; do\n\
    if pg_isready -h localhost -U $POSTGRES_USER; then\n\
        echo "[$(date)] PostgreSQL is ready" >> /var/log/cron.log 2>&1\n\
        break\n\
    fi\n\
    echo "[$(date)] Waiting for PostgreSQL... attempt $i" >> /var/log/cron.log 2>&1\n\
    sleep 1\n\
done\n\
\n\
# Run initial backup test\n\
echo "[$(date)] Running initial backup test" >> /var/log/cron.log 2>&1\n\
. /root/project_env.sh && /scripts/backup.sh\n\
\n\
# Keep the container running\n\
wait' > /scripts/entrypoint-wrapper.sh \
    && chmod +x /scripts/entrypoint-wrapper.sh

# Setup cron job with logging and environment sourcing
RUN echo "SHELL=/bin/bash\n\
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/15/bin\n\
1 * * * 1 root . /root/project_env.sh && /scripts/backup.sh >> /var/log/cron.log 2>&1\n\
" > /etc/cron.d/backup-cron \
    && chmod 0644 /etc/cron.d/backup-cron

# Make sure log directory exists and has proper permissions
RUN mkdir -p /var/log \
    && touch /var/log/msmtp.log /var/log/backup.log /var/log/cron.log \
    && chmod 666 /var/log/msmtp.log /var/log/backup.log /var/log/cron.log \
    && chmod 644 /etc/crontab /etc/cron.*/* \
    && touch /var/log/cron.log \
    && chmod 0644 /var/log/cron.log

# Create cron log symlink
RUN ln -sf /proc/1/fd/1 /var/log/cron.log

# Use our wrapper script as entrypoint
CMD ["/bin/bash", "/scripts/entrypoint-wrapper.sh"]