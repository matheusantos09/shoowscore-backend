FROM node:alpine
WORKDIR /src
COPY ./package.json /src

RUN npm install
COPY ./mongo.js /src
COPY ./.env /src
COPY ./src /src

#EXPOSE 3000
#CMD node app.js
