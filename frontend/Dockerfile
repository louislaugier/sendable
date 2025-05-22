FROM --platform=linux/amd64 node:18

# Set the environment to production
ENV NODE_ENV=production

# Set the working directory inside the container to /app
WORKDIR /frontend

# Copy package.json and package-lock.json (if available) into the container
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (including devDependencies for the build step)
RUN npm ci

# Copy the rest of the source code into the container
COPY . .

# Build the application for production
RUN npm run build

# Expose the port the production server runs on (Remix default for remix-serve is 3000)
EXPOSE 3000

# Command to run the production server
CMD ["npm", "run", "start"] 