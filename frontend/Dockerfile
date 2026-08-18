# Use official Node image
FROM node:20-slim

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install

# Copy project
COPY . .

# Expose port
EXPOSE 5173

# Run React
CMD ["npm", "run", "dev", "--", "--host"]