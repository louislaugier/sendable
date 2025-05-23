# Stage 1: Builder
FROM --platform=linux/amd64 node:18 as builder

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install all dependencies (including devDependencies for the build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner
# Use a smaller base image for the final production image
# For a Remix app using remix-serve, a node image is still appropriate
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy only the build output, package.json, and package-lock.json from the builder stage
COPY --from=builder /frontend/build ./build
COPY --from=builder /frontend/package.json ./
COPY --from=builder /frontend/package-lock.json ./

# Install *only* production dependencies
RUN npm ci --production

# Expose the port the production server runs on (Remix default for remix-serve is 3000)
EXPOSE 3000

# Command to run the production server
CMD ["npm", "run", "start"] 