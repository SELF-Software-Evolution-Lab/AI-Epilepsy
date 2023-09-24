FROM node:18-alpine
LABEL authors="zadiaz"

WORKDIR /code
COPY package.json /code/package.json
COPY tsconfig.json /code/tsconfig.json
COPY .eslintrc.json /code/.eslintrc.json
COPY src /code/src

RUN npm install


EXPOSE 5001

cmd ["npm", "run", "dev"]