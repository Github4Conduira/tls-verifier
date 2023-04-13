FROM node:lts-alpine3.16

RUN apk update && apk upgrade && apk add git
RUN apk add protoc

COPY ./resources /resources
COPY ./crypto-sdk /crypto-sdk
COPY ./zk /zk

# install crypto-sdk
WORKDIR /crypto-sdk

RUN npm i
RUN npm run build

# install zk sdk
WORKDIR /zk

RUN npm i
RUN npm run build:tsc

# install our witness node
WORKDIR /app

COPY ./node/package.json /app/
COPY ./node/package-lock.json /app/
RUN npm i

COPY ./node /app

RUN npm run generate:proto
RUN npm run generate:contracts-data
RUN npm run build
RUN npm prune --production

CMD ["npm", "run", "start"]
EXPOSE 8001