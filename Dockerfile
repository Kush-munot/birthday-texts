# Use Node.js official image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port
EXPOSE 4000

# Start the app
CMD ["npm", "run", "dev"]
