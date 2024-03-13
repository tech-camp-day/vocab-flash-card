# Use the official Node.js 14 image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code to the working directory
COPY src/ ./src/

# Expose the port on which the server will run
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
