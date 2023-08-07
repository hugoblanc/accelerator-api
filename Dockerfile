# Use Node.js v14 as the base image
FROM node:16.14.0-alpine3.14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code to the container
COPY . .
RUN npm run prisma:generate

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "run", "start:prod"]
