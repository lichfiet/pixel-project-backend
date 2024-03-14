FROM node:18-alpine
LABEL authors="Payton Kentch, Trevor Lichfield"

ENV ENVIRONMENT="start"

# Create app directory
WORKDIR /src

# Copy files
COPY ../ /src/

# update each dependency in package.json to the latest version
RUN npm install --target_arch=x64 --target_platform=linux --target_libc=glibc

EXPOSE 8000
CMD npm run ${ENVIRONMENT}
