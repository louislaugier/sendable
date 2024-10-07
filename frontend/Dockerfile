# Build Stage
FROM --platform=linux/amd64 node:18 as builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package.json ./
COPY package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build command
RUN npm run build

# Production Stage
FROM --platform=linux/amd64 node:18

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy the build output from the builder stage
COPY --from=builder /usr/src/app/build ./build

# Copy package.json and package-lock.json to install production dependencies
COPY package.json ./
COPY package-lock.json* ./

# Install only production dependencies
# Include the remix dev dependency temporarily for command usage
RUN npm install --production --no-optional && npm install @remix-run/dev

# Optionally, clean up node_modules to remove unnecessary files
RUN npm prune --production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
