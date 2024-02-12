FROM node:18
LABEL authors="Payton Kentch, Trevor Lichfield"
# update dependencies and install curl
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
# Create app directory
WORKDIR /nodeserv

# Copy files
COPY . /nodeserv/

# update each dependency in package.json to the latest version
RUN npm install

EXPOSE 8000
CMD [ "npm", "run", "docker" ]