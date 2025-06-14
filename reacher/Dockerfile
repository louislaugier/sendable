    # This is a conceptual example, actual dependencies may vary.
    FROM reacherhq/backend:latest

    # Switch to root user to ensure apk has write permissions
    USER root

    # Install Chromium and its dependencies using apk
    # The list of packages might need to be adjusted based on the specific version of Reacher
    # and what it explicitly requires. This is a common set for headless Chromium on Alpine.
    RUN apk add --no-cache \
        chromium \
        nss \
        freetype \
        harfbuzz \
        ttf-freefont \
        unzip \
        && rm -rf /var/cache/apk/*

    # Reacherhq/backend is probably running as a non-root user. If that's the case,
    # you should switch back to that user here. Without knowing the specific user,
    # we'll omit it for now, but be aware of security implications if it continues to run as root.
    # For example, if the original user was 'reacher', you'd add:
    # USER reacher

    # You might also need to set environment variables if Reacher or its underlying headless
    # browser library (like Puppeteer) expects them.
    # For example:
    ENV CHROME_BIN=/usr/bin/chromium-browser \
        PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

    # If Reacher requires specific user permissions or directories for its cache,
    # you might need to add commands to create them and set permissions.
    # For example, if it creates a cache in /tmp, ensure it's writable.