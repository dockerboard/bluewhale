FROM node:0.11.14

MAINTAINER fundon cfddream@gmail.com

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g gulp
RUN npm install -g bower
RUN npm install
RUN bower install -p
RUN gulp build
RUN mv bower_components dist/
