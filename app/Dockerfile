# Docker to run SPA application
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

EXPOSE 7878

ENV PORT=7878

CMD ["npm", "start"]
