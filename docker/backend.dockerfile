FROM node:lts-alpine3.16

RUN apk update && apk upgrade && apk add git
RUN apk add protoc

COPY ./resources /resources
COPY ./crypto-sdk /crypto-sdk
COPY ./zk /zk
COPY ./node /node

# install crypto-sdk
WORKDIR /crypto-sdk

RUN npm i
RUN npm run build

# install ZK sdk
WORKDIR /zk

RUN npm i
RUN npm run build:tsc

# install node
WORKDIR /node

RUN npm i
RUN npm run generate:proto
RUN npm run generate:contracts-data
RUN npm run build

# install backend
WORKDIR /app

COPY ./backend/package.json /app/
COPY ./backend/package-lock.json /app/

RUN npm i

COPY ./backend /app

RUN npm run generate:proto
RUN npm run build
RUN npm prune --production

CMD ["npm", "run", "start"]
EXPOSE 8003