# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------
# Development Dockerfile for the Express + MongoDB server (SmartFinder)
# ---------------------------------------------------------------------

# Use the official Node.js 20 image (Alpine variant for a smaller footprint)
FROM node:20-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy only the package manifests first.
# This lets Docker cache the "npm install" layer and skip reinstalling
# dependencies whenever only source files change.
COPY package.json package-lock.json* ./

# Install project dependencies inside the container.
RUN npm install

# Copy the rest of the project source code into the container.
# (node_modules and .env are excluded via .dockerignore.)
COPY . .

# Expose the Express server port (matches PORT in .env / server.js default)
EXPOSE 5000

# Start the Express server with nodemon for hot-reload during development.
CMD ["npm", "run", "dev"]
