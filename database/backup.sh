#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/backup_$TIMESTAMP"
SQL_FILE="$BACKUP_DIR/db_backup.sql"
FINAL_ZIP="$BACKUP_DIR/sendable_backup_$TIMESTAMP.zip"
LOGFILE="/var/log/backup.log"
MAX_EMAIL_SIZE=25000000  # ~25MB in bytes

echo "[$TIMESTAMP] Starting backup" >> $LOGFILE
echo "[$TIMESTAMP] Environment variables:" >> $LOGFILE
echo "SMTP_PASSWORD exists: $(if [ -n "$SMTP_PASSWORD" ]; then echo "yes (length: ${#SMTP_PASSWORD})"; else echo "no"; fi)" >> $LOGFILE

if [ -z "$SMTP_PASSWORD" ]; then
    echo "[$TIMESTAMP] Error: SMTP_PASSWORD is not set" >> $LOGFILE
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Configure msmtp
echo "[$TIMESTAMP] Configuring msmtp..." >> $LOGFILE
cat > /etc/msmtprc << EOF
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        default
host           smtp.gmail.com
port           587
from           $BACKUP_EMAIL_FROM
user           $BACKUP_EMAIL_FROM
password       "${SMTP_PASSWORD}"
tls_starttls   on
EOF

chmod 600 /etc/msmtprc

# Debug msmtp config (hide password)
echo "[$TIMESTAMP] msmtp config:" >> $LOGFILE
grep -v password /etc/msmtprc >> $LOGFILE

# Create database backup
echo "[$TIMESTAMP] Running pg_dump..." >> $LOGFILE
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h localhost -U $POSTGRES_USER $POSTGRES_DB > "$SQL_FILE" 2>> $LOGFILE

if [ $? -ne 0 ]; then
    echo "[$TIMESTAMP] Error: pg_dump failed" >> $LOGFILE
    exit 1
fi

# Create zip containing SQL backup and API files
echo "[$TIMESTAMP] Creating backup zip..." >> $LOGFILE
cd "$BACKUP_DIR"

# First add the SQL file
if [ ! -f "$SQL_FILE" ]; then
    echo "[$TIMESTAMP] Error: SQL backup file not found" >> $LOGFILE
    exit 1
fi

# Create new zip with SQL file
zip "$FINAL_ZIP" "db_backup.sql" >> $LOGFILE 2>&1

# Add API files if they exist
if [ -d "/api_files/files" ]; then
    echo "[$TIMESTAMP] Adding API files to backup..." >> $LOGFILE
    cd /api_files
    zip -r -u "$FINAL_ZIP" files >> $LOGFILE 2>&1
    if [ $? -ne 0 ]; then
        echo "[$TIMESTAMP] Error: API files backup failed" >> $LOGFILE
        exit 1
    fi
else
    echo "[$TIMESTAMP] Warning: API files directory not found, skipping..." >> $LOGFILE
fi

# Verify zip contents
echo "[$TIMESTAMP] Verifying zip contents:" >> $LOGFILE
unzip -l "$FINAL_ZIP" >> $LOGFILE 2>&1

# Function to send email with attachment
send_backup_part() {
    local file="$1"
    local part="$2"
    local total="$3"
    
    echo "[$TIMESTAMP] Sending backup part $part of $total..." >> $LOGFILE
    (
    echo "To: $BACKUP_EMAIL_TO"
    echo "From: $BACKUP_EMAIL_FROM"
    if [ "$total" -gt 1 ]; then
        echo "Subject: Sendable Database Backup $TIMESTAMP (Part $part of $total)"
    else
        echo "Subject: Sendable Database Backup $TIMESTAMP"
    fi
    echo "MIME-Version: 1.0"
    echo "Content-Type: multipart/mixed; boundary=\"boundary\""
    echo ""
    echo "--boundary"
    echo "Content-Type: text/plain"
    echo ""
    echo "Database backup and API files attached."
    echo "Backup timestamp: $TIMESTAMP"
    if [ "$total" -gt 1 ]; then
        echo "This is part $part of $total"
    fi
    echo ""
    echo "--boundary"
    echo "Content-Type: application/zip"
    if [ "$total" -gt 1 ]; then
        echo "Content-Disposition: attachment; filename=\"sendable_backup_${TIMESTAMP}_part${part}.zip\""
    else
        echo "Content-Disposition: attachment; filename=\"sendable_backup_${TIMESTAMP}.zip\""
    fi
    echo "Content-Transfer-Encoding: base64"
    echo ""
    base64 "$file"
    echo ""
    echo "--boundary--"
    ) | msmtp -v -a default $BACKUP_EMAIL_TO 2>> $LOGFILE
}

# Split and send backup if needed
BACKUP_SIZE=$(stat -f %z "$FINAL_ZIP")
NUM_PARTS=$(( (BACKUP_SIZE + MAX_EMAIL_SIZE - 1) / MAX_EMAIL_SIZE ))

if [ $NUM_PARTS -eq 1 ]; then
    send_backup_part "$FINAL_ZIP" 1 1
else
    # Split the zip file
    split -b $MAX_EMAIL_SIZE "$FINAL_ZIP" "$BACKUP_DIR/part_"
    
    PART=1
    for PART_FILE in "$BACKUP_DIR"/part_*; do
        send_backup_part "$PART_FILE" $PART $NUM_PARTS
        PART=$((PART + 1))
    done
fi

if [ $? -ne 0 ]; then
    echo "[$TIMESTAMP] Error: Failed to send email" >> $LOGFILE
    exit 1
fi

echo "[$TIMESTAMP] Backup completed successfully" >> $LOGFILE

# Clean up
rm -rf "$BACKUP_DIR" 