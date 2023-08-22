FROM node:18-alpine
LABEL authors="coldblade2000"

WORKDIR /code
COPY ./package.json /code/package.json
COPY controllers /code/controllers
COPY models /code/models
COPY routes /code/routes
COPY Utils /code/Utils

RUN npm install
EXPOSE 4000
cmd ["npm", "start"]