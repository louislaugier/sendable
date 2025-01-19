# Use buildx with platform specification
FROM --platform=linux/amd64 postgres:15

# Set build arguments for platform compatibility
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Define email configuration only
ENV BACKUP_EMAIL_FROM=louis.laugier.backups@gmail.com
ENV BACKUP_EMAIL_TO=l.laugier@pm.me

# Install required packages
RUN apt-get update && apt-get install -y \
    postgresql-client \
    msmtp \
    msmtp-mta \
    cron \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Create directories and copy files
RUN mkdir -p /scripts /api_files
COPY ./migrations/. /docker-entrypoint-initdb.d/
COPY ./backup.sh /scripts/backup.sh

# Make backup script executable
RUN chmod +x /scripts/backup.sh

# Set up cron with proper environment
COPY ./entrypoint-wrapper.sh /scripts/entrypoint-wrapper.sh
RUN chmod +x /scripts/entrypoint-wrapper.sh

# Setup cron job with logging and environment sourcing
RUN echo "SHELL=/bin/bash\n\
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/15/bin\n\
0 0 * * * root . /root/project_env.sh && /scripts/backup.sh >> /var/log/cron.log 2>&1\n\
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