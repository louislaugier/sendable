# Stage 1: Building the app
FROM node:18 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies including 'devDependencies'
RUN npm install

# Copy the project files into the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the app
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy the built app from the builder stage
COPY --from=builder /usr/src/app/build ./build

# Install only production dependencies
COPY package.json ./
COPY package-lock.json* ./
RUN npm install --only=production

# Your app binds to port 3000 by default, make sure the EXPOSE the same port
EXPOSE 3000

# Run the server
CMD ["npm", "start"]
