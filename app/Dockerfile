# Docker to run SPA application
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY .npmrc ./
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 7878

ENV PORT=7878

CMD ["npm", "start"]
