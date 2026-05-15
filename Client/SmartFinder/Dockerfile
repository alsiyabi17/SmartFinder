# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------
# Development Dockerfile for the Vite + React client (SmartFinder)
# ---------------------------------------------------------------------

# Use the official Node.js 20 image (Alpine variant for a smaller footprint)
FROM node:20-alpine

# Set the working directory inside the container.
# All subsequent COPY/RUN/CMD commands run from here.
WORKDIR /app

# Copy only the package manifests first.
# This lets Docker cache the "npm install" layer and skip reinstalling
# dependencies whenever only source files change.
COPY package.json package-lock.json* ./

# Install project dependencies inside the container.
RUN npm install

# Copy the rest of the project source code into the container.
# (node_modules and other junk are excluded via .dockerignore.)
COPY . .

# Expose Vite's default dev server port so the host can reach it.
EXPOSE 5173

# Start the Vite dev server.
# "-- --host" forwards the --host flag to Vite, binding it to 0.0.0.0
# so the server is reachable from outside the container (the browser).
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
