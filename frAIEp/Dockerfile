FROM node:18-alpine
LABEL authors="zadiaz"

WORKDIR /root
COPY ./package.json /root/package.json
COPY public /root/public
COPY src /root/src
COPY .eslintrc.cjs /code/.eslintrc.cjs
COPY index.html /root/index.html
copy vite.config.js /root/vite.config.js

RUN npm install

EXPOSE 5173

CMD ["npm", "run" , "dev"]