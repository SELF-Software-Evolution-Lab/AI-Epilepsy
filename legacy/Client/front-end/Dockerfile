FROM node:18-alpine
LABEL authors="coldblade2000"

WORKDIR /code
COPY ./package.json /code/package.json
COPY public /code/public
COPY src /code/src

RUN npm install

cmd ["npm", "start"]