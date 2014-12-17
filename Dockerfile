FROM node:0.11.14

MAINTAINER fundon cfddream@gmail.com

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY . /usr/src/app
ONBUILD RUN npm install -g gulp
ONBUILD RUN npm install -g bower
ONBUILD RUN npm install
ONBUILD RUN bower install -p
