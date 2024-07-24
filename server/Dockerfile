FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# first layer caching

COPY . .

EXPOSE 8425

CMD ["npm", "start"]
