# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the application code
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
