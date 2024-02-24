FROM node:18
LABEL authors="Payton Kentch, Trevor Lichfield"
ARG TARGETARCH
ENV TARGETARCH=${TARGETARCH:-amd64}
# update dependencies and install curl
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
# Create app directory
WORKDIR /src

# Copy files
COPY . /src/

# update each dependency in package.json to the latest version
RUN rm -rf node_modules
RUN npm install -g npm-check-updates
RUN npm install --target_arch=x64 --target_platform=linux --target_libc=glibc

EXPOSE 8000
CMD [ "npm", "run", "start" ]
