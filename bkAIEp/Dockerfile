FROM node:18-alpine
LABEL authors="zadiaz"

WORKDIR /code
COPY package.json /code/package.json
COPY tsconfig.json /code/tsconfig.json
COPY .eslintrc.json /code/.eslintrc.json
COPY src /code/src
COPY *.env /code

RUN npm install


EXPOSE 5001

CMD ["npm", "run", "dev"]